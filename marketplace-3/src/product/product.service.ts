import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from './entities/product.entity';


@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>
      ) {}

    findAllById(idList:number[]) {              
      return this.productsRepository.find({where:{id:In(idList)}}); 
  }
}
