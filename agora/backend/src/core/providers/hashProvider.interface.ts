export interface IHashProvider {
  compare(plaintext: string, hashed: string): Promise<boolean>;
  hash(plaintext: string): Promise<string>;
}
