import { Effect as PersistenceEffect } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { IMapper } from "../../../../common/mapper/mapper.common";
import { Effect, EffectCategory, EffectType } from "../entities/effect.entity";

export class EffectMapper implements IMapper {
	toDomain(entity: PersistenceEffect): Effect {
		return new Effect(
			{
				type: entity.type as EffectType,
				category: entity.category as EffectCategory,
				name: this.parseEffectName(entity.name),
				summary: entity.description ?? undefined,
				page: entity.page ?? undefined,
			},
			entity.id,
		);
	}

	toPersistence(entity: Effect): Prisma.EffectCreateInput {
		return {
			type: entity.type,
			category: entity.category,
			name: this.stringifyEffectName(entity.name),
			description: entity.summary,
			page: entity.page,
		};
	}

	parseEffectName(name: string): string {
		const x = name.replace(/-/g, " ");
		// Make first letter upper case
		return x.charAt(0).toUpperCase() + x.slice(1);
	}

	stringifyEffectName(name: string): string {
		return name.toLowerCase().replace(/ /g, "-");
	}
}
