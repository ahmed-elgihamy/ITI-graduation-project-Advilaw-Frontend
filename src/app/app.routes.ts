import { RegisterClientComponent } from './components/register-client/register-client.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

import { RegisterLawyerComponent } from './components/register-lawyer/register-lawyer.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetConfirmationComponent } from './components/reset-confirmation/reset-confirmation.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register-client', component: RegisterClientComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'register-lawyer', component: RegisterLawyerComponent },
  { path: 'reset-confirmation', component: ResetConfirmationComponent },
  { path: '**', redirectTo: '/login' }
];