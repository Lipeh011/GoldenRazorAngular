import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ServicesComponent } from './components/services1/services.component';
import { BarberGuard } from './services/auth.guard';
import { ContactComponent } from './components/contact/contact.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserPanelComponent } from './components/user-panel/user-panel.component';
import { BarberPanelComponent } from './components/barber-panel/barber-panel.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'servicos', component: ServicesComponent },
 
{ 
  path: 'barber', 
  component: BarberPanelComponent,
  canActivate: [BarberGuard] 
},
  { path: 'contato', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  {path: 'barber', component: BarberPanelComponent},
  { path: 'cadastro', component: RegisterComponent },
  { path: 'user', component: UserPanelComponent },
  { path: '**', redirectTo: '' }
];