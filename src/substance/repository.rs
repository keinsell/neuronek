use crate::database::entities;
use crate::database::entities::substance;
use crate::substance::error::SubstanceError;
use crate::substance::route_of_administration::dosage::Dosage;
use crate::substance::route_of_administration::dosage::DosageClassification;
use crate::substance::route_of_administration::dosage::DosageRange;
use crate::substance::route_of_administration::phase::DurationRange;
use crate::substance::route_of_administration::phase::PhaseClassification;
use crate::substance::route_of_administration::RouteOfAdministration;
use crate::substance::route_of_administration::RouteOfAdministrationClassification;
use crate::substance::{RoutesOfAdministration, SystematicName};
use crate::substance::Substance;
use cached::proc_macro::io_cached;
use futures::stream::FuturesUnordered;
use futures::StreamExt;
use iso8601_duration::Duration;
use miette::miette;
use miette::IntoDiagnostic;
use sea_orm::ColumnTrait;
use sea_orm::EntityTrait;
use sea_orm::ModelTrait;
use sea_orm::QueryFilter;
use std::str::FromStr;

// #[io_cached(
//     disk = true,
//     sync_to_disk_on_cache_change = false,
//     map_error = r##"|e| SubstanceError::DiskError"##,
//     time = 2592000000
// )]
async fn enrich_substance_name_query(name: &str) -> Result<String, SubstanceError>
{
    Ok(pubchem::Compound::with_name(name)
        .title()
        .into_diagnostic()
        .unwrap_or(name.to_string()))
}


pub async fn get_substance(
    name: &str,
    db: &sea_orm::DatabaseConnection,
) -> miette::Result<Option<Substance>>
{
    let substance_name = enrich_substance_name_query(name).await?;

    let db_substance = substance::Entity::find()
        .filter(
            substance::Column::Name
                .eq(substance_name.to_lowercase())
                .or(substance::Column::CommonNames.contains(name.to_lowercase())),
        )
        .one(db)
        .await
        .into_diagnostic()?;

    let db_substance = match db_substance
    {
        | Some(substance) => substance,
        | None => return Ok(None),
    };

    let routes_of_administration = db_substance
        .find_related(entities::substance_route_of_administration::Entity)
        .all(db)
        .await
        .into_diagnostic()?;

    let mut substance = Substance {
        name: db_substance.name,
        systematic_name: None,
        routes_of_administration: RoutesOfAdministration::new(),
    };

    let db_connection = db.clone();
    let route_futures = routes_of_administration.into_iter().map(|route| {
        let db = db_connection.clone();
        async move {
            let classification = RouteOfAdministrationClassification::from_str(&route.name)
                .map_err(|e| miette!(format!("{:?}", e)))?;
            let mut roa = RouteOfAdministration {
                classification,
                dosages: Default::default(),
                phases: Default::default(),
            };

            let dosages = route
                .find_related(entities::substance_route_of_administration_dosage::Entity)
                .all(&db)
                .await
                .into_diagnostic()?;

            for dosage in dosages
            {
                let dosage_classification = DosageClassification::from_str(&dosage.intensity)
                    .map_err(|_| miette!("Failed to parse dosage classification"))?;

                let lower_bound = dosage
                    .lower_bound_amount
                    .map(|amount| Dosage::from_str(&format!("{} {}", amount, dosage.unit)))
                    .transpose()
                    .map_err(|e| {
                        miette!("Failed to parse lower_bound_amount into Dosage: {}", e)
                    })?;

                let upper_bound = dosage
                    .upper_bound_amount
                    .map(|amount| Dosage::from_str(&format!("{} {}", amount, dosage.unit)))
                    .transpose()
                    .map_err(|e| {
                        miette!("Failed to parse upper_bound_amount into Dosage: {}", e)
                    })?;

                roa.dosages.insert(
                    dosage_classification,
                    DosageRange::from_bounds(lower_bound, upper_bound),
                );
            }

            let phases = route
                .find_related(entities::substance_route_of_administration_phase::Entity)
                .all(&db)
                .await
                .into_diagnostic()?;

            for phase in phases
            {
                let classification = PhaseClassification::from_str(&phase.classification)
                    .map_err(|_| miette!("Failed to parse phase classification"))?;

                let lower_duration = Duration::from_str(&phase.lower_duration.unwrap_or_default())
                    .map_err(|_| miette!("Failed to parse duration"))?;
                let upper_duration = Duration::from_str(&phase.upper_duration.unwrap_or_default())
                    .map_err(|_| miette!("Failed to parse duration"))?;

                roa.phases.insert(
                    classification,
                    DurationRange::from(lower_duration..upper_duration),
                );
            }

            Ok::<_, miette::Report>((classification, roa))
        }
    });

    let mut route_stream = FuturesUnordered::from_iter(route_futures);

    while let Some(result) = route_stream.next().await
    {
        match result
        {
            | Ok((classification, roa)) =>
                {
                    substance
                        .routes_of_administration
                        .insert(classification, roa);
                }
            | Err(e) => return Err(e),
        }
    }

    Ok(Some(substance))
}
