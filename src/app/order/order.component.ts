import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, Order } from '../services/cart.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {
  orders: Order[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.orders$.subscribe(orders => {
      this.orders = orders;
    });
  }
}
