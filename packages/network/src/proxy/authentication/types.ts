export interface AuthenticationSession {
    token: string;
}

export interface Authenticator {
    authenticate(token: string): Promise<AuthenticationSession | false>
}
