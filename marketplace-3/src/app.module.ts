import { Module } from '@nestjs/common';
import { OrderModule } from './order/order.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { RedisCacheModule } from './cache/cache.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}), DatabaseModule, OrderModule, ProductModule, RedisCacheModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
