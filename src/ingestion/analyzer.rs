use std::ops::Deref;

use chrono::Duration;

use crate::database::DATABASE_CONNECTION;
use crate::ingestion::model::{AnalyzeIngestion, IngestionPhases, SubstanceName};
use crate::ingestion::phase::PhaseWeight;
use crate::ingestion::{Ingestion, IngestionPhase};
use crate::substance::repository::get_substance;
use crate::substance::route_of_administration::dosage::DosageClassification;
use crate::substance::route_of_administration::phase::PhaseClassification;

pub async fn analyze_ingestion(analyze_ingestion: &AnalyzeIngestion) -> miette::Result<Ingestion>
{
	let substance = get_substance(&analyze_ingestion.substance, DATABASE_CONNECTION.deref())
		.await
		.map_err(|e| miette::miette!("Failed to get substance: {}", e))?;

	let substance_name = substance
		.as_ref()
		.map(|f| f.name.clone())
		.unwrap_or(analyze_ingestion.substance.clone());

	let analyze_request = AnalyzeIngestion {
		ingestion_id: analyze_ingestion.ingestion_id,
		substance: substance_name.clone(),
		dosage: analyze_ingestion.dosage,
		date: analyze_ingestion.date,
		roa: analyze_ingestion.roa,
	};

	if substance.is_none() {
		let ingestion = Ingestion {
			id: analyze_ingestion.ingestion_id,
			substance_name: SubstanceName::try_from(analyze_request.substance.clone()).unwrap(),
			ingestion_date: analyze_ingestion.date,
			dosage: analyze_ingestion.dosage,
			phases: IngestionPhases(vec![]),
			duration: None,
			dosage_classification: None,
			route: analyze_ingestion.roa,
		};

		return Ok(ingestion);
	}

	let dosage = analyze_request.dosage;
	let date = analyze_request.date;
	let substance = substance.unwrap();

	let route_of_administration = substance
		.routes_of_administration
		.get(&analyze_request.roa)
		.ok_or_else(|| miette::miette!("Route of administration not found"))?;

	let dosages = &route_of_administration.dosages;
	let ingestion_dosage = dosage;

	let dosage_classification = dosages
		.iter()
		.find(|(_, range)| range.contains(&ingestion_dosage))
		.map(|(classification, _)| *classification)
		.or_else(|| {
			dosages
				.iter()
				.filter_map(|(_classification, range)| {
					match (range.start.as_ref(), range.end.as_ref()) {
						| (Some(start), _) if &ingestion_dosage >= start => {
							Some(DosageClassification::Heavy)
						}
						| (_, Some(end)) if &ingestion_dosage <= end => {
							Some(DosageClassification::Threshold)
						}
						| _ => None,
					}
				})
				.next()
		});

	let phases = &route_of_administration.phases;
	let mut phases_map = vec![];
	let mut prev_phase_end = date..date;

	for phase_class in crate::substance::route_of_administration::phase::PHASE_ORDER.iter() {
		if let Some(duration_range) = phases.get(phase_class) {
			let min_duration =
				chrono::Duration::from_std(duration_range.start.to_std().unwrap()).unwrap();
			let max_duration =
				chrono::Duration::from_std(duration_range.end.to_std().unwrap()).unwrap();

			let phase_start_time_min = prev_phase_end.start;
			let phase_start_time_max = prev_phase_end.end;
			let phase_end_time_min = phase_start_time_min + min_duration;
			let phase_end_time_max = phase_start_time_max + max_duration;
			prev_phase_end = phase_end_time_min..phase_end_time_max;

			let phase_weight = PhaseWeight::calculate(
				ingestion_dosage.clone(),
				*phase_class,
				dosages[&DosageClassification::Common]
					.clone()
					.start
					.unwrap(),
			);

			let phase = IngestionPhase {
				id: None,
				ingestion_id: None,
				classification: *phase_class,
				weight: phase_weight,
				start_time: phase_start_time_min..phase_start_time_max,
				end_time: phase_end_time_min..phase_end_time_max,
				duration: min_duration..max_duration,
				substance_name: analyze_request.substance.clone(),
			};

			phases_map.push(phase);
		}
	}

	let mut duration_min = Duration::zero();
	let mut duration_max = Duration::zero();
	let mut total_min = Duration::zero();
	let mut total_max = Duration::zero();

	for phase in phases_map.clone() {
		total_min += phase.duration.start;
		total_max += phase.duration.end;

		if phase.classification != PhaseClassification::Afterglow {
			duration_min += phase.duration.start;
			duration_max += phase.duration.end;
		}
	}

	let ingestion = Ingestion {
		id: analyze_ingestion.ingestion_id,
		substance_name: SubstanceName::try_from(analyze_request.substance.clone()).unwrap(),
		dosage,
		route: analyze_ingestion.roa,
		ingestion_date: date,
		phases: IngestionPhases(phases_map),
		duration: Some((duration_max - duration_min) / 2),
		dosage_classification,
	};

	Ok(ingestion)
}
