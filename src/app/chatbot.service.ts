import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { RasaModel } from "../models/rasa.model";


@Injectable({
    providedIn: 'root',
})
export class ChatbotService {
    static instance: ChatbotService;
    //private baseUrl: string;
    private client: HttpClient;

    private constructor() {
        this.client = inject(HttpClient)
    }

    public getRasaMessage(userMessage: string) {
        const url = 'http://localhost:5005/webhooks/rest/webhook';
        return this.client.post<RasaModel[]>(
            url,
            {
                refreshToken: localStorage.getItem('active') || '',
                message: userMessage,
            },
            { headers: { Accept: 'application/json' } }
        );
    }

    /* private retrieveRasaSession() {
        if (!localStorage.getItem('session')) {
            localStorage.setItem('session', uuidv4());
        }
        return localStorage.getItem('session');
    } */

    public formatDate(date: string | null) {
        if (date === null) return 'On Time';
        return new Date(date).toLocaleString();
    }

    public formatValue(string: string | null) {
        if (string === null) return 'N/A';
        return string;
    }
}

function uuidv4(): string {
    return 'some-generated-uuid'; // Replace with actual UUID logic
}
