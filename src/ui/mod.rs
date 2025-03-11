use crate::substance::route_of_administration::phase::PhaseClassification;

#[derive(Clone, Debug)]
#[allow(dead_code)]
pub struct PhaseIcon(pub String);

impl From<&PhaseClassification> for PhaseIcon
{
	fn from(value: &PhaseClassification) -> Self
	{
		let icon = match value {
			| PhaseClassification::Onset => "—".to_string(),
			| PhaseClassification::Comeup => "↑".to_string(),
			| PhaseClassification::Peak => "≡".to_string(),
			| PhaseClassification::Comedown => "↓".to_string(),
			| PhaseClassification::Afterglow => "≈".to_string(),
			| _ => "".to_string(),
		};

		PhaseIcon(icon)
	}
}
