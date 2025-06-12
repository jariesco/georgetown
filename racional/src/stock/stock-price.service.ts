// src/stock/stock-price.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class StockPriceService {
  getPrice(ticker: string): number {
    // Simula un valor entre 100 y 500 para cada consulta
    const min = 450;
    const max = 550;
    const price = Math.random() * (max - min) + min;
    return parseFloat(price.toFixed(2));
  }
}
