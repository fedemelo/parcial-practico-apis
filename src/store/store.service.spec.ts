import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { StoreEntity } from './store.entity';
import { StoreService } from './store.service';
import { faker } from '@faker-js/faker';

const VALID_CITY_CODE = 'BOG';
const INVALID_CITY_CODE = 'INVALID';

describe('StoreService', () => {
  let service: StoreService;
  let repository: Repository<StoreEntity>;
  let storesList: StoreEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [StoreService],
    }).compile();

    service = module.get<StoreService>(StoreService);
    repository = module.get<Repository<StoreEntity>>(
      getRepositoryToken(StoreEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    storesList = [];
    for (let i = 0; i < 5; i++) {
      const store: StoreEntity = await repository.save({
        name: faker.word.words(),
        city: VALID_CITY_CODE,
        address: faker.location.streetAddress(),
        products: [],
      });
      storesList.push(store);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all stores', async () => {
    const stores: StoreEntity[] = await service.findAll();
    expect(stores).not.toBeNull();
    expect(stores).toHaveLength(storesList.length);
  });

  it('findOne should return a store by id', async () => {
    const storedStore: StoreEntity = storesList[0];
    const store: StoreEntity = await service.findOne(storedStore.id);
    expect(store).not.toBeNull();
    expect(store.name).toEqual(storedStore.name);
    expect(store.city).toEqual(storedStore.city);
    expect(store.address).toEqual(storedStore.address);
  });

  it('findOne should throw an exception for an invalid store', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });

  it('create should return a new store', async () => {
    const store: StoreEntity = {
      id: '',
      name: faker.word.words(),
      city: VALID_CITY_CODE,
      address: faker.location.streetAddress(),
      products: [],
    };

    const newStore: StoreEntity = await service.create(store);
    expect(newStore).not.toBeNull();

    const storedStore: StoreEntity = await repository.findOne({
      where: { id: newStore.id },
    });
    expect(storedStore).not.toBeNull();
    expect(storedStore.name).toEqual(newStore.name);
    expect(storedStore.city).toEqual(newStore.city);
    expect(storedStore.address).toEqual(newStore.address);
  });

  it('create should throw an exception when the city code is invalid', async () => {
    const store: StoreEntity = {
      id: '',
      name: faker.word.words(),
      city: INVALID_CITY_CODE,
      address: faker.location.streetAddress(),
      products: [],
    };

    await expect(() => service.create(store)).rejects.toHaveProperty(
      'message',
      'The city code must be a three-letter uppercase string',
    );
  });

  it('update should modify a store', async () => {
    const store: StoreEntity = storesList[0];
    store.name = 'New name';

    const updatedStore: StoreEntity = await service.update(store.id, store);
    expect(updatedStore).not.toBeNull();

    const storedStore: StoreEntity = await repository.findOne({
      where: { id: store.id },
    });
    expect(storedStore).not.toBeNull();
    expect(storedStore.name).toEqual(store.name);
  });

  it('update should throw an exception for an invalid store', async () => {
    let store: StoreEntity = storesList[0];
    store = {
      ...store,
      name: 'New name',
    };
    await expect(() => service.update('0', store)).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });

  it('delete should remove a store', async () => {
    const store: StoreEntity = storesList[0];
    await service.delete(store.id);

    const deletedStore: StoreEntity = await repository.findOne({
      where: { id: store.id },
    });
    expect(deletedStore).toBeNull();
  });

  it('delete should throw an exception for an invalid store', async () => {
    await expect(service.delete('0')).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });
});
