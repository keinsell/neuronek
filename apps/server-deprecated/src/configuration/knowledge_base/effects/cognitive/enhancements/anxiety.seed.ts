import {
	Effect,
	EffectCategory,
	EffectType,
} from "../../../../../modules/substances/effect/entities/effect.entity";

export const Anxiety: Effect = new Effect({
	name: "Anxiety",
	type: EffectType.enhancement,
	category: EffectCategory.cognitive,
	summary:
		"Anxiety is medically recognized as the experience of negative feelings of apprehension, worry, and general unease. These feelings can range from subtle and ignorable to intense and overwhelming enough to trigger panic attacks or feelings of impending doom. Anxiety is often accompanied by nervous behaviour such as stimulation, restlessness, difficulty concentrating, irritability, and muscular tension. Psychoactive substance-induced anxiety can be caused as an inescapable effect of the drug itself, by a lack of experience with the substance or its intensity, as an intensification of a pre-existing state of mind, or by the experience of negative hallucinations. The focus of anticipated danger can be internally or externally derived.",
	page: "",
	externals: ["https://psychonautwiki.org/wiki/Anxiety"],
	references: [],
});
