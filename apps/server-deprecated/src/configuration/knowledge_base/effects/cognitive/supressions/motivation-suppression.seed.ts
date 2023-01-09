import {
	Effect,
	EffectCategory,
	EffectType,
} from "../../../../../modules/substances/effect/entities/effect.entity";

export const MotivationSupression: Effect = new Effect({
	name: "Motivation suppression",
	type: EffectType.supression,
	category: EffectCategory.cognitive,
	summary:
		"Motivation suppression (also known as avolition or amotivation) is defined as a decreased desire to initiate or persist in goal-directed behavior. Motivation suppression prevents an individual the ability to sustain the rewarding value of an action into an uncertain future; this includes tasks deemed challenging or unpleasant, such as working, studying, cleaning, and doing general chores. At its higher levels, motivation suppression can cause one to lose their desire to engage in any activities, even the ones that would usually be considered entertaining or rewarding to the user. This effect can lead onto severe states of boredom and even mild depression when experienced at a high level of intensity for prolonged periods of time.",
	page: "",
});
