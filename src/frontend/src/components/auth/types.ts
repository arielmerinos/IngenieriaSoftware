export interface Credentials {
    username: string;
    password: string;
    name?: string;
}

export interface AuthFormProps {
    onSubmit: (data: Credentials) => Promise<void>;
    loginError?: string | null;
}