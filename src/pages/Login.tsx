
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular login
    localStorage.setItem("user", JSON.stringify({ email, name: "Usuário" }));
    
    // Redirect back to home page where user can continue with their order
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
                Acesse sua conta
              </CardTitle>
              <CardDescription>
                Entre para finalizar seu pedido ☕
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

                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-orange-600 hover:text-orange-700"
                  >
                    Esqueceu a senha?
                  </button>
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  Entrar
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Não tem conta? Cadastre-se
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
