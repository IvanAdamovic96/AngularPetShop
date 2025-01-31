import { Component, OnInit } from '@angular/core';
import { PetsService } from '../pets.service';
import { ActivatedRoute } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Pets } from '../../models/pets.model';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../cart/cart.service';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-petsdetails',
  standalone: true,
  imports: [NgIf, NgFor, NgClass],
  templateUrl: './petsdetails.component.html',
  styleUrl: './petsdetails.component.css'
})
export class PetsdetailsComponent implements OnInit {

  //id!: number;
  //pet: { id: number; picture: string; name: string; description: string; type: string; age: number; size: string; rating: number; price: number; reviews: Array<Review>} | undefined;
  pet!: Pets
  totalRating: number = 0;

  constructor(private route: ActivatedRoute,
    private cartService: CartService,
    private petsService: PetsService,
    private toastr: ToastrService
  ) { };


  ngOnInit(): void {

    /* const id = Number(this.route.snapshot.paramMap.get('id'));
    this.petsService.fetchProduct(id);
    this.pet = this.petsService.pet; */


    this.route.paramMap.subscribe((params) => {
      const id = +params.get('id')!;
      this.pet = this.petsService.fetchProduct(id);
    });

    this.calculateTotalRating(this.pet);
  }

  addToCart(pet: Pets) {
    this.cartService.addToCart(pet);
    this.toastr.success('Item added to cart!');
  }

  /* calculateTotalRating(): number {



    return this.totalRating;
  } */

  calculateTotalRating(pet: Pets): number {
    if (!pet.reviews || pet.reviews.length === 0) return 0;
    this.totalRating =  pet.reviews.reduce((sum, review) => sum + review.rating, 0) / pet.reviews.length;
    return this.totalRating;
  }
}
