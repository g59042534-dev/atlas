import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { Shield, Mail, Lock, Eye, EyeOff, CheckCircle2, AlertTriangle, RefreshCw, ArrowLeft, User } from "lucide-react";

interface AuthScreenProps {
  onAuthSuccess: (session: any) => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [mode, setMode] = useState<"login" | "register" | "recovery">("login");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const clearMessages = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleToggleMode = (newMode: "login" | "register" | "recovery") => {
    setMode(newMode);
    clearMessages();
    setPassword("");
    setConfirmPassword("");
    setDisplayName("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    clearMessages();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMsg(error.message || "Erro ao realizar login. Verifique suas credenciais.");
      } else if (data?.session) {
        onAuthSuccess(data.session);
      } else {
        setErrorMsg("Erro inesperado durante a autenticação.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Ocorreu um erro inesperado de rede.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword || !displayName) {
      setErrorMsg("Todos os campos do formulário são obrigatórios, incluindo o Nome de Exibição.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("A senha deve conter no mínimo 6 caracteres por segurança.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("As senhas inseridas não coincidem.");
      return;
    }

    setLoading(true);
    clearMessages();

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            display_name: displayName.trim(),
          }
        }
      });

      if (error) {
        setErrorMsg(error.message || "Erro ao criar conta.");
      } else {
        setSuccessMsg("Conta criada com sucesso! Você agora está conectado à plataforma Atlas Evidências.");
        
        // Wait a small moment to let user read success message, then log them in automatically
        setTimeout(() => {
          if (data?.session) {
            onAuthSuccess(data.session);
          } else {
            handleToggleMode("login");
            setSuccessMsg("Por favor, realize o login com as credenciais recém-cadastradas.");
          }
        }, 1800);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Erro no processamento do cadastro.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Por favor, forneça o e-mail cadastrado.");
      return;
    }

    setLoading(true);
    clearMessages();

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.href,
      });

      if (error) {
        setErrorMsg(error.message || "Erro ao iniciar processo de recuperação.");
      } else {
        if (supabase.isSandbox) {
          setSuccessMsg(
            `Simulação de recuperação ativa: Um token de redefinição de senha foi registrado no log para o e-mail: ${email}.`
          );
        } else {
          setSuccessMsg(
            "Um e-mail para redefinição de senha foi enviado com sucesso! Por favor, verifique a sua caixa de entrada e spam."
          );
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao solicitar recuperação de senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-screen-container" className="min-h-screen bg-background flex flex-col items-center justify-center p-4 selection:bg-primary/20 relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#c5a059]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-surface-container border border-outline-variant/30 rounded-2xl shadow-2xl p-6 md:p-8 z-10 transition-all">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-3">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">Atlas Evidências</h1>
          <p className="text-secondary text-xs mt-1 max-w-sm">
            Plataforma técnica de catalogação de mídias e registro de hashes de integridade matemática.
          </p>
        </div>

        {/* Dynamic Forms */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4 font-sans">
            <h2 className="text-base font-bold text-on-surface border-b border-outline-variant/20 pb-2">Acesse sua Conta</h2>
            
            {errorMsg && (
              <div className="p-3 bg-error-container/30 border border-error-container/60 rounded-xl flex items-start gap-2.5 text-xs text-error">
                <AlertTriangle className="w-4 h-4 text-error shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Endereço de E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                <input
                  type="email"
                  value={email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@atlas.com"
                  className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary rounded-xl pl-10 pr-4 py-2.5 text-xs text-on-surface placeholder:text-secondary/30 outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Senha de Acesso</label>
                <button
                  type="button"
                  onClick={() => handleToggleMode("recovery")}
                  className="text-[10px] font-semibold text-primary hover:underline"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha secreta"
                  className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary rounded-xl pl-10 pr-10 py-2.5 text-xs text-on-surface placeholder:text-secondary/30 outline-none transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/50 hover:text-on-surface p-1 rounded-md"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-[#c5a059] disabled:bg-primary/50 text-on-primary font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <span>Entrar no Sistema</span>
              )}
            </button>

            <div className="text-center pt-2">
              <span className="text-secondary text-[11px]">Não possui cadastro? </span>
              <button
                type="button"
                onClick={() => handleToggleMode("register")}
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                Crie um perfil grátis
              </button>
            </div>
          </form>
        )}

        {mode === "register" && (
          <form onSubmit={handleRegister} className="space-y-4 font-sans">
            <h2 className="text-base font-bold text-on-surface border-b border-outline-variant/20 pb-2">Cadastre-se Grátis</h2>

            {errorMsg && (
              <div className="p-3 bg-error-container/30 border border-error-container/60 rounded-xl flex items-start gap-2.5 text-xs text-error">
                <AlertTriangle className="w-4 h-4 text-error shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-2.5 text-xs text-emerald-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{successMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Nome de Exibição</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                <input
                  type="text"
                  value={displayName}
                  disabled={loading}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Nome de Exibição (Ex: Gabriel Pimenta)"
                  className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary rounded-xl pl-10 pr-4 py-2.5 text-xs text-on-surface placeholder:text-secondary/30 outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Endereço de E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                <input
                  type="email"
                  value={email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email-profissional.com"
                  className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary rounded-xl pl-10 pr-4 py-2.5 text-xs text-on-surface placeholder:text-secondary/30 outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Escolha uma Senha (mín. 6 caracteres)</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  disabled={loading || !!successMsg}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha ultra segura"
                  className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary rounded-xl pl-10 pr-4 py-2.5 text-xs text-on-surface placeholder:text-secondary/30 outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Confirme a Senha</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  disabled={loading || !!successMsg}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a mesma senha"
                  className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary rounded-xl pl-10 pr-4 py-2.5 text-xs text-on-surface placeholder:text-secondary/30 outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !!successMsg}
              className="w-full bg-primary hover:bg-[#c5a059] disabled:bg-primary/50 text-on-primary font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Cadastrando...</span>
                </>
              ) : (
                <span>Criar Nova Conta</span>
              )}
            </button>

            <div className="text-center pt-2">
              <span className="text-secondary text-[11px]">Já possui cadastro? </span>
              <button
                type="button"
                onClick={() => handleToggleMode("login")}
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                Acesse aqui
              </button>
            </div>
          </form>
        )}

        {mode === "recovery" && (
          <form onSubmit={handleRecovery} className="space-y-4 font-sans">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleToggleMode("login")}
                className="text-secondary hover:text-on-surface p-1 rounded-md transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-base font-bold text-on-surface">Recupere de Senha</h2>
            </div>
            <p className="text-secondary text-[11px] leading-relaxed">
              Informe seu e-mail cadastrado e enviaremos um link de recuperação seguro para redefinição.
            </p>

            {errorMsg && (
              <div className="p-3 bg-error-container/30 border border-error-container/60 rounded-xl flex items-start gap-2.5 text-xs text-error">
                <AlertTriangle className="w-4 h-4 text-error shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-2.5 text-xs text-emerald-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{successMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Endereço de E-mail Cadastrado</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                <input
                  type="email"
                  value={email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@seuprovedor.com"
                  className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary rounded-xl pl-10 pr-4 py-2.5 text-xs text-on-surface placeholder:text-secondary/30 outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-[#c5a059] disabled:bg-primary/50 text-on-primary font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Processando...</span>
                </>
              ) : (
                <span>Enviar Link de Recuperação</span>
              )}
            </button>
          </form>
        )}

        {/* Dynamic Env Notice / Sandbox banner */}
        {supabase.isSandbox && (
          <div className="mt-6 p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl font-sans text-[10px] text-amber-300 leading-normal">
            <span className="font-bold flex items-center gap-1 shadow-sm mb-1 text-xs">
              🛠️ Modo Sandbox Ativo
            </span>
            As chaves de acesso ao Supabase no arquivo <strong>.env</strong> não foram inseridas. O cadastro e o login estão operando em um ambiente de simulação local seguro armazenado em sandbox isolado por usuário.
          </div>
        )}
      </div>
    </div>
  );
}
