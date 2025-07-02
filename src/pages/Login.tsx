
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular login
    localStorage.setItem("user", JSON.stringify({ email, name: "Usuário" }));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lado esquerdo - Imagem/Branding */}
        <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-orange-200 to-yellow-200 rounded-lg p-8">
          <div className="text-8xl mb-6">☕</div>
          <h1 className="text-3xl font-bold text-orange-800 mb-2 text-center">Terra&Café</h1>
          <p className="text-orange-700 text-lg text-center">
            Seu café, no seu tempo<br />
            do seu jeitinho ☕
          </p>
        </div>

        {/* Lado direito - Formulário */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-orange-800">
                {isLogin ? "Acesse sua conta" : "Cadastre-se"}
              </CardTitle>
              <CardDescription>
                {isLogin ? "Seu café, no seu tempo, do seu jeitinho 🧡" : "Crie sua conta para começar"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email:</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="exemplo@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Senha:</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="pelo menos 8 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {isLogin && (
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-sm text-orange-600 hover:text-orange-700"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                )}

                <Button 
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  {isLogin ? "Entrar" : "Cadastrar"}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    {isLogin ? "Cadastre-se" : "Já tem conta? Entre"}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
