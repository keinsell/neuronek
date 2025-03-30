pub mod route_of_administration;


use clap::{Parser, Subcommand};
pub mod error;
pub mod repository;
use std::str::FromStr;

use hashbrown::HashMap;
use serde::{Deserialize, Serialize};
use tabled::Tabled;

use crate::database::{DATABASE_CONNECTION, DatabaseConnection};
use crate::substance::repository::get_substance;
use crate::substance::route_of_administration::{
	RouteOfAdministration,
	RouteOfAdministrationClassification,
};

#[derive(Clone, Debug)]
#[allow(dead_code)]
pub(super) struct SystematicName(pub String);

pub type RoutesOfAdministration =
	HashMap<RouteOfAdministrationClassification, RouteOfAdministration>;

#[derive(Debug, Clone)]
pub struct Substance
{
	pub name: String,
	#[allow(dead_code)]
	pub systematic_name: Option<SystematicName>,
	pub routes_of_administration: RoutesOfAdministration,
}
