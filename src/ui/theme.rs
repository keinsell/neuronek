use owo_colors::OwoColorize;
use termimad::MadSkin;

pub static MAD_SKIN: std::sync::LazyLock<MadSkin> = {
	std::sync::LazyLock::new(|| {
		let mut skin = MadSkin::no_style();
		skin.headers[0].align = termimad::Alignment::Left;
		skin
	})
};
