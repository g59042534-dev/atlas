import { createClient } from "@supabase/supabase-js";

// Check if Supabase keys are configured
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || "";
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "";

const isConfigured = 
  supabaseUrl && 
  supabaseUrl.trim() !== "" && 
  supabaseAnonKey && 
  supabaseAnonKey.trim() !== "" &&
  !supabaseUrl.includes("YOUR_") &&
  !supabaseAnonKey.includes("YOUR_");

// Real client initialization if configured
let realEngine: any = null;
if (isConfigured) {
  try {
    realEngine = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error("Erro ao inicializar cliente real do Supabase:", error);
  }
}

// Sandbox/Mock engine implementation for local fallback
class SandboxAuthEngine {
  private listeners: Array<(event: string, session: any) => void> = [];

  constructor() {
    // Listen to storage events to stay in sync
    if (typeof window !== "undefined") {
      window.addEventListener("storage", (e) => {
        if (e.key === "atlas_sandbox_session") {
          this.triggerAuthStateChange();
        }
      });
    }
  }

  private getUsers(): any[] {
    const raw = localStorage.getItem("atlas_sandbox_users");
    return raw ? JSON.parse(raw) : [
      { id: "user-default-123", email: "demo@atlas.com", password: "password123" }
    ];
  }

  private saveUsers(users: any[]) {
    localStorage.setItem("atlas_sandbox_users", JSON.stringify(users));
  }

  private getLocalSession() {
    const raw = localStorage.getItem("atlas_sandbox_session");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  private saveSession(session: any) {
    if (session) {
      localStorage.setItem("atlas_sandbox_session", JSON.stringify(session));
    } else {
      localStorage.removeItem("atlas_sandbox_session");
    }
    this.triggerAuthStateChange();
  }

  private triggerAuthStateChange() {
    const session = this.getLocalSession();
    const event = session ? "SIGNED_IN" : "SIGNED_OUT";
    this.listeners.forEach((cb) => cb(event, session));
  }

  async signUp({ email, password, options }: any) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const users = this.getUsers();
    
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return {
        data: { user: null, session: null },
        error: { message: "Um usuário com este e-mail já existe." }
      };
    }

    const newUser = {
      id: "usr-" + Math.random().toString(36).substring(2, 11),
      email,
      password, // storing plaintext only for sandbox purposes
      user_metadata: options?.data || {}
    };

    users.push(newUser);
    this.saveUsers(users);

    const session = {
      access_token: "mock-token-" + Math.random().toString(36).substring(2),
      user: {
        id: newUser.id,
        email: newUser.email,
        email_confirmed_at: new Date().toISOString(),
        user_metadata: newUser.user_metadata
      }
    };

    this.saveSession(session);

    return {
      data: { user: session.user, session },
      error: null
    };
  }

  async signInWithPassword({ email, password }: any) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const users = this.getUsers();
    
    const matched = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!matched) {
      return {
        data: { user: null, session: null },
        error: { message: "Credenciais inválidas. Por favor verifique seu e-mail e senha." }
      };
    }

    const session = {
      access_token: "mock-token-" + Math.random().toString(36).substring(2),
      user: {
        id: matched.id,
        email: matched.email,
        email_confirmed_at: new Date().toISOString(),
        user_metadata: matched.user_metadata || {}
      }
    };

    this.saveSession(session);

    return {
      data: { user: session.user, session },
      error: null
    };
  }

  async signOut() {
    await new Promise((resolve) => setTimeout(resolve, 200));
    this.saveSession(null);
    return { error: null };
  }

  async resetPasswordForEmail(email: string, options?: any) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const users = this.getUsers();
    const matched = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    
    if (!matched) {
      return {
        data: null,
        error: { message: "E-mail não cadastrado em nosso sistema." }
      };
    }

    // Simulated email logs or status
    console.log(`[SANDBOX EMAIL] Link de recuperação de senha enviado para: ${email}`);
    
    return {
      data: {},
      error: null
    };
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    this.listeners.push(callback);
    // Call instantly with current state
    const currentSession = this.getLocalSession();
    callback(currentSession ? "INITIAL_SESSION" : "SIGNED_OUT", currentSession);

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            this.listeners = this.listeners.filter((cb) => cb !== callback);
          }
        }
      }
    };
  }

  async getSession() {
    return {
      data: { session: this.getLocalSession() },
      error: null
    };
  }

  async getUser() {
    const session = this.getLocalSession();
    return {
      data: { user: session ? session.user : null },
      error: null
    };
  }
}


// Create simulated client matching standard structure
const sandboxClient = {
  auth: new SandboxAuthEngine(),
  isSandbox: true
};

export const supabase = realEngine ? { ...realEngine, isSandbox: false } : sandboxClient;
