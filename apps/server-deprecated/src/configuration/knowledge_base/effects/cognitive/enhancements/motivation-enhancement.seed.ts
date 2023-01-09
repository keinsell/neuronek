import {
	Effect,
	EffectCategory,
	EffectType,
} from "../../../../../modules/substances/effect/entities/effect.entity";

export const MotivationEnhancement: Effect = new Effect({
	name: "Motivation enhancement",
	type: EffectType.enhancement,
	category: EffectCategory.cognitive,
	summary:
		"Motivation enhancement is defined as an increased desire to perform tasks and accomplish goals in a productive manner. This includes tasks and goals that would normally be considered too monotonous or overwhelming to fully commit oneself to.",
	page: "",
	externals: ["https://psychonautwiki.org/wiki/Motivation_enhancement"],
	references: [],
});
