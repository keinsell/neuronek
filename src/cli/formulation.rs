use derive_more::From;
use serde::Serialize;

use crate::cli::Displayable;
use crate::formulation::ingredient::FormulationIngredient;
use crate::formulation::Formulation;

impl Displayable for Formulation
{
    fn as_pretty(&self) -> String { self.as_table() }
}

#[derive(Serialize, Debug, Clone, From)]
pub struct FormulationList(Vec<Formulation>);

impl Displayable for FormulationList
{
    fn as_pretty(&self) -> String
    {
        let table = tabled::Table::new(self.0.clone());
        table.to_string()
    }
}

impl Displayable for FormulationIngredient {}