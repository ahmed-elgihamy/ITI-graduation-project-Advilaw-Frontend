export interface DecodedToken {
  sub: string;
  email: string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
  userId: string;
  exp: number;
  iss: string;
  aud: string;
}
