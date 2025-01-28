import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { RasaModel } from "../models/rasa.model";


@Injectable({
    providedIn: 'root',
})
export class ChatbotService {
    //static instance: ChatbotService;
    //private baseUrl: string;
    private client: HttpClient;

    private constructor() {
        //inject HttpClient instance
        this.client = inject(HttpClient)
    }

    public getRasaMessage(userMessage: string) {
        const url = 'http://localhost:5005/webhooks/rest/webhook';
        return this.client.post<RasaModel[]>(
            url,
            {
                sender: 'user',
                message: userMessage,
            },
            //ocekujemo JSON format kao odgovor.
            { headers: { Accept: 'application/json' } }
        );
    }

}

