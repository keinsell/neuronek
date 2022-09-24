import {
	Effect,
	EffectCategory,
	EffectType,
} from "../../../../../modules/substances/effect/entities/effect.entity";

export const AnxietySuppression: Effect = new Effect({
	name: "Anxiety suppression",
	type: EffectType.supression,
	category: EffectCategory.cognitive,
	summary:
		"Anxiety suppression (also known as anxiolysis or minimal sedation) is medically recognized as a partial to complete suppression of a person’s ability to feel anxiety, general unease, and negative feelings of both psychological and physiological tension. The experience of this effect may decrease anxiety-related behaviours such as restlessness, muscular tension, rumination, and panic attacks. This typically results in feelings of extreme calmness and relaxation.",
	page: "",
	externals: ["https://psychonautwiki.org/wiki/Anxiety_suppression"],
	references: [],
});
