interface Client {
    client_id: number,
    name: string,
    email: string,
    phone_number: string,
    billing_address: string
}

interface UserCreation {
    username: string,
    password: string,
    client_data: Client
}

interface User {
    user_id: number,
    username: string,
    client_data: Client
}

interface Token {
    access_token: string,
    token_type: string,
    expires: Date
}

interface UserWithToken {
    user: User
    token: Token
}