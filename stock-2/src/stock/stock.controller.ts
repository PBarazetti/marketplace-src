import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StockService } from './stock.service';
import { EventPattern } from '@nestjs/microservices';
import { UpdateStockEvent } from 'src/events/update_stock.event';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Patch()
  update(@Body() updateStockDto: UpdateStockEvent) {
    return this.stockService.update(updateStockDto);
  }

  @EventPattern('update_stock')
  async updateEvent(updateStockDto: UpdateStockEvent) {
    return this.stockService.update(updateStockDto);
  }
}
