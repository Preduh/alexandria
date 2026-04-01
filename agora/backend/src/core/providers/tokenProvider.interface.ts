export interface ITokenProvider {
  generate(payload: Record<string, any>): string;
}
