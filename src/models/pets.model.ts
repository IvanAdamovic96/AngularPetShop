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
    amount?: number | null;
}