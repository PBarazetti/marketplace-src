import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import CancelOrderEvent from 'src/events/cancel_order.event';
import { EventPattern } from '@nestjs/microservices';

@Controller('order')
export class OrderController {
  cacheManager: any;
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }
  

  @Get()
  findAll(){
    return this.orderService.findAll();    
  }

  @Get(':id')
  findOne(@Param('id') id: number){ 
    return this.orderService.findOne(+id);
  }

  @Get('user/:user_id')
  findUserOrders(@Param('user_id') user_id: string) {
    return this.orderService.findUserOrders(user_id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  cancel(@Param('id') id: number) {
    return this.orderService.cancel(+id,true);
  }

  @EventPattern('cancel_order')
  async updateEvent(cancelOrderEvent: CancelOrderEvent) {
    return this.orderService.cancel(cancelOrderEvent.id,false);
  }
}
