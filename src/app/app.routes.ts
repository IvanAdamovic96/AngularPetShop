import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { PetsComponent } from './pets/pets.component';
import { PetsdetailsComponent } from './petsdetails/petsdetails.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { CartComponent } from './cart/cart.component';
import { ProfileComponent } from './auth/profile/profile.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'home', component: HomeComponent},
    {path: 'pets', component: PetsComponent},
    {path: 'petsdetails/:id', component: PetsdetailsComponent},
    {path: 'about', component: AboutComponent},
    {path: 'contact', component: ContactComponent},
    {path: 'signup', component:SignupComponent},
    {path: 'login', component:LoginComponent},
    {path: 'logout', component:LogoutComponent},
    {path: 'profile', component:ProfileComponent},
    {path: 'cart', component:CartComponent},
    {path: '**', redirectTo: '' }
];
