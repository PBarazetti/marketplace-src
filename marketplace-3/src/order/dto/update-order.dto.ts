import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { OrderStatus } from "src/order/enums/status.enum";
export class UpdateOrderDto {
    @IsEnum(OrderStatus)
    @ApiProperty()
    status: OrderStatus;
}
