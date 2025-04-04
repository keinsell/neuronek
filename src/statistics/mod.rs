use std::collections::BTreeMap;
use std::ops::Deref;

use async_trait::async_trait;
use chrono::{DateTime, Datelike, Duration, Local, NaiveDate, Timelike, Utc};
use clap::Parser;
use hashbrown::HashMap;
use miette::IntoDiagnostic;
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter, QueryOrder};
use tabled::{Table, Tabled};

use crate::Application;
use crate::r#abstract::CommandHandler;
use crate::database::DATABASE_CONNECTION;
use crate::database::entities::ingestion;
use crate::ingestion::Ingestion;
use crate::substance::route_of_administration::RouteOfAdministrationClassification;
use crate::substance::route_of_administration::dosage::Dosage;

