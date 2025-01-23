import { Pets } from "./pets.model"

export interface RasaModel {
    recipient_id: string
    image: string | null
    attachment: Pets[] | null
    text: string | null
    json_message: {
        actionType: string;
        products: Pets[];
    } | null;
}