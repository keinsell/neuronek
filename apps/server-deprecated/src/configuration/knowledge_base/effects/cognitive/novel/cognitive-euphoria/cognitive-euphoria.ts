import {
	Effect,
	EffectCategory,
	EffectType,
} from "../../../../../../modules/substances/effect/entities/effect.entity";
import fs from "node:fs";
import path from "node:path";

const markdown = fs.readFileSync(
	path.resolve(
		"./src/configuration/knowledge_base/effects/cognitive/novel/cognitive-euphoria/cognitive-euphoria.md",
	),
	"utf8",
);

export const CognitiveEuphoria: Effect = new Effect({
	name: "Cognitive euphoria",
	type: EffectType.enhancement,
	category: EffectCategory.cognitive,
	summary:
		"Cognitive euphoria (semantically the opposite of cognitive dysphoria) is medically recognized as a cognitive and emotional state in which a person experiences intense feelings of well-being, elation, happiness, excitement, and joy. Although euphoria is an effect (i.e. a substance is euphorigenic), the term is also used colloquially to define a state of transcendent happiness combined with an intense sense of contentment.However, recent psychological research suggests euphoria can largely contribute to but should not be equated with happiness.",
	page: markdown,
	externals: ["https://psychonautwiki.org/wiki/Cognitive_euphoria"],
	references: [],
});
