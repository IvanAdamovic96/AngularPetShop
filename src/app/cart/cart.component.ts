import { Component, OnInit } from '@angular/core';
import { Pets } from '../../models/pets.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../auth/user.service';
import { PetsService } from '../pets.service';
import { CartService } from './cart.service';
import { DatePipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  providers: [DatePipe]
})
export class CartComponent implements OnInit {

  cart: any[] = [];
  items: any[] = [];
  existingOrders: any[] = [];
  totalAmount: any;
  pets: any;

  //quantity?: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public userService: UserService, 
              private cartService: CartService, 
              private toastr: ToastrService, 
              private datePipe: DatePipe
  ) { }



  ngOnInit(): void {
    this.cart = this.cartService.getCart();

    const storedOrders = localStorage.getItem('orders');
    this.existingOrders = storedOrders ? JSON.parse(storedOrders) : [];

    this.calculateTotalAmount();
    //console.log(this.cart);
  }



  loadCart(): void {
    this.cart = this.cartService.getCart();
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
    this.toastr.error('Item removed from cart!')
    this.loadCart();
    this.calculateTotalAmount();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.loadCart();
    this.calculateTotalAmount();
  }

  increaseQuantity(item: any): void {
    item.quantity++;
    this.cartService.updateCart(this.cart);
    this.calculateTotalAmount();
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.cartService.updateCart(this.cart);
      this.calculateTotalAmount();
    }
  }

  calculateTotalAmount(): number {
    if (!this.cart || this.cart.length === 0) {
      console.warn('Cart is empty or not initialized');
      this.totalAmount = 0;
      return 0;
    }

    this.totalAmount = this.cart.reduce((acc: number, item: { price: number, quantity: number }) => {
      return acc + (item.price * (item.quantity || 1));
    }, 0);

    
    return this.totalAmount;

    //this.totalAmount = parseFloat(this.totalAmount.toFixed(2));
    //console.log('Total Amount:', this.totalAmount);

  }


  placeOrder(): void {

    if (!this.cart || this.cart.length === 0) {
      this.toastr.warning('Cart is empty. Please add items to the cart before placing an order.');
      return;
    }

    if (!this.userService.isLoggedIn()) {
      this.toastr.warning('You have to be logged in to make an order!')
      this.router.navigate(['/login']);
      return;
    }


    const formattedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');



    const order = {
      id: Date.now().toString(),
      cartItems: this.cart,
      user: this.userService.currentUser,
      totalAmount: this.totalAmount,
      createdAt: formattedDate,
      status: 'Pending'
    };

    this.existingOrders.push(order);

    localStorage.setItem('orders', JSON.stringify(this.existingOrders));

    this.cart = [];
    this.totalAmount = 0;
    localStorage.removeItem('cart');
    this.router.navigate(['/home']);
    this.toastr.success('Ordered successfully')
    //console.log(order);

  }


}
