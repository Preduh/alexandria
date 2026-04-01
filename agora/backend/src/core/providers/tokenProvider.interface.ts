export interface ITokenProvider {
  generate(payload: Record<string, any>): string;
  verify(token: string): Record<string, any> | null;
}
