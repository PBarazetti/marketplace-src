import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Stock } from './entities/stock.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Stock]),ClientsModule.registerAsync([
    {
      name: 'STOCK_SERVICE',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: Transport.REDIS,
        options: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    },])],
  controllers: [StockController],
  providers: [StockService]
})
export class StockModule {}
