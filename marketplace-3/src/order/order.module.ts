import { RedisCacheModule } from 'src/cache/cache.module';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order_item.entity';
import { ProductModule } from 'src/product/product.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order,OrderItem]),
    ProductModule,
    RedisCacheModule, 
    ClientsModule.registerAsync([{
      name: 'ORDER_SERVICE',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: Transport.REDIS,
        options: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
        inject: [ConfigService],
    }]),
    
  ],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
