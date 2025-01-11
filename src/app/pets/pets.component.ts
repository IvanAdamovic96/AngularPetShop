import { Component, OnInit } from '@angular/core';
import { Pets } from '../../models/pets.model';
import { PetsService } from '../pets.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';
import { CartService } from '../cart/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './pets.component.html',
  styleUrl: './pets.component.css'
})
export class PetsComponent implements OnInit {

  pets: Pets[] = [];
  filteredPets: Pets[] = [];
  filterName: string = '';
  filterDescription: string = '';
  filterPetType: string = '';
  filterAge: number = 0;
  filterSize: string = '';
  filterMinPrice: number | null = null;
  filterMaxPrice: number | null = null;



  constructor(private petsService: PetsService, private cartService: CartService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.pets = this.petsService.getPets();
    this.filteredPets = this.pets;
    this.cartService.updateCartCount();
  }


  filterPets(): void {
    // Filtrira listu pets prema imenu
    this.filteredPets = this.pets.filter(pet =>
      pet.name.toLowerCase().includes(this.filterName.toLowerCase()) &&
      pet.description.toLowerCase().includes(this.filterDescription.toLowerCase()) &&
      (this.filterPetType ? pet.type === this.filterPetType : true) &&
      pet.age >= this.filterAge &&
      (this.filterSize ? pet.size === this.filterSize : true) &&
      (this.filterMinPrice !== null ? pet.price >= this.filterMinPrice : true) &&
      (this.filterMaxPrice !== null ? pet.price <= this.filterMaxPrice : true)
    );
  }


  addToCart(pet: Pets) {
    this.cartService.addToCart(pet);
    this.cartService.updateCartCount();
    this.toastr.success('Pet added to cart');
  }




  resetFilters(): void {
    this.filterName = '';
    this.filterDescription = '';
    this.filterPetType = '';
    this.filterAge = 0;
    this.filterSize = '';
    this.filterMinPrice = null;
    this.filterMaxPrice = null;
    this.filteredPets = this.pets;
  }
}
