pub mod ingredient;

use clap::{Args, Subcommand};
use hashbrown::HashSet;
use miette::{IntoDiagnostic, Result};
use nutype::nutype;
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseTransaction, EntityTrait, Order, QueryOrder, QuerySelect, TransactionTrait};
use serde::Serialize;
use tabled::Tabled;
use tracing::info;

use crate::database::DATABASE_CONNECTION;
use crate::formulation::ingredient::Ingredient;

type ActiveModel = crate::database::entities::formulation::ActiveModel;
type Entity = crate::database::entities::formulation::Entity;
type Model = crate::database::entities::formulation::Model;

#[nutype(
	sanitize(trim, lowercase),
	validate(not_empty),
	derive(Debug, Clone, Serialize, TryFrom, Into, Hash, PartialEq, Eq, Display)
)]
pub struct FormulationName(String);

/// A set of ingredients that make up a formulation. Each ingredient is
/// associated with a dosage.
pub type FormulationIngredients = HashSet<Ingredient>;

/// The Formulation represents a mixture of different substances
/// combined into a specific preparation or product.
///
/// Formulations contain active pharmaceutical ingredients (APIs) and
/// potentially other excipients that serve various purposes such as improving
/// bioavailability, stability, or administration.
///
/// See: https://en.wikipedia.org/wiki/Pharmaceutical_formulation
#[derive(Debug, Clone, Tabled)]
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
	#[tabled(format = "{:#?}")]
	pub ingredients: FormulationIngredients,
}

#[derive(Debug, Clone, Args)]
pub struct CreateFormulation
{
	#[arg(short, long)]
	name: String,
	#[arg(short, long)]
	description: Option<String>,
}

pub async fn create_formulation(
	create_formulation: &CreateFormulation, database_transaction: &DatabaseTransaction,
) -> miette::Result<Formulation>
{
	let model = {
		let active_model = ActiveModel {
			id: sea_orm::ActiveValue::NotSet,
			name: sea_orm::ActiveValue::Set(create_formulation.name.clone().into()),
			summary: sea_orm::ActiveValue::Set(create_formulation.description.clone()),
			labeller: sea_orm::ActiveValue::NotSet,
			form: sea_orm::ActiveValue::NotSet,
			route: sea_orm::ActiveValue::Set("oral".into()),
		};

		Entity::insert(active_model)
			.exec_with_returning(database_transaction)
			.await
			.into_diagnostic()
	}?;

	let formulation = Formulation {
		id: Some(model.id),
		description: model.summary,
		ingredients: HashSet::new(),
		name: FormulationName::try_from(model.name).into_diagnostic()?,
	};

	info!("Formulation Created");

	Ok(formulation)
}

#[async_std::test]
async fn should_create_formulation()
{
	use sea_orm::EntityTrait;

	use super::*;
	let db_connection = &DATABASE_CONNECTION;
	let tx = db_connection.begin().await.unwrap();

	let result = create_formulation(
		&CreateFormulation {
			name: "test formulation".into(),
			description: Some("Test description".into()),
		},
		&tx,
	)
	.await
	.unwrap();

	tx.commit().await.unwrap();

	assert_eq!(result.id, Some(1));
	assert_eq!(result.name.to_string(), "test formulation");
	assert_eq!(result.description, Some("Test description".into()));
}

#[derive(Debug, Clone, Args)]
pub struct UpdateFormulation
{
	#[arg(index = 1, value_name = "FORMULATION_ID")]
	id: i32,
	#[arg(short, long)]
	name: Option<String>,
	#[arg(short, long)]
	description: Option<String>,
}

pub async fn update_formulation(
	update_formulation: &crate::formulation::UpdateFormulation,
	database_transaction: &DatabaseTransaction,
) -> miette::Result<Formulation> {
	use sea_orm::{ColumnTrait, EntityTrait, QueryFilter, Set};

	let original = Entity::find_by_id(update_formulation.id)
		.one(database_transaction)
		.await
		.into_diagnostic()?
		.ok_or_else(|| miette::miette!("Formulation not found"))?;

	let mut active_model: ActiveModel = original.clone().into();

	if let Some(name) = &update_formulation.name {
		active_model.name = Set(name.to_owned());
	}

	if let Some(description) = &update_formulation.description {
		active_model.summary = Set(Some(description.to_owned()));
	}

	let updated_model = active_model
		.update(database_transaction)
		.await
		.into_diagnostic()?;

	let formulation = Formulation {
		id: Some(updated_model.id),
		name: FormulationName::try_from(updated_model.name).into_diagnostic()?,
		description: updated_model.summary,
		ingredients: HashSet::new(),
	};

	info!("Formulation Updated");

	Ok(formulation)
}
#[async_std::test]
async fn should_update_formulation() {
	use sea_orm::EntityTrait;

	use super::*;
	let db_connection = &DATABASE_CONNECTION;
	let tx = db_connection.begin().await.unwrap();

	let created_formulation = create_formulation(
		&CreateFormulation {
			name: "test formulation".into(),
			description: Some("Test description".into()),
		},
		&tx,
	)
	.await
	.unwrap();

	let updated_formulation = update_formulation(
		&UpdateFormulation {
			id: created_formulation.id.unwrap(),
			name: Some("updated formulation".into()),
			description: Some("Updated description".into()),
		},
		&tx,
	)
	.await
	.unwrap();

	tx.commit().await.unwrap();

	assert_eq!(updated_formulation.id, created_formulation.id);
	assert_eq!(updated_formulation.name.to_string(), "updated formulation");
	assert_eq!(updated_formulation.description, Some("Updated description".into()));
}

#[derive(Debug, Clone, Args)]
pub struct DeleteFormulation
{
	#[arg(index = 1, value_name = "FORMULATION_ID")]
	id: i32,

	/// Skip confirmation prompt
	#[arg(short='y', long="no-confirm")]
	pub confirmation: bool,

	/// Whether to prompt for confirmation
	#[arg(short='i',long, default_value_t=crate::cli::is_interactive())]
	pub interactive: bool,
}

pub async fn delete_formulation(
	delete_formulation: &crate::formulation::DeleteFormulation, transaction: &DatabaseTransaction,
) -> miette::Result<()>
{
	use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};
	use crate::Exception;
	
	let formulation = Entity::find()
		.filter(crate::database::entities::formulation::Column::Id.eq(delete_formulation.id))
		.one(transaction)
		.await
		.into_diagnostic()?;
	
	if formulation.is_none() {
		return Err(miette::miette!("Formulation not found"));
	}
	

	let is_confirmed = if !delete_formulation.confirmation && delete_formulation.interactive {
		use dialoguer::Confirm;
		Confirm::new()
			.with_prompt("Operation will be irreversible, are you sure?")
			.default(false)
			.interact()
			.into_diagnostic()?
	} else {
		delete_formulation.confirmation
	};

	if !is_confirmed {
		return Err(Exception::DestructiveOperationNotConfirmed.into());
	}

	Entity::delete_by_id(delete_formulation.id)
		.exec(transaction)
		.await
		.into_diagnostic()?;

	info!("Formulation Deleted");

	Ok(())
}

#[async_std::test]
async fn should_delete_formulation()
{
	use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};

	let db_connection = &DATABASE_CONNECTION;
	let tx = db_connection.begin().await.unwrap();
	
	let created_formulation = create_formulation(
		&CreateFormulation {
			name: "test formulation".into(),
			description: Some("Test description".into()),
		},
		&tx,
	)
	.await
	.unwrap();

	let formulation_id = created_formulation.id.unwrap();
	
	delete_formulation(&DeleteFormulation { id: formulation_id, confirmation: true, interactive: false }, &tx)
		.await
		.unwrap();

	let result = Entity::find()
		.filter(crate::database::entities::formulation::Column::Id.eq(formulation_id))
		.one(&tx)
		.await
		.unwrap();
	
	assert!(result.is_none());

	tx.commit().await.unwrap();
}

#[derive(Debug, Clone, Args)]
pub struct ListFormulations
{
	/// Filter formulations by name (contains search)
	#[arg(long)]
	pub name: Option<String>,
	/// Limit the number of results
	#[arg(long, default_value = "50")]
	pub limit: u32,
}

pub async fn list_formulations(
	list_formulations: &crate::formulation::ListFormulations,
	transaction: &sea_orm::DatabaseTransaction,
) -> Result<Vec<crate::formulation::Formulation>> {
	use crate::database::entities::formulation::{Column, Entity};
	use sea_orm::QueryFilter;

	let mut query = Entity::find();

	if let Some(ref name_filter) = list_formulations.name {
		query = query.filter(Column::Name.contains(name_filter));
	}

	query = query.order_by(Column::Id, Order::Asc).limit(list_formulations.limit as u64);

	let models = query.all(transaction).await.into_diagnostic()?;

	let formulations = models
		.into_iter()
		.map(|model| crate::formulation::Formulation {
			id: Some(model.id),
			name: crate::formulation::FormulationName::try_from(model.name)
				.expect("Invalid formulation name"),
			description: model.summary,
			ingredients: HashSet::new(),
		})
		.collect();

	Ok(formulations)
}


#[async_std::test]
async fn should_list_formulations() {
	use sea_orm::EntityTrait;

	use super::*;
	let db_connection = &DATABASE_CONNECTION;
	let tx = db_connection.begin().await.unwrap();

	create_formulation(
		&CreateFormulation {
			name: "test formulation 1".into(),
			description: Some("Test description 1".into()),
		},
		&tx,
	)
		.await
		.unwrap();

	create_formulation(
		&CreateFormulation {
			name: "test formulation 2".into(),
			description: Some("Test description 2".into()),
		},
		&tx,
	)
		.await
		.unwrap();


	let result = list_formulations(&ListFormulations {
		name: None,
		limit: 50,
	}, &tx).await.unwrap();

	tx.commit().await.unwrap();

	assert_eq!(result.len(), 2);
	assert_eq!(result[0].name.to_string(), "test formulation 1");
	assert_eq!(result[1].name.to_string(), "test formulation 2");

	let tx = db_connection.begin().await.unwrap();


	let result = list_formulations(&ListFormulations {
		name: Some("test formulation 1".into()),
		limit: 50,
	}, &tx).await.unwrap();

	assert_eq!(result.len(), 1);
	assert_eq!(result[0].name.to_string(), "test formulation 1");


	// List formulations with limit.
	let result = list_formulations(&ListFormulations {
		name: None,
		limit: 1,
	}, &tx).await.unwrap();

	assert_eq!(result.len(), 1);
	assert_eq!(result[0].name.to_string(), "test formulation 1");

}

#[derive(Debug, Clone, Args)]
pub struct GetFormulation {
    #[arg(index = 1, value_name = "FORMULATION_ID")]
    id: i32,
}

pub async fn get_formulation(
    get_formulation: &crate::formulation::GetFormulation,
    transaction: &DatabaseTransaction,
) -> miette::Result<Formulation> {
    use sea_orm::{EntityTrait, ColumnTrait, QueryFilter};

    let formulation = Entity::find()
        .filter(crate::database::entities::formulation::Column::Id.eq(get_formulation.id))
        .one(transaction)
        .await.into_diagnostic()?
        .ok_or_else(|| miette::miette!("Formulation not found"))?;

	Ok(Formulation {
		id: Some(formulation.id),
	    name: FormulationName::try_from(formulation.name).into_diagnostic()?,
		description: formulation.summary,
		ingredients: HashSet::new(),
	})
}

#[async_std::test]
async fn should_get_formulation() {
    use sea_orm::EntityTrait;

    use super::*;
    let db_connection = &DATABASE_CONNECTION;
    let tx = db_connection.begin().await.unwrap();

    let created_formulation = create_formulation(
        &CreateFormulation {
            name: "test formulation".into(),
            description: Some("Test description".into()),
        },
        &tx,
    )
    .await
    .unwrap();

    let result = get_formulation(
        &GetFormulation {
            id: created_formulation.id.unwrap(),
        },
        &tx,
    )
    .await
    .unwrap();

    tx.commit().await.unwrap();

    assert_eq!(result.id, created_formulation.id);
    assert_eq!(result.name.to_string(), "test formulation");
    assert_eq!(result.description, Some("Test description".into()));
}

#[derive(Debug, Subcommand, Clone)]
pub enum Command
{
	/// Create a new formulation
	Create(CreateFormulation),

	/// Update an existing formulation
	Update(UpdateFormulation),

	/// Delete a formulation
	Delete(DeleteFormulation),

	/// List formulations with optional filters
	List(ListFormulations),

	/// Get a specific formulation by ID
	Get(GetFormulation),

	/// Manage ingredients for a formulation
	Ingredient(ingredient::Entrypoint)
}
