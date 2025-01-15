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
              private chatbotService: ChatbotService) { }



  ngOnInit(): void {

    setTimeout(() => {
      this.isWelcomeVisible = true;
    }, 5000);

    const cartItemNumbers = this.cartService.updateCartCount(); 
    this.cartItemCount = cartItemNumbers;

    window.addEventListener('storage', () => {
      this.cartService.updateCartCount();
    });



    /* if (!localStorage.getItem('messages')) {
      localStorage.setItem(
        'messages',
        JSON.stringify([{ type: 'bot', text: 'Hi! How can I help you?' }])
      );
    } */

  }







  //rasa bot

  toggleChat() {
    this.isChatVisible = !this.isChatVisible;

    //welcome message above chatbot
    if (this.isChatVisible) {
      this.isWelcomeVisible = false;
    }
  }


  pushMessage(message: MessageModel) {
    this.messages.push(message);
    // Save messages in local storage
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
              /* if (message.image) {
                return `<img src="${message.image}" />`;
              } */

              if (message.attachment) {
                let html = '';

                /* for (let product of message.attachment) {
                  html += `
                    <div class="d-flex align-items-center bg-light rounded p-2 mb-2">
                      <img src="${product.picture}" alt="${product.name}" style="width: 100px; height: 100px;">
                      <div class="product-details">
                        <div class="fw-bold text-primary">${product.name}</div>
                        <div class="text-muted small">${product.type}</div>
                        <div class="d-flex justify-content-between align-items-center mt-1">
                          <span class="fw-bold text-success">${product.price}€</span>
                          <a href="/product-list/${product.id}" class="btn btn-sm btn-outline-primary">Details</a>
                        </div>
                      </div>
                    </div>
                  `;
                } */

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

                /*
                for (let product of message.attachment) {
                  html += `
                <div class="relative flex flex-col bg-white rounded-lg w-full">
                  <div class="px-2 py-1">
                    <span class="text-slate-800 text-xl font-semibold">
                      ${product.name}
                    </span>
                  </div>
                  <div class="relative overflow-hidden bg-clip-border">
                    <img src="${product.picture}" alt="${product.name}" class="w-12 h-12 object-cover rounded-md" />
                  </div>
                  <div class="p-2">
                    <div class="mb-2 flex flex-col">
                      <span class="text-slate-800 font-semibold">
                        Species: ${product.type}
                      </span>
                      <span class="text-slate-800 font-semibold">
                        Size: ${product.size}
                      </span>
                    </div>
                    <p class="text-slate-600 text-justify">
                      ${product.description}
                    </p>
                    <div class="flex justify-between items-center">
                      <span class="text-slate-800 text-xl font-semibold">
                        ${product.price}€
                      </span>
                      <a href="/product-list/${product.id}" class="bg-green-600 hover:bg-green-700 text-white p-2 rounded-md">
                        <i class="fa-solid fa-circle-info"></i> Details
                      </a>
                    </div>
                  </div>
                </div>
                `;
                }*/
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

  /* updateCartCount(): void {
    const cart = this.cartService.getCart(); // Uzmi korpu iz localStorage
    this.cartItemCount = cart.reduce((total, item) => total + item.quantity, 0); // Izračunaj ukupnu količinu
    console.log(this.cartItemCount);
  } */

  title = 'Pet Shop';
  year = new Date().getFullYear();
}import { from } from 'rxjs';

