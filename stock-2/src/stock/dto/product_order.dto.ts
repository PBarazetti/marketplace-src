import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ProductOrderDto {
    @IsNumber()
    @ApiProperty()
    productId: number;
    @IsNumber()
    @ApiProperty()
    quantity: number;
}
