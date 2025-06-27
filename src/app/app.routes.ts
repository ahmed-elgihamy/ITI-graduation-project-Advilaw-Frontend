import { RegisterClientComponent } from './components/register-client/register-client.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

import { RegisterLawyerComponent } from './components/register-lawyer/register-lawyer.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetConfirmationComponent } from './components/reset-confirmation/reset-confirmation.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './core/guards/auth.guard';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AnalysisContentComponent } from './components/dashboard/analysis-content/analysis-content.component';
import { JobsContentComponent } from './components/dashboard/jobs-content/jobs-content.component';
import { ProfileContentComponent } from './components/dashboard/profile-content/profile-content.component';
import { PaymentsContentComponent } from './components/dashboard/payments-content/payments-content.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', redirectTo: '' },
      { path: 'login', component: LoginComponent, canActivate: [authGuard] },
      {
        path: 'register-client',
        component: RegisterClientComponent,
        canActivate: [authGuard],
      },

      { path: 'forgot-password', component: ForgotPasswordComponent },
      {
        path: 'register-lawyer',
        component: RegisterLawyerComponent,
        canActivate: [authGuard],
      },
      { path: 'reset-confirmation', component: ResetConfirmationComponent },
    ],
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'analytics', pathMatch: 'full' },
      { path: 'analytics', component: AnalysisContentComponent },
      { path: 'profile', component: ProfileContentComponent },
      { path: 'jobs', component: JobsContentComponent },
      { path: 'payments', component: PaymentsContentComponent },
    ],
  },
  { path: '**', redirectTo: '/login' },
];
