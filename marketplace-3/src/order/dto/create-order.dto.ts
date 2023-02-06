import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested, Min, IsArray, ArrayMinSize } from 'class-validator';
import { Product } from 'src/product/entities/product.entity';

export class CreateOrderDto {
    //In a real ecommerce application, the userId would come from the auth microservice
    @IsString()
    @ApiProperty()
    userId: string;
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => ProductOrderDto)
    @ApiProperty()
    items: ProductOrderDto[];
}

export class ProductOrderDto {
    @IsNumber()
    @ApiProperty()
    productId: number;
    @Min(1)
    @IsNumber()
    @ApiProperty()
    quantity: number;
}
