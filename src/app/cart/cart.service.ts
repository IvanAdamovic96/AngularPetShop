import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItemCount: number = 0;
  private storageKey = 'cart';

  constructor() {}

  // Dohvata korpu iz localStorage
  getCart(): any[] {
    const cart = localStorage.getItem(this.storageKey);
    return cart ? JSON.parse(cart) : [];
  }

  // Dodaje proizvod u korpu
  addToCart(product: any): void {
    const cart = this.getCart();
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex !== -1) {
      // Ako proizvod već postoji, povećava količinu
      cart[existingProductIndex].quantity += 1;
    } else {
      // Ako proizvod ne postoji, dodaje ga u korpu
      cart.push({ ...product, quantity: 1 });
    }

    // Ažurira localStorage
    localStorage.setItem(this.storageKey, JSON.stringify(cart));
    this.updateCartCount();
  }

  // Brisanje proizvoda iz korpe
  removeFromCart(productId: number): void {
    let cart = this.getCart();
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem(this.storageKey, JSON.stringify(cart));
    this.updateCartCount();
  }


  clearCart(): void {
    localStorage.removeItem(this.storageKey);
  }

  updateCart(cart: any[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(cart));
  }

  updateCartCount(): number {
    const cart = this.getCart(); // Uzmi korpu iz localStorage
    this.cartItemCount = cart.reduce((total, item) => total + item.quantity, 0); // Izračunaj ukupnu količinu
    console.log('broj proizvoda: ' + this.cartItemCount);
    return this.cartItemCount;
  }
}
