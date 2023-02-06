import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import CancelOrderEvent from 'src/events/cancel_order.event';
import { UpdateStockEvent } from 'src/events/update_stock.event';
import { In, Repository } from 'typeorm';
import { ProductOrderDto } from './dto/product_order.dto';
import { Stock } from './entities/stock.entity';

@Injectable()
export class StockService {
  constructor(
    @Inject('STOCK_SERVICE') private client: ClientProxy,
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
  ) {}

  findAllById(id:number[]) {
    return this.stockRepository.find({ where: { product_id: In(id) } });
  }

  update(updateStockDto: UpdateStockEvent) {
    const productIdList = updateStockDto.items.map(item => item.productId);

    const products = this.findAllById(productIdList).then(products => {
      let orderItems = updateStockDto.items.map(item => {
        const product = products.find(prod => prod.product_id === item.productId);        
        const itemStock = new ProductOrderDto();
        itemStock.productId = product.product_id;
        itemStock.quantity = product.quantity + item.quantity;
        //if stock of any item is less than 0, the order
        if(itemStock.quantity < 0) {
          this.client.emit<number>('cancel_order', new CancelOrderEvent(updateStockDto.orderId));
        }
        return itemStock;        
      });      
      for (const item of orderItems) {
        const entity = new Stock();
        entity.product_id = item.productId;
        entity.quantity = item.quantity;
        this.stockRepository.update(item.productId, entity); 
      }           
    });
    return {message: 'Stock updated successfully'}
  }
}
