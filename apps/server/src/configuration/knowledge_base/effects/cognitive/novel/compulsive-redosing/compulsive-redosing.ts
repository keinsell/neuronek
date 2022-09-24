import {
	Effect,
	EffectCategory,
	EffectType,
} from "../../../../../../modules/substances/effect/entities/effect.entity";

export const CompulsiveRedosing: Effect = new Effect({
	name: "Compulsive redosing",
	type: EffectType.novel,
	category: EffectCategory.cognitive,
	summary:
		"Compulsive redosing is defined as the experience of a powerful and difficult to resist urge to continuously redose a psychoactive substance in an effort to increase or maintain the subjective effects which it induces.",
	page: "This effect is considerably more likely to manifest itself when the user has a large supply of the given substance within their possession. It can be partially avoided by pre-weighing dosages, not keeping the remaining material within sight, exerting self-control, and giving the compound to a trusted individual to keep until they deem it safe to return. Compulsive redosing is often accompanied by other coinciding effects such as cognitive euphoria, physical euphoria, or anxiety suppression alongside of other effects which inhibit the clarity of one's decision-making processes such as disinhibition, motivation enhancement, and ego inflation. It is most commonly induced under the influence of moderate dosages of a wide variety of compounds, such as opioids, stimulants, GABAergics, and entactogens. However, it can also occur to a lesser extent under the influence of dissociatives and cannabinoids.",
	externals: ["https://psychonautwiki.org/wiki/Compulsive_redosing"],
	references: [],
});
