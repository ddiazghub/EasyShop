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

    static async get<T>(url: string, requestHeaders: HeadersInit = {}): Promise<T> {
        const headers = this.setToken(requestHeaders);
        const response = await fetch(url, { headers });

        if (!response.ok)
            throw "Error on HTTP request";

        return await response.json();
    }

    static async postRaw<T extends BodyInit, E>(url: string, body: T, requestHeaders: HeadersInit = {}): Promise<E> {
        const headers = this.setToken(requestHeaders);
        const response = await fetch(url, { method: "POST", headers, body });

        if (!response.ok)
            throw "Error on HTTP request";

        return await response.json();
    }

    static async sendBody<T, E>(url: string, method: string, body: T, requestHeaders: HeadersInit = {}): Promise<E> {
        const headers = this.setToken(requestHeaders);
        headers.append("Content-Type", "application/json");
        const response = await fetch(url, { method, headers, body: JSON.stringify(body) });

        if (!response.ok)
            throw "Error on HTTP request";

        return await response.json();
    }

    static async post<T, E>(url: string, body: T, headers: HeadersInit = {}): Promise<E> {
        return await this.sendBody(url, "POST", body, headers);
    }

    static async put<T, E>(url: string, body: T, headers: HeadersInit = {}): Promise<E> {
        return this.sendBody(url, "PUT", body, headers);
    }
}