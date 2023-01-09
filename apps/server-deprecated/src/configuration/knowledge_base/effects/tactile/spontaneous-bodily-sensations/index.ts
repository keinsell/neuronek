import {
	Effect,
	EffectCategory,
	EffectType,
} from "../../../../../modules/substances/effect/entities/effect.entity";

export const SpontaneousBodilySensations: Effect = new Effect({
	name: "Spontaneous bodily sensations",
	type: EffectType.alternation,
	category: EffectCategory.tactile,
	summary:
		"Spontaneous tactile sensations are the experience of sensations across the body occurring without any obvious or immediate physical trigger. This results in feelings of seemingly random but distinct tingling sensations that occur across the skin and within the body. Depending on the psychoactive substance consumed, these vary greatly in their styles of sensation.",
	page: "",
	externals: ["https://psychonautwiki.org/wiki/Spontaneous_bodily_sensations"],
	references: [],
});
