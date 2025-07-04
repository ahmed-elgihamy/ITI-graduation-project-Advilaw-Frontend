import { authGuard } from './core/guards/auth.guard';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AnalysisContentComponent } from './components/dashboard/analysis-content/analysis-content.component';
import { JobsContentComponent } from './components/dashboard/jobs-content/jobs-content.component';
import { ProfileContentComponent } from './components/dashboard/profile-content/profile-content.component';
import { PaymentsContentComponent } from './components/dashboard/payments-content/payments-content.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard';
import { PendingLawyersList } from './components/admin-dashboard/pending-lawyers-list/pending-lawyers-list';
import { PendingClientsList } from './components/admin-dashboard/pending-clients-list/pending-clients-list';
import { AdminDashboardWelcome } from './components/admin-dashboard/admin-dashboard-welcome/admin-dashboard-welcome';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterClientComponent } from './components/register-client/register-client.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { RegisterLawyerComponent } from './components/register-lawyer/register-lawyer.component';
import { ResetConfirmationComponent } from './components/reset-confirmation/reset-confirmation.component';
import { Routes } from '@angular/router';
import { ReviewsContentComponent } from './components/dashboard/reviews-content/reviews-content.component';
import { JobsComponent } from './pages/jobs/index/jobs.component';
import { CreateJobComponent } from './pages/jobs/create-job/create-job.component';
import { LawyersComponent } from './pages/lawyers/lawyers.component';
import { JobDetailsComponent } from './pages/jobs/job-details/job-details.component';
import { AdminsList } from './components/admin-dashboard/admins-list/admins-list';
import { AdminProfileEdit } from './components/admin-dashboard/admin-profile-edit/admin-profile-edit';
import { adminGuard } from './core/guards/admin.guard';
import { AdminProfileViewComponent } from './components/admin-dashboard/admin-profile-view/admin-profile-view.component';
import { LawyerDetailsComponent } from './components/admin-dashboard/lawyer-details/lawyer-details.component';
import { ClientDetailsComponent } from './components/admin-dashboard/client-details/client-details.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AllLawyerComponent } from './components/all-lawyer/all-lawyer.component';
import { ClientDashboardComponent } from './components/client-dashboard/client-dashboard.component';
import { ClientChatsComponent } from './components/client-dashboard/client-chats/client-chats.component';
import { ClientSettingsComponent } from './components/client-dashboard/client-settings/client-settings.component';
import { ClientPaymentsComponent } from './components/client-dashboard/client-payments/client-payments.component';
import { ClientOverviewComponent } from './components/client-dashboard/client-overview/client-overview.component';
import { ClientConsultsComponent } from './components/client-dashboard/client-consults/client-consults.component';



export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'profile/:id', component: ProfileComponent },
      { path: 'allLawyers', component: AllLawyerComponent },
      { path: 'home', redirectTo: '' },
      { path: 'login', component: LoginComponent },
      {
        path: 'register-client',
        component: RegisterClientComponent,
        // canActivate: [authGuard],
      },
      {
        path: 'jobs',
        component: JobsComponent,
        // canActivate: [authGuard],
      },
      {
        path: 'jobs/create',
        component: CreateJobComponent,
        // canActivate: [authGuard],
      },
      {
        path: 'jobs/:id',
        component: JobDetailsComponent,
        // canActivate: [authGuard],
      },
      {
        path: 'lawyers',
        component: LawyersComponent,
        // canActivate: [authGuard],
      },

      { path: 'forgot-password', component: ForgotPasswordComponent },
      {
        path: 'register-lawyer',
        component: RegisterLawyerComponent,
        //   canActivate: [authGuard],
      },
      { path: 'reset-confirmation', component: ResetConfirmationComponent },
    ],
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    // canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'analytics', pathMatch: 'full' },
      { path: 'analytics', component: AnalysisContentComponent },
      { path: 'profile', component: ProfileContentComponent },
      { path: 'jobs', component: JobsContentComponent },
      { path: 'payments', component: PaymentsContentComponent },

      {
        path: 'admin-dashboard',
        component: AdminDashboardComponent,
        canActivate: [adminGuard],
        children: [
          { path: '', component: AdminDashboardWelcome, canActivate: [adminGuard] },
          { path: 'pending-lawyers', component: PendingLawyersList, canActivate: [adminGuard] },
          { path: 'pending-clients', component: PendingClientsList, canActivate: [adminGuard] },
          { path: 'admins-list', component: AdminsList, canActivate: [adminGuard] },
          { path: 'profile-edit', component: AdminProfileEdit, canActivate: [adminGuard] },
          { path: 'admin/profile', component: AdminProfileViewComponent, canActivate: [adminGuard] },
          { path: 'lawyers/:id', component: LawyerDetailsComponent, canActivate: [adminGuard] },
          { path: 'clients/:id', component: ClientDetailsComponent, canActivate: [adminGuard] }
        ]
      }

      , { path: 'reviews', component: ReviewsContentComponent },

    ],
  },
  {
    path: 'client-dashboard',
    component: ClientDashboardComponent,
    children: [
      {path:"",redirectTo:'overview',pathMatch:"full"},
      { path: 'chats', component: ClientChatsComponent },
      { path: 'settings', component: ClientSettingsComponent },
      { path: 'payments', component: ClientPaymentsComponent },
      { path: 'overview', component: ClientOverviewComponent },
      { path: 'consults', component: ClientConsultsComponent }
    ]
    // canActivate: [authGuard],
  },

  { path: '**', redirectTo: '/login' },
];
