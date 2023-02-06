import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNumber, ValidateNested } from 'class-validator';
import { ProductOrderDto } from 'src/order/dto/create-order.dto';

export class UpdateStockEvent  {
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => ProductOrderDto)
    @ApiProperty()
    items: ProductOrderDto[];
    @IsNumber()
    @ApiProperty()
    orderId: number;
}