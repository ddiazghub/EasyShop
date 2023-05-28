const accountText = document.getElementById("account-text")! as HTMLSpanElement;
const accountButton = document.getElementById("account-button")! as HTMLAnchorElement;

class Session {
    static instance: Session;
    session: UserWithToken | null = null;

    isActive(): boolean {
        return this.session ? true : false;
    }

    async register(redirect: boolean = true): Promise<void> {
        const user: UserCreation = {
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
            this.session = await Api.post("/api/user", user);
            this.session!.token.expires = new Date(this.session!.token.expires);
            this.save();
            console.log("Beginning session: ", this.session);
    
            if (redirect)
                location.href = "/";
        } catch {
            document.getElementById("sign-up-failed")!.hidden = false;
            throw "Sign up failed";
        }
    }

    async login(redirect: boolean = true): Promise<void> {
        const credentials = {
            username: textInput("login-username"),
            password: textInput("login-password")
        };

        try {
            console.log("Sending user data to server:", credentials);
            this.session = await Api.post("/api/user/login", credentials);
            this.session!.token.expires = new Date(this.session!.token.expires);
            console.log("Beginning session: ", this.session);
            this.save();

            if (redirect)
                location.href = "/";
        } catch {
            document.getElementById("login-failed")!.hidden = false;
            throw "Login failed";
        }
    }

    save() {
        if (this.session)
            window.localStorage.setItem("session", JSON.stringify(this.session));
    }

    load() {
        const sess = window.localStorage.getItem("session");

        if (!sess) {
            accountText.innerText = "Sign Up";
            return;
        }

        this.session = JSON.parse(sess);

        if (this.session) {
            this.session.token.expires = new Date(this.session.token.expires);
            const now = new Date();
            console.log(this.session.token.expires, now);

            if (this.session.token.expires < now) {
                this.kill(false);
            } else {
                console.log("Loaded session from localstorage: ", this.session);
                accountText.innerText = "My Account";
                accountButton.href = `/user?user_id=${this.session.user.user_id}`;
            }
        }
    }

    getUser(): User | null {
        return this.session?.user ?? null;
    }

    getToken(): Token | null {
        return this.session?.token ?? null;
    }

    kill(redirect: boolean = true) {
        this.session = null;
        accountText.innerText = "Sign Up";
        accountButton.href = "/login";
        window.localStorage.removeItem("session");

        if (redirect)
            location.href = "/login";
    }

    static get(): Session {
        if (!Session.instance) {
            Session.instance = new Session();
            Session.instance.load();
        }

        return Session.instance;
    }
}

window.addEventListener("DOMContentLoaded", Session.get);

document.getElementById("register-button")?.addEventListener("click", () => {
    Session.get().register();
});

document.getElementById("login-button")?.addEventListener("click", () => {
    Session.get().login();
});