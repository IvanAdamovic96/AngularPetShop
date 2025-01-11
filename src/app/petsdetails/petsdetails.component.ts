import { Component, OnInit } from '@angular/core';
import { PetsService } from '../pets.service';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { Pets } from '../../models/pets.model';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../cart/cart.service';

@Component({
  selector: 'app-petsdetails',
  standalone: true,
  imports: [NgIf],
  templateUrl: './petsdetails.component.html',
  styleUrl: './petsdetails.component.css'
})
export class PetsdetailsComponent implements OnInit {

  id!: number;
  pet: { id: number; picture: string; name: string; description: string; type: string; age: number; size: string; rating: number; price: number; } | undefined;


  constructor(private route: ActivatedRoute, 
              private cartService: CartService, 
              private petsService: PetsService, 
              private toastr: ToastrService
  ) { };


  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.petsService.fetchProduct(id);
    this.pet = this.petsService.pet;

    /* this.route.params.subscribe(params => {
      const idParam = params['id'];
      if(idParam !== null && idParam!== undefined){
        this.id = +idParam;
        this.petsService.fetchProduct(this.id);
      }else{
        console.warn('Id is null or undefined');
      }
    }); */
  }

  addToCart(pet: Pets) {
    this.cartService.addToCart(pet);
    this.toastr.success('Item added to cart!');
  }

}
