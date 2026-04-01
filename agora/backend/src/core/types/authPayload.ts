/**
 * Central interface for the Authenticated User JWT Payload.
 * Represents the data stored within the token.
 */
export interface AuthPayload {
  userId: string;
  email: string;
}
