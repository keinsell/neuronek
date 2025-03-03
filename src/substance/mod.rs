pub mod route_of_administration;


use clap::Parser;
use clap::Subcommand;
pub mod error;
pub mod repository;
use crate::substance::route_of_administration::RouteOfAdministration;
use crate::substance::route_of_administration::RouteOfAdministrationClassification;
use hashbrown::HashMap;
use serde::Deserialize;
use serde::Serialize;
use std::str::FromStr;
use tabled::Tabled;

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
