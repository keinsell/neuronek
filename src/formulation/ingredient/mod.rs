use crate::database::entities::ingestion::Column::RouteOfAdministration;
use crate::database::{DatabaseConnection, DATABASE_CONNECTION};
use crate::formulation::{create_formulation, FormulationIngredients, FormulationName};
use crate::ingestion::model::SubstanceName;
use crate::substance::repository::get_substance;
use crate::substance::route_of_administration::dosage::Dosage;
use crate::substance::route_of_administration::RouteOfAdministrationClassification;
use clap::{Parser, Subcommand};
use futures::executor::block_on;
use miette::IntoDiagnostic;
use rust_decimal::prelude::ToPrimitive;
use sea_orm::EntityTrait;
use sea_orm::{ActiveValue, IntoActiveValue};
use serde::Serialize;
use std::ops::Deref;
use tabled::Tabled;
use tracing::info;
use uuid::Uuid;

#[derive(Debug, Serialize, Tabled)]
#[tabled(display(Option, "tabled::derive::display::option", "---"))]
pub struct FormulationIngredient
{
    pub(crate) id: Option<i32>,
    pub(crate) formulation_id: i32,
    pub(crate) substance_name: SubstanceName,
    pub(crate) substance_dosage: Dosage,
}

#[derive(Debug, Parser, Clone)]
#[command()]
pub struct CreateFormulationIngredient
{
    #[clap(short = 'f', long)]
    formulation_id: i32,
    #[clap(short = 's', long)]
    substance_name: String,
    #[clap(short = 'd', long)]
    dosage: Dosage,
}

pub async fn create_formulation_ingredient(create_formulation_ingredient: CreateFormulationIngredient, database_connection: &DatabaseConnection) -> miette::Result<FormulationIngredient> {
    let substance = get_substance(create_formulation_ingredient.substance_name.as_ref(), database_connection).await?;
    let substance_name = if substance.is_some() { substance.unwrap().name } else { create_formulation_ingredient.substance_name };

    let formulation_ingredient = FormulationIngredient {
        id: None,
        formulation_id: create_formulation_ingredient.formulation_id,
        substance_name: SubstanceName::try_from(substance_name).into_diagnostic()?,
        substance_dosage: create_formulation_ingredient.dosage,
    };

    let model = {
        let dosage =
            {
                let base = formulation_ingredient.substance_dosage.as_base_units();
                rust_decimal::Decimal::from_f64_retain(base).unwrap()
            };
        let active_model = crate::database::entities::formulation_ingredient::ActiveModel {
            id: ActiveValue::NotSet,
            formulation_id: formulation_ingredient.formulation_id.into_active_value(),
            substance_name: ActiveValue::Set(formulation_ingredient.substance_name.into_inner()),
            dosage: dosage.into_active_value(),
        };

        let model = crate::database::entities::formulation_ingredient::Entity::insert(active_model)
            .exec_with_returning(database_connection)
            .await
            .into_diagnostic()?;

        model
    };

    let formulation_ingredient = FormulationIngredient {
        id: Some(model.id),
        formulation_id: model.formulation_id,
        substance_name: model.substance_name.try_into().unwrap(),
        substance_dosage: Dosage::from_base_units(model.dosage.to_f64().unwrap()),
    };

    info!("Formulation ingredient  created: {:?}", &formulation_ingredient);

    Ok(formulation_ingredient)
}

#[async_std::test]
async fn should_create_formulation_ingredient(create_formulation_ingredient: &CreateFormulationIngredient, database_connection: &DatabaseConnection) {
    use sea_orm::DatabaseConnection;
    use crate::substance::route_of_administration::dosage::Dosage;
    use crate::database::entities::formulation::Entity as Formulation;
    use crate::database::entities::formulation::ActiveModel as FormulationModel;
    let db: &DatabaseConnection = DATABASE_CONNECTION.deref();

    let formulation = FormulationModel {
        id: ActiveValue::NotSet,
        name: "caffeine pill".to_string().into_active_value(),
        summary: ActiveValue::NotSet,
        labeller: ActiveValue::NotSet,
        form: ActiveValue::NotSet,
        route: "oral".to_string().into_active_value(),
    };

    let formulation = Formulation::insert(formulation).exec_with_returning(db).await.unwrap();

    let create_formulation_ingredient_cmd = CreateFormulationIngredient {
        formulation_id: formulation.id,
        substance_name: "caffeine".to_string(),
        dosage: Dosage::from_milligrams(200f64),
    };

    let result = create_formulation_ingredient(create_formulation_ingredient_cmd.clone(), &db).await;

    let created_ingredient = result.unwrap();

    assert_eq!(created_ingredient.formulation_id, formulation.id);
    assert_eq!(created_ingredient.substance_name.to_string(), "Caffeine".to_string());
    assert_eq!(created_ingredient.substance_dosage.to_string(), "200 mg");
}

#[derive(Debug, Parser, Clone)]
pub struct UpdateFormulationIngredient
{
    /// The identifier of the formulation ingredient to update.
    #[clap(short = 'i', long)]
    id: Uuid,
    /// Optionally update the substance name.
    #[clap(short = 's', long)]
    substance_name: Option<String>,
    /// Optionally update the dosage.
    #[clap(short = 'd', long)]
    dosage: Option<Dosage>,
}

#[derive(Debug, Parser, Clone)]
pub struct DeleteFormulationIngredient
{
    /// The identifier of the formulation ingredient to delete.
    #[clap(short = 'i', long)]
    id: Uuid,
}

#[derive(Debug, Parser, Clone)]
#[command(
    subcommand_required = false,
    args_conflicts_with_subcommands = true,
    arg_required_else_help = false,
)]
pub struct GetFormulationIngredient
{
    #[arg()]
    id: Option<i32>,

    #[command(subcommand)]
    pub command: Command,
}

#[derive(Debug, Parser, Clone)]
pub struct ListFormulationIngredient
{
    /// Optionally filter ingredients by a formulation id.
    #[clap(short = 'f', long)]
    formulation_id: Option<Uuid>,
}

/// Updates the formulation ingredient based on provided options.
pub fn update_formulation_ingredient(cmd: UpdateFormulationIngredient)
{
    println!("Updating formulation ingredient with id: {}", cmd.id);
    if let Some(name) = cmd.substance_name {
        println!(" - New substance name: {}", name);
    }
    if let Some(dosage) = cmd.dosage {
        println!(" - New dosage: {:?}", dosage);
    }
    // Add your update logic here.
}

/// Removes the formulation ingredient with the given id.
pub fn remove_formulation_ingredient(cmd: DeleteFormulationIngredient)
{
    println!("Deleting formulation ingredient with id: {}", cmd.id);
    // Add your deletion logic here.
}

/// Retrieves detailed information about a formulation ingredient.
pub fn get_formulation_ingredient(cmd: GetFormulationIngredient)
{
    println!("Getting formulation ingredient with id: {:#?}", cmd.id);
    // Add your get logic here.
}

/// Lists formulation ingredients, possibly filtered by formulation id.
pub fn list_formulation_ingredient(cmd: ListFormulationIngredient)
{
    if let Some(formulation_id) = cmd.formulation_id {
        println!("Listing ingredients for formulation id: {}", formulation_id);
    } else {
        println!("Listing all formulation ingredients.");
    }
    // Add your listing logic here.
}


#[derive(Debug, Subcommand, Clone)]
pub enum Command
{
    Create(CreateFormulationIngredient)
    //Update(UpdateFormulationIngredient),
    //Delete(DeleteFormulationIngredient),
    //Get(GetFormulationIngredient),
    //List(ListFormulationIngredient),
}
