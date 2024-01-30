import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

interface HasId {
  id: number;
}

export abstract class BaseAbstractRepository<T extends HasId> {
  private entity: Repository<T>;
  protected constructor(entity: Repository<T>) {
    this.entity = entity;
  }

  async save(data: DeepPartial<T>): Promise<T> {
    return await this.entity.save(data);
  }

  async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    return await this.entity.save(data);
  }

  create(data: DeepPartial<T>): T {
    return this.entity.create(data);
  }

  createMany(data: DeepPartial<T>[]): T[] {
    return this.entity.create(data);
  }

  async findOneById(id: any): Promise<T> {
    const options: FindOptionsWhere<T> = {
      id: id,
    };
    return await this.entity.findOneBy(options);
  }

  async findByCondition(filterCondition: FindOneOptions<T>): Promise<T> {
    return await this.entity.findOne(filterCondition);
  }

  async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(relations);
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(options);
  }

  async remove(data: T): Promise<T> {
    return await this.entity.remove(data);
  }

  async preload(entityLike: DeepPartial<T>): Promise<T> {
    return await this.entity.preload(entityLike);
  }
}
