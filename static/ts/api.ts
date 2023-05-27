class Api {
    static setToken(headers: HeadersInit): Headers {
        const token = Session.get().getToken();
        const head = new Headers(headers);

        console.log(token);

        if (token)
            head.append("Authorization", `${token.token_type} ${token.access_token}`);
        
        console.log(head);

        return head;
    }

    static async handleStatus(response: Response) {
        switch (response.status) {
            case 401:
                Session.get().kill();
                throw await response.json();
            default:
                if (!response.ok)
                    throw await response.json();
        }
    }

    static async request<T extends BodyInit, E>(url: string, method: string, body: T | undefined = undefined, requestHeaders: HeadersInit = {}): Promise<E> {
        const headers = this.setToken(requestHeaders);
        const response = await fetch(url, { method, headers, body});
        Api.handleStatus(response);

        return await response.json();
    }

    static async get<T>(url: string, requestHeaders: HeadersInit = {}): Promise<T> {
        return await Api.request(url, "GET", undefined, requestHeaders);
    }

    static async postRaw<T extends BodyInit, E>(url: string, body: T, requestHeaders: HeadersInit = {}): Promise<E> {
        return await Api.request(url, "POST", body, requestHeaders);
    }

    static async sendBody<T, E>(url: string, method: string, body: T, requestHeaders: HeadersInit = {}): Promise<E> {
        const headers = new Headers(requestHeaders);
        headers.append("Content-Type", "application/json");

        return await Api.request(url, method, JSON.stringify(body), headers);
    }

    static async post<T, E>(url: string, body: T, headers: HeadersInit = {}): Promise<E> {
        return await this.sendBody(url, "POST", body, headers);
    }

    static async put<T, E>(url: string, body: T, headers: HeadersInit = {}): Promise<E> {
        return this.sendBody(url, "PUT", body, headers);
    }

    static async delete(url: string, headers: HeadersInit = {}): Promise<void> {
        return await Api.request(url, "DELETE", undefined, headers);
    }
}