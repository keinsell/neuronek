use crate::utils::AppContext;

pub mod config;
pub(crate) mod error_handling;
pub(crate) mod logging;

#[deprecated(note = "CommandHandler is deprecated, please consider implementation off-side of DTOs instead.")]
#[async_trait::async_trait]
pub trait CommandHandler<O = ()>
{
    async fn handle<'a>(&self, ctx: AppContext<'a>) -> miette::Result<O>;
}

#[deprecated(note = "QueryHandler is deprecated, please consider implementation off-side of DTOs instead.")]
#[async_trait::async_trait]
pub trait QueryHandler<U>
{
    async fn query(&self) -> miette::Result<U>;
}
