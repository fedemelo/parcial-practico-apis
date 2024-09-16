import { Injectable } from '@nestjs/common';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { ProductService } from '../product/product.service';
import { StoreService } from '../store/store.service';
import { ProductEntity } from '../product/product.entity';
import { StoreEntity } from '../store/store.entity';

@Injectable()
export class ProductStoreService {
  constructor(
    private readonly productService: ProductService,
    private readonly storeService: StoreService,
  ) {}

  async addStoreToProduct(
    productId: string,
    storeId: string,
  ): Promise<ProductEntity> {
    const store = await this.storeService.findOne(storeId);
    const product = await this.productService.findOne(productId);

    product.stores = [...product.stores, store];
    return await this.productService.update(productId, product);
  }

  async findStoreFromProduct(
    productId: string,
    storeId: string,
  ): Promise<StoreEntity> {
    const store: StoreEntity = await this.storeService.findOne(storeId);
    const product: ProductEntity = await this.productService.findOne(productId);
    const storeFound = product.stores.find(
      (storeEntity: StoreEntity) => storeEntity.id === store.id,
    );
    if (!storeFound) {
      throw new BusinessLogicException(
        'The store with the given id is not associated to the product',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return store;
  }

  async findStoresFromProduct(productId: string): Promise<StoreEntity[]> {
    const product: ProductEntity = await this.productService.findOne(productId);
    return product.stores;
  }

  async updateStoresFromProduct(
    productId: string,
    stores: StoreEntity[],
  ): Promise<ProductEntity> {
    const product: ProductEntity = await this.productService.findOne(productId);
    for (const store of stores) {
      await this.storeService.findOne(store.id);
    }
    product.stores = stores;
    return await this.productService.update(productId, product);
  }

  async deleteStoreFromProduct(
    productId: string,
    storeId: string,
  ): Promise<void> {
    const store = await this.storeService.findOne(storeId);
    const product = await this.productService.findOne(productId);
    const storeFound = product.stores.find(
      (storeEntity: StoreEntity) => storeEntity.id === store.id,
    );
    if (!storeFound) {
      throw new BusinessLogicException(
        'The store with the given id is not associated to the product',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    product.stores = product.stores.filter(
      (storeEntity: StoreEntity) => storeEntity.id !== store.id,
    );
    await this.productService.update(productId, product);
  }

  async deleteStoresFromProduct(productId: string): Promise<void> {
    const product = await this.productService.findOne(productId);
    product.stores = [];
    await this.productService.update(productId, product);
  }
}
