use crate::Application;

#[deprecated(
	note = "CommandHandler is deprecated, please consider implementation off-side of DTOs instead."
)]
#[async_trait::async_trait]
pub trait CommandHandler<O = ()>
{
	async fn handle<'a>(&self, ctx: Application<'a>) -> miette::Result<O>;
}
