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
    static async handleStatus(response) {
        switch (response.status) {
            case 401:
                const url = new URL(location.href);
                Session.get().kill(url.pathname != "/login");
                throw await response.json();
            default:
                if (!response.ok)
                    throw await response.json();
        }
    }
    static async request(url, method, body = undefined, requestHeaders = {}) {
        const headers = this.setToken(requestHeaders);
        const response = await fetch(url, { method, headers, body });
        Api.handleStatus(response);
        return await response.json();
    }
    static async get(url, requestHeaders = {}) {
        return await Api.request(url, "GET", undefined, requestHeaders);
    }
    static async postRaw(url, body, requestHeaders = {}) {
        return await Api.request(url, "POST", body, requestHeaders);
    }
    static async sendBody(url, method, body, requestHeaders = {}) {
        const headers = new Headers(requestHeaders);
        headers.append("Content-Type", "application/json");
        return await Api.request(url, method, JSON.stringify(body), headers);
    }
    static async post(url, body, headers = {}) {
        return await this.sendBody(url, "POST", body, headers);
    }
    static async put(url, body, headers = {}) {
        return this.sendBody(url, "PUT", body, headers);
    }
    static async patch(url, body, headers = {}) {
        return this.sendBody(url, "PATCH", body, headers);
    }
    static async delete(url, headers = {}) {
        return await Api.request(url, "DELETE", undefined, headers);
    }
}
