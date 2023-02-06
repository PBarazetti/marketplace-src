import { Module } from '@nestjs/common';
import { StockModule } from './stock/stock.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}), DatabaseModule, StockModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
