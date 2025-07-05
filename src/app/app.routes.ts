// app.routes.ts or app-routing.module.ts
import { Routes } from '@angular/router';

import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterClientComponent } from './components/register-client/register-client.component';
import { RegisterLawyerComponent } from './components/register-lawyer/register-lawyer.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetConfirmationComponent } from './components/reset-confirmation/reset-confirmation.component';

import { JobsComponent } from './pages/jobs/index/jobs.component';
import { CreateJobComponent } from './pages/jobs/create-job/create-job.component';
import { JobDetailsComponent } from './pages/jobs/job-details/job-details.component';
import { LawyersComponent } from './pages/lawyers/lawyers.component';
import { ProfileComponent } from './components/profile/profile.component';

import { AnalysisContentComponent } from './components/dashboard/analysis-content/analysis-content.component';
import { ProfileContentComponent } from './components/dashboard/profile-content/profile-content.component';
import { JobsContentComponent } from './components/dashboard/jobs-content/jobs-content.component';
import { PaymentsContentComponent } from './components/dashboard/payments-content/payments-content.component';
import { ReviewsContentComponent } from './components/dashboard/reviews-content/reviews-content.component';

import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', redirectTo: '', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register-client', component: RegisterClientComponent },
      { path: 'register-lawyer', component: RegisterLawyerComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-confirmation', component: ResetConfirmationComponent },

      // 👇 All Lawyers Page
      { path: 'lawyers', component: LawyersComponent },

      // 👇 Lawyer Profile Page
      { path: 'lawyer-profile/:id', component: ProfileComponent },

      // 👇 Lawyer Consultation Page (lazy-loaded)
      {
        path: 'client/consultation/:lawyerId',
        loadComponent: () =>
          import('./pages/jobs/lawyer-consultation/lawyer-consultation.component').then(
            (m) => m.LawyerConsultationComponent
          )
      },
    ]
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
      { path: 'reviews', component: ReviewsContentComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
