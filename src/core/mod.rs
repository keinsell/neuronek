use crate::utils::AppContext;

pub mod config;
pub(crate) mod error_handling;
pub(crate) mod logging;

#[async_trait::async_trait]
pub trait CommandHandler<O = ()>
{
    async fn handle<'a>(&self, ctx: AppContext<'a>) -> miette::Result<O>;
}

#[async_trait::async_trait]
pub trait QueryHandler<U>
{
    async fn query(&self) -> miette::Result<U>;
}