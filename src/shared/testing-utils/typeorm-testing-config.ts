import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity } from '../../store/store.entity';
import { ProductEntity } from '../../product/product.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: ['src/**/*.entity{.ts,.js}'],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([ProductEntity, StoreEntity]),
];
