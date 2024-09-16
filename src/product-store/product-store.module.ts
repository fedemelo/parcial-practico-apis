import { Module } from '@nestjs/common';
import { ProductStoreService } from './product-store.service';
import { StoreEntity } from '../store/store.entity';
import { ProductEntity } from '../product/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from '../product/product.service';
import { StoreService } from 'src/store/store.service';
import { ProductStoreController } from './product-store.controller';

@Module({
  providers: [ProductStoreService, ProductService, StoreService],
  imports: [TypeOrmModule.forFeature([ProductEntity, StoreEntity])],
  controllers: [ProductStoreController],
})
export class ProductStoreModule {}
