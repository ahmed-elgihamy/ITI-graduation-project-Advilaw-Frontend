export enum JobStatus {
  NotAssigned = 'NotAssigned',
  WaitingAppointment = 'WaitingAppointment',
  WaitingPayment = 'WaitingPayment',
  NotStarted = 'NotStarted',
  LawyerRequestedAppointment = 'LawyerRequestedAppointment',
  ClientRequestedAppointment = 'ClientRequestedAppointment',
  Started = 'Started',
  Ended = 'Ended',
}
