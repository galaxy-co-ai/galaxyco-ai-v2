/**
 * Type declarations for Nango integration
 * Provides types for optional Nango dependency
 */

declare module '@nangohq/frontend' {
  export class Nango {
    constructor(config: { publicKey: string; host?: string });
    auth(integration: string, connectionId: string): Promise<{ providerConfigKey: string }>;
  }
}

declare module '@nangohq/node' {
  export class Nango {
    constructor(config: { secretKey: string; host?: string });
    getConnection(
      integration: string,
      connectionId: string,
    ): Promise<{ credentials: { access_token: string; refresh_token?: string } }>;
    deleteConnection(integration: string, connectionId: string): Promise<void>;
  }
}

