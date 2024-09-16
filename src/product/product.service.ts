import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<ProductEntity[]> {
    return await this.productRepository.find({
      relations: ['stores'],
    });
  }

  async findOne(id: string): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['stores'],
    });
    if (!product) {
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return product;
  }

  async create(product: ProductEntity): Promise<ProductEntity> {
    this.validateType(product.type);

    return await this.productRepository.save(product);
  }

  async update(id: string, product: ProductEntity): Promise<ProductEntity> {
    const persistedProduct = await this.productRepository.findOne({
      where: { id },
    });
    if (!persistedProduct) {
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    this.validateType(product.type);

    return await this.productRepository.save({
      ...persistedProduct,
      ...product,
    });
  }

  async delete(id: string): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id },
    });
    if (!product) {
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    await this.productRepository.remove(product);
  }

  private validateType(type: string): void {
    const validTypes = ['Perecedero', 'No perecedero'];
    if (!validTypes.includes(type)) {
      throw new BusinessLogicException(
        'The product type must be Perecedero or No perecedero',
        BusinessError.PRECONDITION_FAILED,
      );
    }
  }
}
