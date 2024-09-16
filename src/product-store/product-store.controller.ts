import { plainToInstance } from 'class-transformer';
import { ProductStoreService } from './product-store.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { StoreEntity } from '../store/store.entity';
import { StoreDto } from '../store/store.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('products')
export class ProductStoreController {
  constructor(private readonly productStoreService: ProductStoreService) {}

  @Get(':productId/stores')
  async findStoresFromProduct(@Param('productId') productId: string) {
    return await this.productStoreService.findStoresFromProduct(productId);
  }

  @Get(':productId/stores/:storeId')
  async findStoreFromProduct(
    @Param('productId') productId: string,
    @Param('storeId') storeId: string,
  ) {
    return await this.productStoreService.findStoreFromProduct(
      productId,
      storeId,
    );
  }

  @Post(':productId/stores/:storeId')
  async addStoreToProduct(
    @Param('productId') productId: string,
    @Param('storeId') storeId: string,
  ) {
    return await this.productStoreService.addStoreToProduct(productId, storeId);
  }

  @Put(':productId/stores')
  async updateStoresFromProduct(
    @Param('productId') productId: string,
    @Body() storeDto: StoreDto[],
  ) {
    const stores = plainToInstance(StoreEntity, storeDto);
    return await this.productStoreService.updateStoresFromProduct(
      productId,
      stores,
    );
  }

  @Delete(':productId/stores/:storeId')
  @HttpCode(204)
  async deleteStoreFromProduct(
    @Param('productId') productId: string,
    @Param('storeId') storeId: string,
  ) {
    return await this.productStoreService.deleteStoreFromProduct(
      productId,
      storeId,
    );
  }

  @Delete(':productId/stores')
  @HttpCode(204)
  async deleteStoresFromProduct(@Param('productId') productId: string) {
    return await this.productStoreService.deleteStoresFromProduct(productId);
  }
}
