import {
	Effect,
	EffectCategory,
	EffectType,
} from "../../../../../../modules/substances/effect/entities/effect.entity";

export const FocusEnhancement: Effect = new Effect({
	name: "Focus Enchancement",
	type: EffectType.enhancement,
	category: EffectCategory.cognitive,
	summary:
		"Focus enhancement is defined as the experience of an increased ability to selectively concentrate on an aspect of the environment while ignoring other things. It can be best characterized by feelings of intense concentration which can allow one to continuously focus on and perform tasks which would otherwise be considered too monotonous, boring, or dull to not get distracted from.",
	page: "",
	externals: ["https://psychonautwiki.org/wiki/Focus_enhancement"],
	references: [],
});
