import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateStockEvent } from 'src/events/update_stock.event';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/product/entities/product.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order_item.entity';
import { OrderStatus } from './enums/status.enum'
import { RedisCacheService } from 'src/cache/cache.service';

@Injectable()
export class OrderService {
  constructor(
    @Inject('ORDER_SERVICE') private client: ClientProxy,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private productService: ProductService,
    private redisCacheService: RedisCacheService
  ) {}

  //In a ecommerce application, we would never get in a situation 
  //where we could create a order without having stock or products. The verification
  //is made in the PDP. So we won't need to check stock and products here.
  create(createOrderDto: CreateOrderDto) {
    // Also update quantity in stock microservice by messaging
    new Promise((resolve, reject) => {
      const order = new Order();
      const orderItemsStock = [];
      order.order_items = [];
      order.userId = createOrderDto.userId;
      let totalPrice = 0;
      const productIdList = createOrderDto.items.map(item => item.productId);
      const uniqueIdList = productIdList.filter((value, index) => productIdList.indexOf(value) === index);

      //Find all products to build the order object
      this.productService.findAllById(uniqueIdList).then(products => {
        let orderItems = createOrderDto.items.map(item => {
          const product = products.find(prod => prod.id === item.productId);
          const orderItem = new OrderItem();

          //set all values in orderItem
          orderItem.product = product;
          orderItem.quantity = item.quantity;
          orderItem.totalPrice = product.price * item.quantity;
          orderItem.unit_price = product.price;
          totalPrice += orderItem.totalPrice;

          //add orderItem to orderItems array
          orderItemsStock.push({
            product: {
              id: item.productId
            },
            quantity: -(item.quantity)
          });
          return orderItem;
        });
        order.totalPrice = totalPrice;

        //save order to postgres DB and delete cache
        this.ordersRepository.save(order).then(order => {
          orderItems = orderItems.map(item => {
            item.order = order;
            //delete orders cache because we have a new order    
            this.redisCacheService.del('orders');
            resolve(order);
            return item;
          });

          //save order item to order_item table
          this.orderItemRepository.save(orderItems);
          //save order item to order_item table
          this.sendUpdateStockEvent(order.id, orderItemsStock); 
        });
      });
    });

    return {message: 'Request to create an order received successfully'};
  }

  findAll() {
    // check if data is in cache:
    return new Promise((resolve, reject) => {
      this.redisCacheService.get('orders').then(cachedData => {
        if (cachedData!=undefined && cachedData!=null && cachedData!='') {
          console.log(`Getting data from cache!`);
          resolve(cachedData);
        };
        reject()
      });
    }).then((cachedData) => {      
      // if yes, return data from cache:
      return cachedData;
    },
    () => {
      // if not, call module and set the cache:
        return this.ordersRepository.find().then(data => {
          this.redisCacheService.set('orders', data); 
          return data;
        });      
    });
  }

  findOne(id: number) {
    return this.ordersRepository.findOne(
      {where: {id : id }}
    );
  }

  findUserOrders(userId: string) {
    return this.ordersRepository.find(
      {where: {userId : userId }}
    );
  }

  //In a ecommerce application, an update could never change the stock.
  //That would be made in the cancel request. Since the cancel request is
  //in another endpoint, here we will never need to update the stock

  update(id: number, updateOrderDto: UpdateOrderDto) {
    //check if order exists
    this.ordersRepository.findOne({where: {id : id }}).then(order => {
      if (order===undefined || order===null) {
        return `Order not found!`;
      };
      this.ordersRepository.update(id, {
        status: updateOrderDto.status        
      });
      //delete orders cache because we have an order update 
      this.redisCacheService.del('orders');
    });      
    return {message: 'Update request received successfully'};
  }

  //Here we will updateStatus + change the stock in the microservice
  //that is responsible for that by messaging
  
  cancel(id: number, changeStock: boolean) {
    //check if order exists and if status is not already canceled   
    return new Promise((resolve, reject) => {
      this.ordersRepository.findOne({where: {id : id }}).then(order => {
        //check if order exists
        if (order===undefined || order===null) {
          reject();
          return `Order not found!`;          
        };
        //check if order is already canceled
        if (order.status===OrderStatus.CANCELED) {
          reject();
          return `Order Already Canceled!`;
        };
        //update order status to canceled     
        this.ordersRepository.update(id, { status: OrderStatus.CANCELED } );
        //delete orders cache because we have an order cancellation
        this.redisCacheService.del('orders');
        return resolve(order);
      });
    }).then((order : Order) => {
        if(changeStock===true) {
          //update stock in stock microservice
          this.sendUpdateStockEvent(id, order.order_items);
          return {message: 'Order canceled successfully'}
        }
      }, () => {        
        return {message: 'Order not found or already canceled'}
      }
    );
  };

  sendUpdateStockEvent(orderId:number, orderItems: OrderItem[]) {
    const updateStockEvent = new UpdateStockEvent();
      updateStockEvent.orderId = orderId;
      updateStockEvent.items = orderItems.map(item => {
        return {          
          productId: item.product.id,
          quantity: item.quantity
        }
      });
      this.client.emit<number>('update_stock', updateStockEvent);
  }
}