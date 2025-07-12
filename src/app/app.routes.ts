import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterClientComponent } from './components/register-client/register-client.component';
import { RegisterLawyerComponent } from './components/register-lawyer/register-lawyer.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetConfirmationComponent } from './components/reset-confirmation/reset-confirmation.component';

import { ProfileComponent } from './components/profile/profile.component';
import { AllLawyerComponent } from './components/all-lawyer/all-lawyer.component';
import { ChatComponent } from './components/communication/chat/chat.component';

import { JobsComponent } from './pages/jobs/index/jobs.component';
import { CreateJobComponent } from './pages/jobs/create-job/create-job.component';
import { JobDetailsComponent } from './pages/jobs/job-details/job-details.component';

import { LawyersComponent } from './pages/lawyers/lawyers.component';
import { ProposalDetailsComponent } from './pages/proposals/details/details.component';

import { AnalysisContentComponent } from './components/dashboard/analysis-content/analysis-content.component';
import { JobsContentComponent } from './components/dashboard/jobs-content/jobs-content.component';
import { ProfileContentComponent } from './components/dashboard/profile-content/profile-content.component';
// Update the import to match the actual exported member from the file
import { LawyerPaymentsComponent } from './components/dashboard/payments-content/lawyerPaymentDashboard/lawyerPayments.component';
// import { LawyerPaymentsComponent } from './components/dashboard/payments-content/lawyerPaymentDashboard/lawyerPayments.component';
import { ReviewsContentComponent } from './components/dashboard/reviews-content/reviews-content.component';
import { ConsultationsContentComponent } from './components/dashboard/consultations-content/consultations-content.component';

import { AdminDashboardWelcome } from './components/admin-dashboard/admin-dashboard-welcome/admin-dashboard-welcome';
import { PendingLawyersList } from './components/admin-dashboard/pending-lawyers-list/pending-lawyers-list';
import { PendingClientsList } from './components/admin-dashboard/pending-clients-list/pending-clients-list';
import { AdminsList } from './components/admin-dashboard/admins-list/admins-list';
import { AdminProfileEdit } from './components/admin-dashboard/admin-profile-edit/admin-profile-edit';
import { AdminProfileViewComponent } from './components/admin-dashboard/admin-profile-view/admin-profile-view.component';
import { LawyerDetailsComponent } from './components/admin-dashboard/lawyer-details/lawyer-details.component';
import { ClientDetailsComponent } from './components/admin-dashboard/client-details/client-details.component';

import { AdminFundReleasesComponent } from './components/admin-dashboard/admin-fund-releases/admin-fund-releases.component';
import { AdminSessionHistoryComponent } from './components/admin-dashboard/admin-session-history/admin-session-history.component';
import { ClientDashboardComponent } from './components/client-dashboard/client-dashboard.component';
import { ClientOverviewComponent } from './components/client-dashboard/client-overview/client-overview.component';
import { ClientConsultsComponent } from './components/client-dashboard/client-consults/client-consults.component';
import { ClientChatsComponent } from './components/client-dashboard/client-chats/client-chats.component';
import { ClientPaymentsComponent } from './components/client-dashboard/client-payments/client-payments.component';
import { ClientProfileComponent } from './components/client-dashboard/client-profile/client-profile.component';

import { SubscriptionPlansComponent } from './components/subscriptions/subscription-plans/subscription-plans.component';
import { SubscriptionManagementComponent } from './components/subscriptions/subscription-management/subscription-management.component';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { ConsultationReviewComponent } from './components/reviews/consultation-review/consultation-review.component';

import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { PaymentCancelComponent } from './components/payment-cancel/payment-cancel.component';
import { SubscriptionSuccessComponent } from './components/subscription-success/subscription-success.component';
import { SubscriptionCancelComponent } from './components/subscription-cancel/subscription-cancel.component';

import { CountdownTimerComponentComponent } from './components/countdown-timer-component/countdown-timer-component.component';
import { EditLawyerProfileComponent } from './components/edit-lawyer-profile/edit-lawyer-profile.component';
import { LawyerScheduleComponent } from './components/lawyer-schedule/lawyer-schedule.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', redirectTo: '' },

      { path: 'login', component: LoginComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-confirmation', component: ResetConfirmationComponent },

      { path: 'register-client', component: RegisterClientComponent },
      { path: 'register-lawyer', component: RegisterLawyerComponent },

      { path: 'profile/:id', component: ProfileComponent },
      { path: 'lawyer-profile/:id', component: ProfileComponent },
      { path: 'profile-edit', component: EditLawyerProfileComponent },
      { path: 'lawyers/:id/schedule', component: LawyerScheduleComponent },

      { path: 'lawyers', component: LawyersComponent },
      { path: 'allLawyers', component: AllLawyerComponent },

      { path: 'not-allowed', component: AccessDeniedComponent },

      { path: 'ConsultationReview', component: ConsultationReviewComponent },
      { path: 'payment-success', component: PaymentSuccessComponent },
      { path: 'payment-cancel', component: PaymentCancelComponent },
      { path: 'subscription-success', component: SubscriptionSuccessComponent },
      { path: 'subscription-cancel', component: SubscriptionCancelComponent },

      {
        path: 'ConsultationReview/:id',
        component: ConsultationReviewComponent,
      },

      {
        path: 'chat',
        component: ChatComponent,
      },
      {
        path: 'ConsultationReview/:id',
        component: ConsultationReviewComponent,
      },

      {
        path: 'chat/:id',
        component: ChatComponent,

        //  canActivate: [SessionGuard]
      },

      {
        path: 'countdown/:sessionId',
        component: CountdownTimerComponentComponent,
      },

      { path: 'jobs', component: JobsComponent },
      { path: 'jobs/create', component: CreateJobComponent },
      { path: 'jobs/:id', component: JobDetailsComponent },

      { path: 'proposals/:id', component: ProposalDetailsComponent },

      {
        path: 'client/consultation/:lawyerId',
        loadComponent: () =>
          import(
            './pages/jobs/lawyer-consultation/lawyer-consultation.component'
          ).then((m) => m.LawyerConsultationComponent),
      },
      {
        path: 'subscriptions/plan',
        component: SubscriptionPlansComponent,
      },
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
      { path: 'lawyer-payments', component: LawyerPaymentsComponent },
      // { path: 'lawyer-payments', component: LawyerPaymentsComponent },
      { path: 'consultations', component: ConsultationsContentComponent },
      // { path: 'payments', component: PaymentsContentComponent },
      { path: 'reviews', component: ReviewsContentComponent },

      {
        path: 'admin-dashboard',
        // component: MainLayoutComponent,
        // canActivate: [adminGuard],
        children: [
          {
            path: '',
            redirectTo: 'admin/profile',
            // component: AdminDashboardWelcome,
            pathMatch: 'full',
            // canActivate: [adminGuard],
          },
          {
            path: 'pending-lawyers',
            component: PendingLawyersList,
            // canActivate: [adminGuard],
          },
          {
            path: 'pending-clients',
            component: PendingClientsList,
            // canActivate: [adminGuard],
          },
          {
            path: 'admins-list',
            component: AdminsList,
            // canActivate: [adminGuard],
          },
          {
            path: 'profile-edit',
            component: AdminProfileEdit,
            // canActivate: [adminGuard],
          },
          {
            path: 'admin/profile',
            component: AdminProfileViewComponent,
            // canActivate: [adminGuard],
          },
          {
            path: 'lawyers/:id',
            component: LawyerDetailsComponent,
            // canActivate: [adminGuard],
          },
          {
            path: 'clients/:id',
            component: ClientDetailsComponent,
            // canActivate: [adminGuard],
          },
          {
            path: 'subscriptions',
            component: SubscriptionManagementComponent,
            // canActivate: [adminGuard],
          },
          {
            path: 'fund-releases',
            component: AdminFundReleasesComponent,
            // canActivate: [adminGuard],
          },
          {
            path: 'session-history',
            component: AdminSessionHistoryComponent,
            // canActivate: [adminGuard],
          },
        ],
      },

      { path: 'reviews', component: ReviewsContentComponent },
    ],
  },

  {
    path: 'client',
    component: ClientDashboardComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: ClientOverviewComponent },
      { path: 'consults', component: ClientConsultsComponent },
      { path: 'chats', component: ClientChatsComponent },
      { path: 'payments', component: ClientPaymentsComponent },
      { path: 'profile', component: ClientProfileComponent },
    ],
  },

  { path: '**', redirectTo: '/login' },
];
