export interface UserInterface {
    id: string;
    name: string;
    email: string;
    role: string;
    password?: string;
    passwordConfirm?: string;
    created_at?: string;
    updated_at?: string;   
}