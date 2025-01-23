import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { UserService } from './auth/user.service';
import { NgFor, NgIf } from '@angular/common';
import { MessageModel } from '../models/message.model';
import { HttpClient, HttpClientModule, HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { RasaModel } from '../models/rasa.model';
import { PetsService } from './pets.service';
import { FormsModule, NgModel } from '@angular/forms';
import { CartService } from './cart/cart.service';
import { ChatbotService } from './chatbot.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf, NgFor, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  isChatVisible = false;
  isWelcomeVisible = false;
  userMessage: string = '';
  messages: MessageModel[] = [];
  cartItemCount: number = 0;
  
  waitingForResponse = false;

  constructor(public userService: UserService, 
              private petService: PetsService, 
              private cartService: CartService, 
              private chatbotService: ChatbotService,
              private toastr: ToastrService) { }



  ngOnInit(): void {

    setTimeout(() => {
      this.isWelcomeVisible = true;
    }, 5000);

    /* const cartItemNumbers = this.cartService.updateCartCount(); 
    this.cartItemCount = cartItemNumbers; */

    /* window.addEventListener('storage', () => {
      this.cartService.updateCartCount();
    }); */




  }







  //rasa bot

  toggleChat() {
    this.isChatVisible = !this.isChatVisible;

    if (this.isChatVisible) {
      this.isWelcomeVisible = false;
    }
  }


  pushMessage(message: MessageModel) {
    this.messages.push(message);
    localStorage.setItem('messages', JSON.stringify(this.messages));
  }




  sendMessage() {
    if (this.waitingForResponse) return;

    if (this.userMessage.trim()) {
      const trimmedInput = this.userMessage;

      this.userMessage = '';

      this.pushMessage({ type: 'user', text: trimmedInput });

      this.chatbotService.getRasaMessage(trimmedInput).subscribe(
        (response: RasaModel[]) => {
          if (response.length === 0) {
            this.pushMessage({
              type: 'bot',
              text: "I'm sorry. Could you please rephrase your question?",
            });
            return;
          }

          response
            .map((message) => {

              if (message.json_message && message.json_message.actionType === 'add_to_cart'){

                const pet = message.json_message.products;

                if (pet && pet.length > 0) {
                  // Add products to cart using CartService
                  pet.forEach((product) => this.cartService.addToCart(product));
    
                  // Notify the user
                  this.pushMessage({
                    type: 'bot',
                    text: `Added ${pet[0].name} to your cart.`,
                  });
                  this.toastr.success('Pet added to cart.');
                } else {
                  this.pushMessage({
                    type: 'bot',
                    text: "Could not add the pet to the cart.",
                  });
                }
              }


              if (message.attachment) {
                let html = '';


                for (let product of message.attachment) {
                  html += `
                    <div class="card card-chat mb-3">
                      <img src="${product.picture}" class="card-img-top" alt="${product.name}" style="width: 100px; height: 100px;"">
                      <div class="card-body">
                        <h3 class="card-title">${product.name}</h3>
                        <p class="card-text">${product.type}</p>
                        <h4 class="fw-bold text-success">${product.price}€</h4>
                      </div>
                      <div class="card-body">
                        <a class="btn btn-primary" href="/petsdetails/${product.id}">
                          <i class="fa-solid fa-up-right-from-square"></i> Details
                        </a>
                        <a class="btn btn-success ms-1" href="/pets">
                          <i class="fa-solid fa-magnifying-glass"></i> Browse All
                        </a>
                      </div>
                    </div>
                    `;
                }

                
                return html;
              }
              return message.text;
            })
            .forEach((message) => {
              this.pushMessage({ type: 'bot', text: message! });
            });
        },
        (error: HttpErrorResponse) => {
          this.pushMessage({
            type: 'bot',
            text: 'Sorry, I am not available at the moment.',
          });
        }
      );
    }
  }



  deleteMessage() {
    this.userMessage = '';
  }

  closeWelcomeMessage() {
    this.isWelcomeVisible = false;
  }


  title = 'Pet Shop';
  year = new Date().getFullYear();
}

