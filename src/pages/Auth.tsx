import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";

const emailSchema = z.string().email("E-mail inválido").max(255);
const passwordSchema = z.string().min(6, "A senha deve ter no mínimo 6 caracteres");
const nameSchema = z.string().trim().min(2, "Nome deve ter no mínimo 2 caracteres").max(100);
const phoneSchema = z.string().trim().min(10, "Telefone inválido").max(20);

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message.includes("Invalid login credentials") ? "E-mail ou senha incorretos" : error.message);
      } else {
        toast.success("Login realizado com sucesso!");
      }
    } catch (err) {
      if (err instanceof z.ZodError) toast.error(err.issues[0].message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      nameSchema.parse(fullName);
      phoneSchema.parse(phone);
      emailSchema.parse(email);
      passwordSchema.parse(password);

      const redirectUrl = `${window.location.origin}/`;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectUrl, data: { full_name: fullName, phone } },
      });

      if (error) {
        toast.error(error.message.includes("User already registered") ? "Este e-mail já está cadastrado" : error.message);
      } else {
        toast.success("Cadastro realizado! Verifique seu e-mail para confirmar.");
      }
    } catch (err) {
      if (err instanceof z.ZodError) toast.error(err.issues[0].message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      emailSchema.parse(resetEmail);
      const redirectUrl = `${window.location.origin}/reset-password`; // redireciona de volta para login após redefinição
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: redirectUrl,
      });

      if (error) throw error;
      toast.success("Enviamos um link para redefinir sua senha. Verifique seu e-mail!");
      setShowReset(false);
      setResetEmail("");
    } catch (err) {
      if (err instanceof z.ZodError) toast.error(err.issues[0].message);
      else toast.error("Erro ao enviar e-mail de redefinição.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-elegant border-primary/10">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl bg-gradient-rose-gold bg-clip-text text-transparent">
            {showReset ? "Recuperar Senha" : "Bem-vinda!"}
          </CardTitle>
          <CardDescription>
            {showReset
              ? "Digite seu e-mail para receber o link de redefinição"
              : isLogin
              ? "Faça login para acessar seus agendamentos"
              : "Crie sua conta para agendar"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {showReset ? (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">E-mail</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enviar link de redefinição
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setShowReset(false)}>
                Voltar ao login
              </Button>
            </form>
          ) : (
            <Tabs value={isLogin ? "login" : "signup"} onValueChange={(v) => setIsLogin(v === "login")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Cadastro</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">E-mail</Label>
                    <Input id="login-email" name="email" type="email" placeholder="seu@email.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <Input id="login-password" name="password" type="password" placeholder="••••••" required />
                  </div>
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-sm text-primary hover:underline"
                      onClick={() => setShowReset(true)}
                    >
                      Esqueci minha senha
                    </button>
                  </div>
                  <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Entrar
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nome Completo</Label>
                    <Input id="signup-name" name="fullName" placeholder="Seu nome" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Telefone</Label>
                    <Input id="signup-phone" name="phone" type="tel" placeholder="(11) 99999-9999" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">E-mail</Label>
                    <Input id="signup-email" name="email" type="email" placeholder="seu@email.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Senha</Label>
                    <Input id="signup-password" name="password" type="password" placeholder="••••••" required />
                  </div>
                  <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Cadastrar
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}

          {!showReset && (
            <div className="mt-4 text-center">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
                Voltar para o início
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;