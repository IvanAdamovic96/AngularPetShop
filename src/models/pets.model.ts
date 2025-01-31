import { Review } from "./review.model";

export interface Pets {
    id: number;
    picture: string;
    name: string;
    description: string;
    type: string;
    age: number;
    size: string;
    rating: number;
    price: number;
    reviews?: Array<Review>;
    /* amount?: number | null; */
}