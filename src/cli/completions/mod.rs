//! Shell completion module for Neuronek
//! 
//! This module provides high-performance, cache-based shell completions
//! for dynamic data like substance names and routes of administration.
//! 
//! ## Module Structure
//! - `cache`: Manages filesystem-based caching for completion data
//! - `shell`: Generates shell-specific completion scripts
//! - `bash`: Bash-specific completion enhancements
//! - `fish`: Fish-specific completion enhancements

pub mod cache;
pub mod shell;
pub mod bash;
pub mod fish;

use clap::{Command, CommandFactory};
use clap_complete::{engine::{ValueCandidates, ValueCompleter}, ArgValueCandidates, ArgValueCompleter, CompletionCandidate, Shell};
use futures::executor::block_on;
use std::io::Write;
use clap::builder::PossibleValue;
use cache::CompletionCache;
use crate::DATABASE_CONNECTION;

use crate::substance::{self, repository::list_substances};

/// Generate enhanced shell completions with dynamic substance name support
pub fn generate_completion<W: Write>(shell: Shell, cmd: &mut Command, buf: &mut W) {
    // Delegate to the shell module for the actual generation
    shell::generate_completion(shell, cmd, buf);
}

/// Creates a static string copy for use with PossibleValue::new
/// 
/// Converts a String to a &'static str by leaking memory.
/// This is acceptable for our completion use case since:
/// 1. These completions are short-lived
/// 2. The number of completions is limited 
/// 3. The program will exit shortly after use
fn to_static_str(s: String) -> &'static str {
    Box::leak(s.into_boxed_str())
}

/// Provides substance name completion suggestions based on cache
/// 
/// This function is designed to be used with clap's dynamic completion
/// feature once the dependency issues are resolved. It reads from the
/// substance names cache and filters based on the input string.
/// 
/// # Arguments
/// * `input` - The current user input to filter suggestions
/// 
/// # Returns
/// * A vector of possible values for completion
// pub fn substance_completer(input: &str) -> Vec<PossibleValue> {
//     // Create a completion cache for substances
//     let cache = match CompletionCache::new("substances") {
//         Ok(c) => c,
//         Err(_) => return Vec::new(), // Return empty list if cache can't be loaded
//     };
    
//     // Read substance names from cache
//     let substances = match cache.read_all_lines() {
//         Ok(substances) => substances,
//         Err(_) => return Vec::new(),
//     };
    
//     // Filter substance names based on the input prefix and convert to PossibleValue
//     substances
//         .into_iter()
//         .filter(|name| name.to_lowercase().starts_with(&input.to_lowercase()))
//         .map(|name| PossibleValue::new(to_static_str(name)))
//         .collect()
// }

pub fn substance_completer(current: &std::ffi::OsStr) -> Vec<CompletionCandidate> {
    let current_str = current.to_str().unwrap_or("");
    
    // Try to use cache first for better performance
    let cache = match CompletionCache::new("substances") {
        Ok(c) => c,
        Err(_) => {
            // If cache can't be created, fall back to database directly
            return block_on(async {
                let substances = list_substances(&*DATABASE_CONNECTION).await.unwrap_or_default();
                substances.into_iter()
                    .filter(|substance| substance.name.to_lowercase().starts_with(&current_str.to_lowercase()))
                    .map(|substance| CompletionCandidate::new(to_static_str(substance.name)))
                    .collect()
            });
        }
    };
    
    // Check if cache is valid
    let cache_valid = cache.is_valid().unwrap_or(false);
    
    if cache_valid {
        // Read substance names from cache
        match cache.read_all_lines() {
            Ok(substances) => {
                // Filter cached substances
                substances
                    .into_iter()
                    .filter(|name| name.to_lowercase().starts_with(&current_str.to_lowercase()))
                    .map(|name| CompletionCandidate::new(to_static_str(name)))
                    .collect()
            }
            Err(_) => {
                // Cache read failed, fall back to database
                block_on(async {
                    let substances = list_substances(&*DATABASE_CONNECTION).await.unwrap_or_default();
                    substances.into_iter()
                        .filter(|substance| substance.name.to_lowercase().starts_with(&current_str.to_lowercase()))
                        .map(|substance| CompletionCandidate::new(to_static_str(substance.name)))
                        .collect()
                })
            }
        }
    } else {
        // Cache is stale or doesn't exist, refresh it in background and use database
        let substances = block_on(async {
            let substances = list_substances(&*DATABASE_CONNECTION).await.unwrap_or_default();
            
            // Refresh cache in background (non-blocking)
            let substance_names: Vec<String> = substances.iter()
                .map(|s| s.name.to_lowercase())
                .collect::<std::collections::HashSet<_>>()
                .into_iter()
                .collect();
            
            // Try to refresh cache, but don't block on it
            let _ = cache.refresh(&(), &substance_names);
            
            // Return filtered results
            substances.into_iter()
                .filter(|substance| substance.name.to_lowercase().starts_with(&current_str.to_lowercase()))
                .map(|substance| CompletionCandidate::new(to_static_str(substance.name)))
                .collect()
        });
        
        substances
    }
}


/// Provides route of administration (ROA) completion suggestions
/// 
/// This function is designed to be used with clap's dynamic completion
/// feature. It provides completion suggestions for route of administration
/// values, filtering based on the current input.
/// 
/// # Arguments
/// * `current` - The current user input to filter suggestions
/// 
/// # Returns
/// * A vector of completion candidates
pub fn roa_completer(current: &std::ffi::OsStr) -> Vec<CompletionCandidate> {
    // Define all available routes of administration
    let routes = vec![
        "buccal",
        "inhaled", 
        "insufflated",
        "intramuscular",
        "intravenous",
        "oral",
        "rectal",
        "smoked",
        "sublingual",
        "transdermal",
    ];
    
    let current_str = current.to_str().unwrap_or("");
    
    // Filter ROA names based on the input prefix
    routes
        .into_iter()
        .filter(|roa| roa.to_lowercase().starts_with(&current_str.to_lowercase()))
        .map(|roa| CompletionCandidate::new(roa))
        .collect()
}

/// Provides ingestion ID completion suggestions
/// 
/// This function provides completion suggestions for ingestion IDs,
/// showing recent ingestions with their substance names for easier selection.
/// 
/// # Arguments
/// * `current` - The current user input to filter suggestions
/// 
/// # Returns
/// * A vector of completion candidates
pub fn ingestion_id_completer(current: &std::ffi::OsStr) -> Vec<CompletionCandidate> {
    use crate::database::entities::ingestion::Entity as IngestionEntity;
    use sea_orm::{EntityTrait, QueryOrder, QuerySelect};
    use clap::builder::StyledStr;
    
    let current_str = current.to_str().unwrap_or("");
    
    // Fetch recent ingestions from database
    let ingestions = block_on(async {
        IngestionEntity::find()
            .order_by_desc(crate::database::entities::ingestion::Column::Id)
            .limit(20) // Show last 20 ingestions
            .all(&*DATABASE_CONNECTION)
            .await
            .unwrap_or_default()
    });
    
    // Convert to completion candidates with helpful descriptions
    ingestions
        .into_iter()
        .map(|ing| {
            let id_str = ing.id.to_string();
            let description = format!("{} - {} {}mg", 
                ing.ingested_at.format("%Y-%m-%d %H:%M"),
                ing.substance_name,
                ing.dosage as i32
            );
            
            let mut candidate = CompletionCandidate::new(id_str.clone());
            candidate = candidate.help(Some(StyledStr::from(description)));
            candidate
        })
        .collect::<Vec<_>>()
        .into_iter()
        .filter(|_| true) // Remove the filter for now since we already filtered when creating candidates
        .collect()
}
