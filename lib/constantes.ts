function requireEnv(name: string, value: string | undefined): string {
    if (!value) {
      throw new Error(`Variável de ambiente ${name} não está definida.`);
    }
    return value;
  }
  
  export const API_BASE_URL = requireEnv('API_URL', process.env.API_URL);
  export const USER_ID = requireEnv('API_USER_ID', process.env.API_USER_ID);