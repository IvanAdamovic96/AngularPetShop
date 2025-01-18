import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { User, UserService } from '../user.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, NgClass],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {


  currentUser: User | null = null;
  orderedItems: any[] = [];
  existingOrders: any[] = [];

  isEditing: boolean = false;
  profileForInput: any = {};

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;

  constructor(public userService: UserService, private toastr: ToastrService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.profileForInput = { ...this.currentUser };
  }

  ngOnInit(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
    console.log(this.currentUser);
    this.getOrders();


    this.totalPages = Math.ceil(this.orderedItems.length / this.itemsPerPage);

  }

  getOrders() {
    const orders = localStorage.getItem('orders');
    if (orders) {
      this.orderedItems = JSON.parse(orders);
    }
  }


  startEditing() {
    this.isEditing = true;
    this.profileForInput = { ...this.currentUser };
  }

  saveChanges() {
    this.currentUser = { ...this.profileForInput };
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    this.isEditing = false;
    this.toastr.success('Changes saved!')
  }

  cancelEdit() {
    this.isEditing = false;
  }


  updateOrderStatus(orderId: string, newStatus: 'Delivered' | 'Cancelled' | 'Paid'): void {

    const storedOrders = localStorage.getItem('orders');
    this.existingOrders = storedOrders ? JSON.parse(storedOrders) : [];

    const order = this.existingOrders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      localStorage.setItem('orders', JSON.stringify(this.existingOrders));
      this.toastr.info(`Order status updated to ${newStatus}`);
    } else {
      this.toastr.error('Order not found');
    }

    this.getOrders();
  }





  get paginatedOrders(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.orderedItems.slice(startIndex, endIndex);
  }
  
  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
    }
  }
}
