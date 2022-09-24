import {
	Effect,
	EffectCategory,
	EffectType,
} from "../../../../../../modules/substances/effect/entities/effect.entity";

export const AnalysisEnhancement: Effect = new Effect({
	name: "Analysis Enhancement",
	type: EffectType.enhancement,
	category: EffectCategory.cognitive,
	summary:
		"Analysis enhancement is defined as a perceived improvement of a person's overall ability to logically process information or creatively analyze concepts, ideas, and scenarios. This effect can lead to a deep state of contemplation which often results in an abundance of new and insightful ideas. It can give the person a perceived ability to better analyze concepts and problems in a manner which allows them to reach new conclusions, perspectives, and solutions which would have been otherwise difficult to conceive of.",
	page: "",
});
