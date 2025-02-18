use crate::core::CommandHandler;
use crate::substance::error::SubstanceError;
use crate::utils::AppContext;
use async_trait::async_trait;
use bon::builder;
use clap::Args;
use clap::Parser;
use clap::Subcommand;
use serde::Deserialize;
use serde::Serialize;
use tabled::Tabled;


#[derive(Debug, Serialize, Tabled)]
struct SubstanceRouteOfAdministrationDosage
{
    pub classification: String,
    pub dosage_min: String,
    pub dosage_max: String,
}

#[derive(Debug, Serialize, Tabled)]
struct SubstanceRouteOfAdministrationPhase
{
    pub name: String,
    pub duration_min: String,
    pub duration_max: String,
}

#[derive(Debug, Serialize)]
struct SubstanceRouteOfAdministration
{
    pub name: String,
    pub dosages: Vec<SubstanceRouteOfAdministrationDosage>,
    pub phases: Vec<SubstanceRouteOfAdministrationPhase>,
}

#[derive(Debug, Serialize)]
struct Substance
{
    pub name: String,
    pub common_names: String,
    pub routes_of_administration: Vec<SubstanceRouteOfAdministration>,
}

impl From<crate::substance::Substance> for Substance
{
    fn from(model: crate::substance::Substance) -> Self
    {
        Substance {
            name: model.name,
            common_names: "".to_string(),
            routes_of_administration: model
                .routes_of_administration
                .iter()
                .map(|route| SubstanceRouteOfAdministration {
                    name: route.0.to_string(),
                    dosages: route
                        .1
                        .dosages
                        .iter()
                        .map(|dosage| SubstanceRouteOfAdministrationDosage {
                            classification: dosage.0.to_string(),
                            dosage_min: dosage
                                .1
                                .clone()
                                .start
                                .map(|d| d.to_string())
                                .unwrap_or("N/A".parse().unwrap()),
                            dosage_max: dosage
                                .1
                                .clone()
                                .end
                                .map(|d| d.to_string())
                                .unwrap_or("N/A".parse().unwrap()),
                        })
                        .collect(),
                    phases: route
                        .1
                        .phases
                        .iter()
                        .map(|phase| SubstanceRouteOfAdministrationPhase {
                            name: phase.0.to_string(),
                            duration_min: phase.1.start.to_string(),
                            duration_max: phase.1.end.to_string(),
                        })
                        .collect(),
                })
                .collect(),
        }
    }
}

#[derive(Debug, Args)]
pub struct GetSubstance
{
    #[arg(index = 1)]
    pub name: String,
}

#[async_trait]
impl CommandHandler<Substance> for GetSubstance
{
    async fn handle<'a>(&self, ctx: AppContext<'a>) -> miette::Result<Substance>
    {
        let substance: Substance =
            crate::substance::repository::get_substance(&self.name, ctx.database_connection)
                .await?
                .unwrap_or_else(|| panic!("{}", SubstanceError::NotFound))
                .into();

        println!("{}", serde_json::to_string_pretty(&substance).unwrap());

        Ok(substance)
    }
}

#[derive(Debug, Subcommand)]
enum SubstanceCommands
{
    Get(GetSubstance),
}

#[derive(Debug, Parser)]
pub struct SubstanceCommand
{
    #[command(subcommand)]
    commands: SubstanceCommands,
}

#[async_trait]
impl CommandHandler for SubstanceCommand
{
    async fn handle<'a>(&self, ctx: AppContext<'a>) -> miette::Result<()>
    {
        match &self.commands
        {
            | SubstanceCommands::Get(command) => command.handle(ctx).await.map(|_| ()),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Tabled, bon::Builder)]
pub struct ViewModel
{
    pub id: String,
    pub name: String,
    pub common_names: String,
}

impl From<crate::database::entities::substance::Model> for ViewModel
{
    fn from(model: crate::database::entities::substance::Model) -> Self
    {
        ViewModel {
            id: model.id.clone().chars().take(6).collect(),
            name: model.name,
            common_names: model.common_names.clone(),
        }
    }
}
