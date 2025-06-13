import { Controller, Post, Body, ParseIntPipe, Query, Param, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrdersDto } from './dto/get-orders.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @Get(':userId/orders')
  async getOrders(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() dto: GetOrdersDto,
  ) {
    return this.orderService.getOrders(userId, dto.limit);
  }
}
