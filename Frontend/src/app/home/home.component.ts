import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private cartService: CartService) {}
  products: Product[] = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 2499,
      image: 'https://dummyimage.com/300x300/4a5568/ffffff?text=Headphones'
    },
    {
      id: 2,
      name: 'Bluetooth Speaker',
      price: 1999,
      image: 'https://dummyimage.com/300x300/4a5568/ffffff?text=Speaker'
    },
    {
      id: 3,
      name: '4K Smart TV',
      price: 29999,
      image: 'https://dummyimage.com/300x300/4a5568/ffffff?text=Smart+TV'
    },
    {
      id: 4,
      name: 'Smartphone',
      price: 18999,
      image: 'https://dummyimage.com/300x300/4a5568/ffffff?text=Smartphone'
    },
    {
      id: 5,
      name: 'PlayStation 5',
      price: 49999,
      image: 'https://dummyimage.com/300x300/4a5568/ffffff?text=PS5'
    },
    {
      id: 6,
      name: 'Laptop',
      price: 59999,
      image: 'https://dummyimage.com/300x300/4a5568/ffffff?text=Laptop'
    },
    {
      id: 7,
      name: 'Smartwatch',
      price: 9999,
      image: 'https://dummyimage.com/300x300/4a5568/ffffff?text=Smartwatch'
    },
    {
      id: 8,
      name: 'Camera',
      price: 39999,
      image: 'https://dummyimage.com/300x300/4a5568/ffffff?text=Camera'
    }
  ];

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    alert(`${product.name} added to cart!`);
  }
}
