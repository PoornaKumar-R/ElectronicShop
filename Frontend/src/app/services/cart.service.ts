import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Order {
  id: number;
  items: CartItem[];
  total: number;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private orders = new BehaviorSubject<Order[]>([]);
  private nextOrderId = 1;
  private isBrowser: boolean;

  cartItems$ = this.cartItems.asObservable();
  orders$ = this.orders.asObservable();

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadFromLocalStorage();
  }

  addToCart(product: any): void {
    const current = this.cartItems.value;
    const existing = current.find(item => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      current.push({
        ...product,
        quantity: 1
      });
    }

    this.cartItems.next([...current]);
    this.saveToLocalStorage();
  }

  removeFromCart(productId: number): void {
    const current = this.cartItems.value.filter(item => item.id !== productId);
    this.cartItems.next(current);
    this.saveToLocalStorage();
  }

  updateQuantity(productId: number, quantity: number): void {
    const current = this.cartItems.value;
    const item = current.find(item => item.id === productId);

    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.cartItems.next([...current]);
        this.saveToLocalStorage();
      }
    }
  }

  getCartTotal(): number {
    return this.cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  checkout(): void {
    const items = this.cartItems.value;
    if (items.length === 0) return;

    const order: Order = {
      id: this.nextOrderId++,
      items: [...items],
      total: this.getCartTotal(),
      date: new Date()
    };

    const current = this.orders.value;
    current.push(order);
    this.orders.next([...current]);
    
    // Clear cart
    this.cartItems.next([]);
    this.saveToLocalStorage();
  }

  clearCart(): void {
    this.cartItems.next([]);
    this.saveToLocalStorage();
  }

  private saveToLocalStorage(): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem('cart_items', JSON.stringify(this.cartItems.value));
      localStorage.setItem('orders', JSON.stringify(this.orders.value));
      localStorage.setItem('nextOrderId', this.nextOrderId.toString());
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }

  private loadFromLocalStorage(): void {
    if (!this.isBrowser) return;
    try {
      const saved = localStorage.getItem('cart_items');
      if (saved) {
        this.cartItems.next(JSON.parse(saved));
      }

      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        this.orders.next(JSON.parse(savedOrders));
      }

      const savedOrderId = localStorage.getItem('nextOrderId');
      if (savedOrderId) {
        this.nextOrderId = parseInt(savedOrderId);
      }
    } catch (e) {
      console.error('Error loading from localStorage:', e);
    }
  }
}
