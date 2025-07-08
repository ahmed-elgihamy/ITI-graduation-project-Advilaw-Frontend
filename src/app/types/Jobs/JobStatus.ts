export enum JobStatus {
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
