"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    static handleStatus(response) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (response.status) {
                case 401:
                    Session.get().kill();
                    throw yield response.json();
                default:
                    if (!response.ok)
                        throw yield response.json();
            }
        });
    }
    static request(url, method, body = undefined, requestHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = this.setToken(requestHeaders);
            const response = yield fetch(url, { method, headers, body });
            Api.handleStatus(response);
            return yield response.json();
        });
    }
    static get(url, requestHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Api.request(url, "GET", undefined, requestHeaders);
        });
    }
    static postRaw(url, body, requestHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Api.request(url, "POST", body, requestHeaders);
        });
    }
    static sendBody(url, method, body, requestHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = new Headers(requestHeaders);
            headers.append("Content-Type", "application/json");
            return yield Api.request(url, method, JSON.stringify(body), headers);
        });
    }
    static post(url, body, headers = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sendBody(url, "POST", body, headers);
        });
    }
    static put(url, body, headers = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sendBody(url, "PUT", body, headers);
        });
    }
    static patch(url, body, headers = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sendBody(url, "PATCH", body, headers);
        });
    }
    static delete(url, headers = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Api.request(url, "DELETE", undefined, headers);
        });
    }
}
