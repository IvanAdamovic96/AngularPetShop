import { Injectable } from "@angular/core";

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    date: Date;
    address: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {

    currentUser: User | null = this.loadUserFromLocalStorage();

    static dummyUserList: Array<User> = [
        {
            id: 0,
            firstName: "Milan",
            lastName: "Pronic",
            email: "pronicmilan@gmail.com",
            password: "11111111",
            phone: "0627588756",
            date: new Date("2000-02-25"),
            address:"Bulevar dr Zorana Djindjica"
        },
        {
            id: 1,
            firstName: "Ivan",
            lastName: "Adamovic",
            email: "ivan@gmail.com",
            password: "2222",
            phone: "0611451808",
            date: new Date("1996-08-29"),
            address:"Nikole Pasica 9"
        }
    ]




    private loadUserFromLocalStorage(): User | null {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    private saveUserToLocalStorage(user: User): void {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    logout(): void {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('orders');
    }

    isLoggedIn(): boolean {
        return this.currentUser !== null;
    }

    /*
    getUserName(user: User): string {
        return user ? user.email : '';
    }

    
    getUserById(id: number): User {
        let foundUser!: User;

        UserService.dummyUserList.forEach(user => {
            if (user.id == id) {
                foundUser = user;
            }
        });

        this.currentUser = foundUser;
        this.saveUserToLocalStorage(foundUser);
        return foundUser;
    }
    */

    getUser(userEmail: string): User | null{
        return UserService.dummyUserList.find(user => user.email === userEmail) || null;
    }


    isPasswordCorrect(userEmail: string, password: string): boolean {

        const user = this.getUser(userEmail);

        if (user && user.password === password) {
            this.currentUser = user;
            this.saveUserToLocalStorage(user);
            return true;
        }

        return false;
    }

    registerUser(firstName: string, lastName: string, email: string, password: string, phone: string, date: Date, address: string): User {
        let maxId: number = 0;
        UserService.dummyUserList.forEach(user => {
            if (maxId < user.id) {
                maxId = user.id;
            }
        });

        const id = ++maxId;
        const user: User = { id, firstName, lastName,  email, password, phone, date, address };

        UserService.dummyUserList.push(user);

        this.currentUser = user;
        this.saveUserToLocalStorage(user);
        console.log(user);
        return user;
    }
    
}