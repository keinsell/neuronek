import { Repository } from "../../../common/repository/repository.common";
import { PrismaInstance } from "../../../infrastructure/prisma.infra";
import { Effect } from "../entities/effect.entity";
import { EffectMapper } from "../mappers/effect.mapper";

export class EffectRepository extends Repository<Effect> {
  override db = PrismaInstance.effect;
  override mapper = new EffectMapper();

  async findEffectById(id: string) {
    const effect = await this.db.findUnique({
      where: {
        id,
      },
    });

    if (!effect) {
      return undefined;
    }

    return effect;
  }

  async findEffectByName(name: string) {
    const effect = await this.db.findUnique({
      where: {
        name: this.mapper.stringifyEffectName(name),
      },
    });

    if (!effect) {
      return undefined;
    }

    return effect;
  }

  async exists(entity: Effect): Promise<boolean> {
    const doExist = await this.findEffectByName(entity.name);
    return !!doExist;
  }

  async save(entity: Effect): Promise<Effect> {
    const exists = await this.exists(entity);

    let createdOrUpdatedEffect: Effect;

    if (exists) {
      const updatedEffect = await this.db.update({
        where: {
          name: this.mapper.stringifyEffectName(entity.name),
        },
        data: this.mapper.toPersistence(entity),
      });

      createdOrUpdatedEffect = this.mapper.toDomain(updatedEffect);
    } else {
      const createdEffect = await this.db.create({
        data: this.mapper.toPersistence(entity),
      });

      createdOrUpdatedEffect = this.mapper.toDomain(createdEffect);
    }

    return createdOrUpdatedEffect;
  }

  async delete(entity: Effect): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
