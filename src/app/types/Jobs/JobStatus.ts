export enum JobStatus {
  WaitingApproval = 'WaitingApproval',
  NotAssigned = 'NotAssigned',
  WaitingAppointment = 'WaitingAppointment',
  WaitingPayment = 'WaitingPayment',
  NotStarted = 'NotStarted',
  LawyerRequestedAppointment = 'LawyerRequestedAppointment',
  ClientRequestedAppointment = 'ClientRequestedAppointment',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  Started = 'Started',
  Ended = 'Ended',
}
