use dialoguer::{theme::ColorfulTheme, Select, Input, Confirm};
use miette::{IntoDiagnostic, miette};
use chrono::{DateTime, Local};
use std::str::FromStr;

use crate::Application;
use crate::ingestion::service::{list_ingestion, log_ingestion, get_ingestion, analyze_ingestion};
use crate::ingestion::action::{ListIngestion, LogIngestion};
use crate::ingestion::model::AnalyzeIngestion;
use crate::substance::route_of_administration::RouteOfAdministrationClassification;
use crate::substance::route_of_administration::dosage::Dosage;
use crate::cli::ingestion::IngestionList;
use crate::cli::Displayable;
use crate::cli::MessageFormat;

/// Launches the top-level interactive menu.
///
/// This function blocks until the user chooses *Quit* or presses <Esc>.
#[tracing::instrument(skip_all)]
pub async fn interactive_root_menu(app_ctx: &Application<'_>) -> miette::Result<()> {
    let theme = ColorfulTheme::default();
    loop {
        // Top-level menu options.
        let items = &["Ingestions", "Quit"];
        let choice = Select::with_theme(&theme)
            .with_prompt("neuronek ▸ main menu")
            .items(items)
            .default(0)
            .interact_opt()
            .into_diagnostic()?;

        match choice {
            Some(0) => {
                // ── Ingestions ────────────────────────────────────────────────────
                interactive_ingestion_menu(app_ctx).await?;
                // After returning, loop and show the root menu again
            }
            Some(1) | None => {
                println!("Bye 👋");
                break;
            }
            _ => unreachable!(),
        }
    }
    Ok(())
}

/// Interactive menu for ingestion-related operations
#[tracing::instrument(skip_all)]
pub async fn interactive_ingestion_menu(app_ctx: &Application<'_>) -> miette::Result<()> {
    let theme = ColorfulTheme::default();
    
    loop {
        // Display ingestion submenu options
        let items = &["List Ingestions", "Create New Ingestion", "View Ingestion Details", "Analyze Ingestion", "Back to Main Menu"];
        let choice = Select::with_theme(&theme)
            .with_prompt("neuronek ▸ ingestions")
            .items(items)
            .default(0)
            .interact_opt()
            .into_diagnostic()?;

        match choice {
            Some(0) => {
                // List ingestions
                interactive_list_ingestions(app_ctx).await?;
            }
            Some(1) => {
                // Create new ingestion
                interactive_create_ingestion(app_ctx).await?;
            }
            Some(2) => {
                // View ingestion details
                interactive_view_ingestion(app_ctx).await?;
            }
            Some(3) => {
                // Analyze ingestion
                interactive_analyze_ingestion(app_ctx).await?;
            }
            Some(4) | None => {
                // Return to main menu
                break;
            }
            _ => unreachable!(),
        }
    }
    
    Ok(())
}

/// Interactive function to list ingestions with pagination
#[tracing::instrument(skip_all)]
pub async fn interactive_list_ingestions(app_ctx: &Application<'_>) -> miette::Result<()> {
    let theme = ColorfulTheme::default();
    
    // Ask for limit
    let limit: u64 = Input::with_theme(&theme)
        .with_prompt("Number of ingestions to display")
        .default(10)
        .interact_text()
        .into_diagnostic()?;
    
    // Create list command
    let list_command = ListIngestion { limit };
    
    // Get ingestions
    let ingestions = list_ingestion(&list_command).await?;
    
    // Display ingestions
    IngestionList(ingestions).display(MessageFormat::Pretty);
    
    // Wait for user to press enter to continue
    Input::<String>::with_theme(&theme)
        .with_prompt("Press Enter to continue")
        .allow_empty(true)
        .interact_text()
        .into_diagnostic()?;
    
    Ok(())
}

/// Interactive function to create a new ingestion
#[tracing::instrument(skip_all)]
pub async fn interactive_create_ingestion(app_ctx: &Application<'_>) -> miette::Result<()> {
    let theme = ColorfulTheme::default();
    
    // Get substance name
    let substance_name: String = Input::with_theme(&theme)
        .with_prompt("Substance name")
        .interact_text()
        .into_diagnostic()?;
    
    // Get dosage with validation
    let dosage_str: String = Input::with_theme(&theme)
        .with_prompt("Dosage (e.g., 10 mg)")
        .validate_with(|input: &String| -> Result<(), &str> {
            match Dosage::from_str(input) {
                Ok(_) => Ok(()),
                Err(_) => Err("Invalid dosage format. Please use format like '10 mg'"),
            }
        })
        .interact_text()
        .into_diagnostic()?;
    
    let dosage = Dosage::from_str(&dosage_str)
        .map_err(|e| miette!("Failed to parse dosage: {}", e))?;
    
    // Get ingestion date
    let date_str: String = Input::with_theme(&theme)
        .with_prompt("Ingestion date (leave empty for now, or use format like 'today 10:00')")
        .allow_empty(true)
        .default("now".into())
        .interact_text()
        .into_diagnostic()?;
    
    let ingestion_date = if date_str.is_empty() || date_str == "now" {
        Local::now()
    } else {
        chrono_english::parse_date_string(&date_str, Local::now(), chrono_english::Dialect::Us)
            .map_err(|e| miette!("Failed to parse date: {}", e))?
    };
    
    // Get route of administration
    let roa_options = vec![
        "Oral", "Sublingual", "Buccal", "Insufflated", "Rectal", "Transdermal", 
        "Intramuscular", "Intravenous", "Smoked", "Inhaled"
    ];
    
    let roa_index = Select::with_theme(&theme)
        .with_prompt("Route of administration")
        .items(&roa_options)
        .default(0)  // Default to Oral
        .interact()
        .into_diagnostic()?;
    
    let route_of_administration = match roa_index {
        0 => RouteOfAdministrationClassification::Oral,
        1 => RouteOfAdministrationClassification::Sublingual,
        2 => RouteOfAdministrationClassification::Buccal,
        3 => RouteOfAdministrationClassification::Insufflated,
        4 => RouteOfAdministrationClassification::Rectal,
        5 => RouteOfAdministrationClassification::Transdermal,
        6 => RouteOfAdministrationClassification::Intramuscular,
        7 => RouteOfAdministrationClassification::Intravenous,
        8 => RouteOfAdministrationClassification::Smoked,
        9 => RouteOfAdministrationClassification::Inhaled,
        _ => RouteOfAdministrationClassification::Oral,
    };
    
    // Confirm ingestion details
    println!("\nIngestion Details:");
    println!("Substance: {}", substance_name);
    println!("Dosage: {}", dosage);
    println!("Date: {}", ingestion_date.format("%Y-%m-%d %H:%M:%S"));
    println!("Route: {}", route_of_administration);
    
    let confirm = Confirm::with_theme(&theme)
        .with_prompt("Create this ingestion?")
        .default(true)
        .interact()
        .into_diagnostic()?;
    
    if confirm {
        // Create log ingestion command
        let log_command = LogIngestion {
            substance_name,
            dosage,
            ingestion_date,
            route_of_administration,
        };
        
        // Log the ingestion
        let ingestion = log_ingestion(&log_command, app_ctx.database_connection).await?;
        
        // Display the created ingestion
        println!("\nIngestion created successfully:");
        ingestion.display(MessageFormat::Pretty);
    } else {
        println!("Ingestion creation cancelled.");
    }
    
    // Wait for user to press enter to continue
    Input::<String>::with_theme(&theme)
        .with_prompt("Press Enter to continue")
        .allow_empty(true)
        .interact_text()
        .into_diagnostic()?;
    
    Ok(())
}

/// Interactive function to view details of a specific ingestion
#[tracing::instrument(skip_all)]
pub async fn interactive_view_ingestion(app_ctx: &Application<'_>) -> miette::Result<()> {
    let theme = ColorfulTheme::default();
    
    // Get ingestion ID
    let ingestion_id: i32 = Input::with_theme(&theme)
        .with_prompt("Enter ingestion ID")
        .interact_text()
        .into_diagnostic()?;
    
    // Get ingestion details
    match get_ingestion(ingestion_id).await? {
        Some(ingestion) => {
            // Display ingestion details
            ingestion.display(MessageFormat::Pretty);
            
            // Show options for this ingestion
            let items = &["Update Ingestion", "Delete Ingestion", "Back"];
            let choice = Select::with_theme(&theme)
                .with_prompt("Options")
                .items(items)
                .default(2) // Default to Back
                .interact()
                .into_diagnostic()?;
                
            match choice {
                0 => {
                    // Update ingestion
                    interactive_update_ingestion(app_ctx, ingestion_id).await?;
                },
                1 => {
                    // Delete ingestion
                    interactive_delete_ingestion(app_ctx, ingestion_id).await?;
                },
                2 => {
                    // Back - do nothing
                },
                _ => unreachable!(),
            }
        },
        None => {
            println!("Ingestion with ID {} not found.", ingestion_id);
            
            // Wait for user to press enter to continue
            Input::<String>::with_theme(&theme)
                .with_prompt("Press Enter to continue")
                .allow_empty(true)
                .interact_text()
                .into_diagnostic()?;
        }
    }
    
    Ok(())
}

/// Interactive function to update an existing ingestion
#[tracing::instrument(skip_all)]
pub async fn interactive_update_ingestion(app_ctx: &Application<'_>, ingestion_id: i32) -> miette::Result<()> {
    use crate::ingestion::action::UpdateIngestion;
    use sea_orm::{EntityTrait, ColumnTrait, QueryFilter};
    use crate::database::entities::ingestion;
    use std::ops::Deref;
    use crate::database::DATABASE_CONNECTION;
    
    let theme = ColorfulTheme::default();
    
    // Get current ingestion details
    let current_ingestion = match get_ingestion(ingestion_id).await? {
        Some(ingestion) => ingestion,
        None => {
            println!("Ingestion with ID {} not found.", ingestion_id);
            return Ok(());
        }
    };
    
    println!("\nCurrent ingestion details:");
    current_ingestion.display(MessageFormat::Pretty);
    
    // Ask which fields to update
    let update_fields = &["Substance Name", "Dosage", "Ingestion Date", "Route of Administration", "Done"];
    
    let mut substance_name: Option<String> = None;
    let mut dosage: Option<Dosage> = None;
    let mut ingestion_date: Option<DateTime<Local>> = None;
    let mut route_of_administration: Option<RouteOfAdministrationClassification> = None;
    
    loop {
        let choice = Select::with_theme(&theme)
            .with_prompt("Select field to update (or Done when finished)")
            .items(update_fields)
            .default(4) // Default to Done
            .interact()
            .into_diagnostic()?;
            
        match choice {
            0 => {
                // Update substance name
                let new_name: String = Input::with_theme(&theme)
                    .with_prompt("New substance name")
                    .default(current_ingestion.substance_name.to_string())
                    .interact_text()
                    .into_diagnostic()?;
                
                substance_name = Some(new_name);
                println!("Substance name will be updated.");
            },
            1 => {
                // Update dosage
                let dosage_str: String = Input::with_theme(&theme)
                    .with_prompt("New dosage (e.g., 10 mg)")
                    .default(current_ingestion.dosage.to_string())
                    .validate_with(|input: &String| -> Result<(), &str> {
                        match Dosage::from_str(input) {
                            Ok(_) => Ok(()),
                            Err(_) => Err("Invalid dosage format. Please use format like '10 mg'"),
                        }
                    })
                    .interact_text()
                    .into_diagnostic()?;
                
                dosage = Some(Dosage::from_str(&dosage_str)
                    .map_err(|e| miette!("Failed to parse dosage: {}", e))?);
                println!("Dosage will be updated.");
            },
            2 => {
                // Update ingestion date
                let date_str: String = Input::with_theme(&theme)
                    .with_prompt("New ingestion date (format like 'today 10:00')")
                    .default(current_ingestion.ingestion_date.format("%Y-%m-%d %H:%M:%S").to_string())
                    .interact_text()
                    .into_diagnostic()?;
                
                ingestion_date = Some(chrono_english::parse_date_string(&date_str, Local::now(), chrono_english::Dialect::Us)
                    .map_err(|e| miette!("Failed to parse date: {}", e))?);
                println!("Ingestion date will be updated.");
            },
            3 => {
                // Update route of administration
                let roa_options = vec![
                    "Oral", "Sublingual", "Buccal", "Insufflated", "Rectal", "Transdermal", 
                    "Intramuscular", "Intravenous", "Smoked", "Inhaled"
                ];
                
                let roa_index = Select::with_theme(&theme)
                    .with_prompt("New route of administration")
                    .items(&roa_options)
                    .default(match current_ingestion.route {
                        RouteOfAdministrationClassification::Oral => 0,
                        RouteOfAdministrationClassification::Sublingual => 1,
                        RouteOfAdministrationClassification::Buccal => 2,
                        RouteOfAdministrationClassification::Insufflated => 3,
                        RouteOfAdministrationClassification::Rectal => 4,
                        RouteOfAdministrationClassification::Transdermal => 5,
                        RouteOfAdministrationClassification::Intramuscular => 6,
                        RouteOfAdministrationClassification::Intravenous => 7,
                        RouteOfAdministrationClassification::Smoked => 8,
                        RouteOfAdministrationClassification::Inhaled => 9,
                    })
                    .interact()
                    .into_diagnostic()?;
                
                route_of_administration = Some(match roa_index {
                    0 => RouteOfAdministrationClassification::Oral,
                    1 => RouteOfAdministrationClassification::Sublingual,
                    2 => RouteOfAdministrationClassification::Buccal,
                    3 => RouteOfAdministrationClassification::Insufflated,
                    4 => RouteOfAdministrationClassification::Rectal,
                    5 => RouteOfAdministrationClassification::Transdermal,
                    6 => RouteOfAdministrationClassification::Intramuscular,
                    7 => RouteOfAdministrationClassification::Intravenous,
                    8 => RouteOfAdministrationClassification::Smoked,
                    9 => RouteOfAdministrationClassification::Inhaled,
                    _ => RouteOfAdministrationClassification::Oral,
                });
                println!("Route of administration will be updated.");
            },
            4 => {
                // Done updating
                break;
            },
            _ => unreachable!(),
        }
    }
    
    // Check if any fields were updated
    if substance_name.is_none() && dosage.is_none() && ingestion_date.is_none() && route_of_administration.is_none() {
        println!("No changes were made.");
        return Ok(());
    }
    
    // Confirm update
    println!("\nUpdated ingestion details:");
    if let Some(ref name) = substance_name {
        println!("Substance: {}", name);
    }
    if let Some(ref dose) = dosage {
        println!("Dosage: {}", dose);
    }
    if let Some(ref date) = ingestion_date {
        println!("Date: {}", date.format("%Y-%m-%d %H:%M:%S"));
    }
    if let Some(ref route) = route_of_administration {
        println!("Route: {}", route);
    }
    
    let confirm = Confirm::with_theme(&theme)
        .with_prompt("Update this ingestion?")
        .default(true)
        .interact()
        .into_diagnostic()?;
    
    if confirm {
        // Create update command
        let update_command = UpdateIngestion {
            ingestion_identifier: ingestion_id,
            substance_name,
            dosage,
            ingestion_date,
            route_of_administration,
        };
        
        // Update the ingestion
        use crate::r#abstract::CommandHandler;
        update_command.handle(Application {
            database_connection: app_ctx.database_connection,
            stdout_format: app_ctx.stdout_format,
        }).await?;
        
        println!("Ingestion updated successfully.");
    } else {
        println!("Update cancelled.");
    }
    
    // Wait for user to press enter to continue
    Input::<String>::with_theme(&theme)
        .with_prompt("Press Enter to continue")
        .allow_empty(true)
        .interact_text()
        .into_diagnostic()?;
    
    Ok(())
}

/// Interactive function to delete an ingestion
#[tracing::instrument(skip_all)]
pub async fn interactive_delete_ingestion(app_ctx: &Application<'_>, ingestion_id: i32) -> miette::Result<()> {
    use crate::ingestion::action::DeleteIngestion;
    use crate::r#abstract::CommandHandler;
    
    let theme = ColorfulTheme::default();
    
    // Confirm deletion
    let confirm = Confirm::with_theme(&theme)
        .with_prompt(format!("Are you sure you want to delete ingestion #{}? This action cannot be undone.", ingestion_id))
        .default(false)
        .interact()
        .into_diagnostic()?;
    
    if confirm {
        // Create delete command
        let delete_command = DeleteIngestion {
            ingestion_id,
            interactive: false, // We're already handling the confirmation
            confirmation: Some(true),
        };
        
        // Delete the ingestion
        delete_command.handle(Application {
            database_connection: app_ctx.database_connection,
            stdout_format: app_ctx.stdout_format,
        }).await?;
        
        println!("Ingestion deleted successfully.");
    } else {
        println!("Deletion cancelled.");
    }
    
    // Wait for user to press enter to continue
    Input::<String>::with_theme(&theme)
        .with_prompt("Press Enter to continue")
        .allow_empty(true)
        .interact_text()
        .into_diagnostic()?;
    
    Ok(())
}

/// Interactive function to analyze an ingestion
#[tracing::instrument(skip_all)]
pub async fn interactive_analyze_ingestion(app_ctx: &Application<'_>) -> miette::Result<()> {
    let theme = ColorfulTheme::default();
    
    // Ask if user wants to analyze by ID or by substance/dosage
    let analyze_options = &["Analyze by Ingestion ID", "Analyze by Substance and Dosage"];
    let choice = Select::with_theme(&theme)
        .with_prompt("How would you like to analyze?")
        .items(analyze_options)
        .default(0)
        .interact()
        .into_diagnostic()?;
    
    let mut analyze_command = AnalyzeIngestion {
        ingestion_id: None,
        substance: String::new(),
        dosage: Dosage::from_str("0 mg").unwrap(), // Default value, will be overwritten
        date: Local::now(),
        roa: RouteOfAdministrationClassification::Oral,
    };
    
    match choice {
        0 => {
            // Analyze by ID
            let ingestion_id: i32 = Input::with_theme(&theme)
                .with_prompt("Enter ingestion ID")
                .interact_text()
                .into_diagnostic()?;
            
            analyze_command.ingestion_id = Some(ingestion_id);
        },
        1 => {
            // Analyze by substance and dosage
            // Get substance name
            let substance_name: String = Input::with_theme(&theme)
                .with_prompt("Substance name")
                .interact_text()
                .into_diagnostic()?;
            
            // Get dosage with validation
            let dosage_str: String = Input::with_theme(&theme)
                .with_prompt("Dosage (e.g., 10 mg)")
                .validate_with(|input: &String| -> Result<(), &str> {
                    match Dosage::from_str(input) {
                        Ok(_) => Ok(()),
                        Err(_) => Err("Invalid dosage format. Please use format like '10 mg'"),
                    }
                })
                .interact_text()
                .into_diagnostic()?;
            
            let dosage = Dosage::from_str(&dosage_str)
                .map_err(|e| miette!("Failed to parse dosage: {}", e))?;
            
            // Get ingestion date
            let date_str: String = Input::with_theme(&theme)
                .with_prompt("Ingestion date (leave empty for now, or use format like 'today 10:00')")
                .allow_empty(true)
                .default("now".into())
                .interact_text()
                .into_diagnostic()?;
            
            let ingestion_date = if date_str.is_empty() || date_str == "now" {
                Local::now()
            } else {
                chrono_english::parse_date_string(&date_str, Local::now(), chrono_english::Dialect::Us)
                    .map_err(|e| miette!("Failed to parse date: {}", e))?
            };
            
            // Get route of administration
            let roa_options = vec![
                "Oral", "Sublingual", "Buccal", "Insufflated", "Rectal", "Transdermal", 
                "Intramuscular", "Intravenous", "Smoked", "Inhaled"
            ];
            
            let roa_index = Select::with_theme(&theme)
                .with_prompt("Route of administration")
                .items(&roa_options)
                .default(0)  // Default to Oral
                .interact()
                .into_diagnostic()?;
            
            let route_of_administration = match roa_index {
                0 => RouteOfAdministrationClassification::Oral,
                1 => RouteOfAdministrationClassification::Sublingual,
                2 => RouteOfAdministrationClassification::Buccal,
                3 => RouteOfAdministrationClassification::Insufflated,
                4 => RouteOfAdministrationClassification::Rectal,
                5 => RouteOfAdministrationClassification::Transdermal,
                6 => RouteOfAdministrationClassification::Intramuscular,
                7 => RouteOfAdministrationClassification::Intravenous,
                8 => RouteOfAdministrationClassification::Smoked,
                9 => RouteOfAdministrationClassification::Inhaled,
                _ => RouteOfAdministrationClassification::Oral,
            };
            
            analyze_command.substance = substance_name;
            analyze_command.dosage = dosage;
            analyze_command.date = ingestion_date;
            analyze_command.roa = route_of_administration;
        },
        _ => unreachable!(),
    }
    
    // Perform analysis
    match analyze_ingestion(&analyze_command).await {
        Ok(ingestion) => {
            println!("\nAnalysis Results:");
            ingestion.display(MessageFormat::Pretty);
        },
        Err(e) => {
            println!("Error analyzing ingestion: {}", e);
        }
    }
    
    // Wait for user to press enter to continue
    Input::<String>::with_theme(&theme)
        .with_prompt("Press Enter to continue")
        .allow_empty(true)
        .interact_text()
        .into_diagnostic()?;
    
    Ok(())
}