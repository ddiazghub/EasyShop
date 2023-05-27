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
var _a, _b;
class Session {
    constructor() {
        this.session = null;
    }
    isActive() {
        return this.session ? true : false;
    }
    register(redirect = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = {
                username: textInput("username"),
                password: textInput("password"),
                client_data: {
                    client_id: 0,
                    name: textInput("full-name"),
                    email: textInput("email"),
                    phone_number: textInput("phone"),
                    billing_address: textInput("address")
                }
            };
            try {
                console.log("Sending user data to server:", user);
                this.session = yield Api.post("/api/user", user);
                this.session.token.expires = new Date(this.session.token.expires);
                this.save();
                console.log("Beginning session: ", this.session);
                if (redirect)
                    location.href = "/";
            }
            catch (_a) {
                document.getElementById("sign-up-failed").hidden = false;
                throw "Sign up failed";
            }
        });
    }
    login(redirect = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const credentials = {
                username: textInput("login-username"),
                password: textInput("login-password")
            };
            try {
                console.log("Sending user data to server:", credentials);
                this.session = yield Api.post("/api/user/login", credentials);
                this.session.token.expires = new Date(this.session.token.expires);
                console.log("Beginning session: ", this.session);
                this.save();
                if (redirect)
                    location.href = "/";
            }
            catch (_a) {
                document.getElementById("login-failed").hidden = false;
                throw "Login failed";
            }
        });
    }
    save() {
        if (this.session)
            window.localStorage.setItem("session", JSON.stringify(this.session));
    }
    load() {
        const sess = window.localStorage.getItem("session");
        if (!sess) {
            document.getElementById("account-text").innerText = "Sign Up";
            return;
        }
        this.session = JSON.parse(sess);
        if (this.session) {
            this.session.token.expires = new Date(this.session.token.expires);
            const now = new Date();
            console.log(this.session.token.expires, now);
            if (this.session.token.expires < now) {
                this.kill(false);
            }
            else {
                console.log("Loaded session from localstorage: ", this.session);
                document.getElementById("account-text").innerText = "My Account";
            }
        }
    }
    getUser() {
        var _a, _b;
        return (_b = (_a = this.session) === null || _a === void 0 ? void 0 : _a.user) !== null && _b !== void 0 ? _b : null;
    }
    getToken() {
        var _a, _b;
        return (_b = (_a = this.session) === null || _a === void 0 ? void 0 : _a.token) !== null && _b !== void 0 ? _b : null;
    }
    kill(redirect = true) {
        this.session = null;
        document.getElementById("account-text").innerText = "Sign Up";
        window.localStorage.removeItem("session");
        if (redirect)
            location.href = "/login";
    }
    static get() {
        if (!Session.instance) {
            Session.instance = new Session();
            Session.instance.load();
        }
        return Session.instance;
    }
}
window.addEventListener("DOMContentLoaded", Session.get);
(_a = document.getElementById("register-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    Session.get().register();
});
(_b = document.getElementById("login-button")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
    Session.get().login();
});
