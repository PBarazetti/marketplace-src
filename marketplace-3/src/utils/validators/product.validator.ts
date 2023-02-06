import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { Product } from "src/product/entities/product.entity";
import { Repository } from "typeorm";

@ValidatorConstraint({ name: 'ProductExists', async: true })
@Injectable()
export class ProductExistsRule implements ValidatorConstraintInterface {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
      ) {}

  async validate(value: number) {
    try {
      await this.productRepository.findOneOrFail(
        {where:{
            id:value
        }}
      );
    } catch (e) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Product doesn't exist`;
  }
}
