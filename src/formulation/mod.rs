use std::convert::Into;

use owo_colors::OwoColorize;
use sea_orm::{ActiveValue, ColumnTrait, DbErr, IntoActiveModel, IntoActiveValue, ModelTrait, QueryFilter, QueryTrait};

use crate::database::entities::formulation::Column;
pub mod ingredient;
use std::fmt::Debug;
use std::ops::Deref;

use clap::{Args, Parser, Subcommand};
use derive_more::TryFrom;
use futures::executor::block_on;
use hashbrown::HashMap;
use itertools::{assert_equal, Itertools};
use miette::{miette, IntoDiagnostic, Result};
use minimo::info;
use nutype::nutype;
use rust_decimal::prelude::ToPrimitive;
use sea_orm::prelude::DateTimeLocal;
use sea_orm::{DatabaseConnection, EntityTrait, QuerySelect};
use serde::{Deserialize, Serialize};
use tabled::Tabled;
use tracing::info;
use uuid::Uuid;

use crate::database::entities::{formulation, formulation_ingredient, ingestion_phase};
use crate::database::DATABASE_CONNECTION;
use crate::formulation::ingredient::{FormulationIngredient, GetFormulationIngredient};
use crate::ingestion::model::SubstanceName;
use crate::substance::route_of_administration::dosage::Dosage;
use crate::Exception::EntityNotFound;
pub use ingredient::create_formulation_ingredient;

const FORMULATION_NAME_SHORT: char = std::ascii::Char::SmallN.to_char();

#[nutype(
    sanitize(trim, lowercase),
    validate(not_empty),
    derive(Debug, Clone, Serialize, TryFrom, Into, Hash, PartialEq, Eq, Display)
)]
pub struct FormulationName(String);

/// The Formulation represents a mixture of different substances
/// combined into a specific preparation or product.
///
/// Formulations contain active pharmaceutical ingredients (APIs) and
/// potentially other excipients that serve various purposes such as improving
/// bioavailability, stability, or administration.
///
/// See: https://en.wikipedia.org/wiki/Pharmaceutical_formulation
#[derive(Debug, Serialize, Clone, Tabled)]
#[tabled(display(Option, "tabled::derive::display::option", "---"))]
pub struct Formulation
{
    /// Unique identifier for the formulation, only present for persisted
    /// formulations
    pub id: Option<i32>,
    /// Name of the formulation
    pub name: FormulationName,
    /// Optional descriptive text about the formulation
    pub description: Option<String>,
    /// List of substances that make up this formulation, each with their own
    /// dosage
    #[tabled(inline)]
    pub ingredients: FormulationIngredients,
}

impl From<formulation::Model> for Formulation
{
    fn from(model: formulation::Model) -> Self
    {
        let id = Some(model.id);
        let name = FormulationName::try_from(model.name).expect("Invalid formulation name");
        Formulation {
            id,
            name,
            description: model.summary,
            ingredients: FormulationIngredients::default(),
        }
    }
}
impl Into<formulation::ActiveModel> for Formulation
{
    fn into(self) -> formulation::ActiveModel
    {
        formulation::ActiveModel {
            id: self.id.map_or(sea_orm::ActiveValue::NotSet, |id| {
                sea_orm::ActiveValue::Set(id)
            }),
            name: sea_orm::ActiveValue::Set(self.name.into()),
            summary: sea_orm::ActiveValue::Set(self.description),
            labeller: sea_orm::ActiveValue::NotSet,
            form: sea_orm::ActiveValue::NotSet,
            route: sea_orm::ActiveValue::Set("oral".into()),
        }
    }
}

#[derive(Clone, Debug, Default, Serialize, Tabled)]

pub struct FormulationIngredients(
    #[tabled(format = "{:?}", rename = "ingredients")] hashbrown::HashMap<SubstanceName, Dosage>,
);

#[derive(Debug, Args, Clone)]
pub struct CreateFormulation
{
    #[clap(short, long)]
    name: String,
    #[clap(short, long)]
    description: Option<String>,
}


#[derive(Debug, Parser, Default, Clone)]
#[command(
    subcommand_required = false,
    args_conflicts_with_subcommands = true,
    arg_required_else_help = false
)]
pub struct GetFormulation
{
    #[arg(
        index = 1,
        value_name = "FORMULATION_ID",
        help = "identification of formulation for operation",
        required = true
    )]
    pub id: Option<u32>,
}

#[derive(Debug, Parser, Clone)]
#[command(
    subcommand_required = false,
    args_conflicts_with_subcommands = true,
    arg_required_else_help = false
)]
pub struct ListFormulation
{
    // add limit with default to 10
    #[arg(
        long = "limit",
        short = 'l',
        default_value_t = 10u64,
        help = "limit of formulations to return"
    )]
    pub limit: u64,
}

impl Default for ListFormulation
{
    fn default() -> Self { Self { limit: 10 } }
}

#[derive(Debug, Clone, Args)]
#[command()]
pub struct IngestFormulation
{
    #[arg()]
    pub ingestion_date: DateTimeLocal,
}


#[derive(Debug, Subcommand, Clone)]
pub enum Command
{
    Create(CreateFormulation),
    Update(UpdateFormulation),
    Delete(DeleteFormulation),
    View(GetFormulation),
    List(ListFormulation),
    Igr(GetFormulationIngredient),
}

pub fn create_formulation(
    create_formulation: &CreateFormulation, db_connection: &DatabaseConnection,
) -> Formulation
{
    let formation = Formulation {
        id: None,
        ingredients: FormulationIngredients::default(),
        description: create_formulation.description.clone(),
        name: FormulationName::try_from(create_formulation.name.clone())
            .into_diagnostic()
            .unwrap(),
    };

    let formulation = block_on(async {
        let active_model = formulation::ActiveModel {
            id: formation.id.map_or(sea_orm::ActiveValue::NotSet, |id| {
                sea_orm::ActiveValue::Set(id)
            }),
            name: sea_orm::ActiveValue::Set(formation.name.into()),
            summary: sea_orm::ActiveValue::Set(formation.description),
            labeller: sea_orm::ActiveValue::NotSet,
            form: sea_orm::ActiveValue::NotSet,
            route: sea_orm::ActiveValue::Set("oral".into()),
        };
        let model = formulation::Entity::insert(active_model)
            .exec(DATABASE_CONNECTION.deref());
        let formulation = model.await.unwrap();
        let formulation =
            formulation::Entity::find_by_id(formulation.last_insert_id)
                .one(DATABASE_CONNECTION.deref())
                .await
                .unwrap()
                .unwrap();
        formulation
    });

    let formulation = Formulation::from(formulation);
    info!("Formulation created: {:?}", &formulation);

    formulation
}

#[test]
#[cfg(test)]
/// Validates core business rules for pharmaceutical formulation creation - case
/// ensures reliability of creating new empty formulation with correctly
/// provided information.
pub fn should_create_formulation()
{
    use sea_orm::EntityTrait;

    use super::*;
    let db_connection = &DATABASE_CONNECTION;

    let result = create_formulation(
        &CreateFormulation {
            name: "test formulation".into(),
            description: Some("Test description".into()),
        },
        db_connection,
    );

    assert_eq!(result.id, Some(1));
    assert_eq!(result.name.to_string(), "test formulation");
    assert_eq!(result.description, Some("Test description".into()));
    assert!(result.ingredients.0.is_empty());
}

#[derive(Debug, Args, Clone)]
#[command(name = "update")]
pub struct UpdateFormulation
{
    #[arg(long, short)]
    id: i32,
    #[arg(long, short=FORMULATION_NAME_SHORT)]
    name: Option<String>,
    #[arg(long)]
    description: Option<String>,
}

pub fn update_formulation(
    update_formulation: &UpdateFormulation, db_connection: &DatabaseConnection,
) -> Result<Formulation>
{
    let formulation = block_on(async {
        let active_model = formulation::ActiveModel {
            id: ActiveValue::Set(update_formulation.id.clone()),
            name: update_formulation
                .name
                .as_ref()
                .map_or(sea_orm::ActiveValue::NotSet, |name| {
                    ActiveValue::Set(name.clone())
                }),
            summary: update_formulation
                .description
                .as_ref()
                .map_or(sea_orm::ActiveValue::NotSet, |description| {
                    ActiveValue::Set(Option::from(description.clone()))
                }),
            ..Default::default()
        };

        formulation::Entity::update(active_model)
            .filter(formulation::Column::Id.eq(update_formulation.id))
            .exec(db_connection)
            .await
            .into_diagnostic()
            .unwrap();

        let formulation =
            formulation::Entity::find_by_id(update_formulation.id)
                .one(db_connection)
                .await
                .into_diagnostic()
                .unwrap();

        formulation
    })
        .unwrap();

    let formulation = Formulation::from(formulation);

    Ok(formulation)
}

#[cfg(test)]
#[test]
pub fn should_update_formulation()
{
    use sea_orm::EntityTrait;

    use super::*;
    let db_connection = &DATABASE_CONNECTION;

    let formulation = create_formulation(
        &CreateFormulation {
            name: "test formulation".into(),
            description: Some("Test description".into()),
        },
        db_connection,
    );

    let formulation = update_formulation(
        &UpdateFormulation {
            id: formulation.id.expect("REASON"),
            name: Some("updated_formulation".parse().unwrap()),
            description: None,
        },
        db_connection,
    )
        .unwrap();

    assert_eq!(
        formulation.name,
        FormulationName::try_from("updated_formulation").unwrap()
    );
}

#[derive(Debug, Args, Clone)]
pub struct DeleteFormulation
{
    #[arg(
        index = 1,
        value_name = "FORMULATION_ID",
        help = "identification of formulation for operation",
        required = true
    )]
    id: i32,
    #[clap(short = 'y', long = "no-confirm")]
    pub confirmation: Option<bool>,
}

pub fn delete_formulation(
    delete_formulation: &DeleteFormulation, database_connection: &DatabaseConnection,
) -> Result<()>
{
    block_on(async {
        let model =
            formulation::Entity::find_by_id(delete_formulation.id)
                .one(database_connection)
                .await
                .map_err(|db_err: DbErr| miette!("Database error: {}", db_err))?
                .ok_or_else(|| miette!("Entity not found"))?;

        let delete_result =
            formulation::Entity::delete(model.into_active_model())
                .exec(database_connection)
                .await
                .map_err(|db_err: DbErr| miette!("Database error during delete: {}", db_err))?
                .rows_affected;

        if delete_result != 1 {
            return Err(miette!("Delete failed, {} rows affected", delete_result));
        }

        Ok(())
    })
}

#[cfg(test)]
#[test]
pub fn should_delete_formulation()
{
    use sea_orm::EntityTrait;

    use super::*;
    let db_connection = &DATABASE_CONNECTION;

    let formulation = create_formulation(
        &CreateFormulation {
            name: "test formulation".into(),
            description: Some("Test description".into()),
        },
        db_connection,
    );

    let formulation_id = formulation.id.unwrap();

    delete_formulation(
        &DeleteFormulation {
            id: formulation_id,
            confirmation: Some(true),
        },
        db_connection,
    )
        .unwrap();


    let fetched_formulation = block_on(async {
        crate::database::entities::formulation::Entity::find_by_id(formulation_id)
            .one(db_connection.deref())
            .await
            .unwrap()
    });

    assert!(fetched_formulation.is_none());
}

pub fn ingest_formulation() { todo!() }

#[cfg(test)]
#[test]
pub fn should_ingest_formulation() { todo!() }

pub fn get_formulation(
    get_formulation: &GetFormulation, database_connection: &DatabaseConnection,
) -> Option<Formulation>
{
    let model = block_on(async {
        let formulations = formulation::Entity::find()
            .filter(formulation::Column::Id.eq(get_formulation.id))
            .one(database_connection)
            .await
            .unwrap();

        formulations
    });

    if (model.is_none()) { return None; }
    let model = model.unwrap();

    let mut formulation = Formulation::from(model.clone());

    let ingredients = block_on(async {
        model.find_related(crate::database::entities::formulation_ingredient::Entity).all(database_connection).await.unwrap()
    });

    formulation.ingredients = {
        let mut fim = FormulationIngredients::default().0;
        ingredients.iter().map(|model| {
            let ingr = FormulationIngredient {
                substance_name: SubstanceName::try_from(model.substance_name.clone()).unwrap(),
                substance_dosage: Dosage::from_base_units(model.dosage.to_f64().unwrap()),
                formulation_id: model.formulation_id,
                id: Some(model.id),
            };

            fim.insert(ingr.substance_name, ingr.substance_dosage);
        });
        FormulationIngredients(fim)
    };

    Some(formulation)
}

#[cfg(test)]
#[test]
fn should_get_formulation()
{
    use sea_orm::EntityTrait;

    use super::*;
    let db_connection = &DATABASE_CONNECTION;

    create_formulation(
        &CreateFormulation {
            name: "test formulation".into(),
            description: Some("Test description".into()),
        },
        db_connection,
    );

    let maybe_formulation = get_formulation(&GetFormulation { id: Some(1) }, db_connection);

    assert!(maybe_formulation.is_some());
}

pub fn list_formulations(
    list_formulations: &ListFormulation, database_connection: &DatabaseConnection,
) -> Vec<Formulation>
{
    let formulations = block_on(async {
        let formulations = formulation::Entity::find()
            .limit(list_formulations.limit)
            .all(database_connection)
            .await
            .unwrap();

        formulations
    });

    formulations.into_iter().map(Formulation::from).collect()
}

#[test]
#[cfg(test)]
pub fn should_list_formulations()
{
    use sea_orm::EntityTrait;

    use super::*;
    let db_connection = &DATABASE_CONNECTION;

    create_formulation(
        &CreateFormulation {
            name: "test formulation".into(),
            description: Some("Test description".into()),
        },
        db_connection,
    );

    let formulation_list = list_formulations(&ListFormulation { limit: 10 }, db_connection);

    assert_eq!(formulation_list.len(), 1);
}
