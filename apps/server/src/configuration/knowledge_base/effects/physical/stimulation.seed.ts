import {
	Effect,
	EffectCategory,
	EffectType,
} from "../../../../modules/substances/effect/entities/effect.entity";

export const Stimulation: Effect = new Effect({
	name: "Stimulation",
	type: EffectType.enhancement,
	category: EffectCategory.physical,
	summary:
		"Stimulation can be described as an increase in a person's physical energy levels which are interpreted as encouraging when it comes to wakefulness, movement, performing tasks, talkativeness, and general exercise.",
	page: "",
});
