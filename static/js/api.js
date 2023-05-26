"use strict";
class Api {
    static setToken(headers) {
        const token = Session.get().getToken();
        const head = new Headers(headers);
        console.log(token);
        if (token)
            head.append("Authorization", `${token.token_type} ${token.access_token}`);
        console.log(head);
        return head;
    }
    static async get(url, requestHeaders = {}) {
        const headers = this.setToken(requestHeaders);
        const response = await fetch(url, { headers });
        if (!response.ok)
            throw "Error on HTTP request";
        return await response.json();
    }
    static async postRaw(url, body, requestHeaders = {}) {
        const headers = this.setToken(requestHeaders);
        const response = await fetch(url, { method: "POST", headers, body });
        if (!response.ok)
            throw "Error on HTTP request";
        return await response.json();
    }
    static async sendBody(url, method, body, requestHeaders = {}) {
        const headers = this.setToken(requestHeaders);
        headers.append("Content-Type", "application/json");
        const response = await fetch(url, { method, headers, body: JSON.stringify(body) });
        if (!response.ok)
            throw "Error on HTTP request";
        return await response.json();
    }
    static async post(url, body, headers = {}) {
        return await this.sendBody(url, "POST", body, headers);
    }
    static async put(url, body, headers = {}) {
        return this.sendBody(url, "PUT", body, headers);
    }
}
