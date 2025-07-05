import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, User, History, LogOut, ChefHat } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DrinkModal } from "@/components/DrinkModal";
import { Cart } from "@/components/Cart";

interface Drink {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface CartItem {
  drink: Drink;
  quantity: number;
  customizations: string[];
  totalPrice: number;
}

const drinks: Drink[] = [
  {
    id: "1",
    name: "Café coado",
    price: 13.00,
    image: "☕",
    description: "Café coado tradicional"
  },
  {
    id: "2",
    name: "Café expresso",
    price: 15.00,
    image: "☕",
    description: "Expresso forte e encorpado"
  },
  {
    id: "3",
    name: "Café Americano",
    price: 13.00,
    image: "☕",
    description: "Café americano suave"
  },
  {
    id: "4",
    name: "Café coado",
    price: 15.00,
    image: "☕",
    description: "Café coado especial"
  },
  {
    id: "5",
    name: "Café Americano",
    price: 16.00,
    image: "☕",
    description: "Café americano premium"
  }
];

const Index = () => {
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleAddToCart = (item: CartItem) => {
    setCart(prev => [...prev, item]);
    setSelectedDrink(null);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          {/*<div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-orange-800">☕ Terra&Café</h1>
          </div>*/}
          <div className="logo-colorido">
            <img src="public\terracafe_colorido.svg"  width="50" height="50"></img>
            <h1 className="text-2xl font-bold text-orange-800">Terra&Café</h1>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/history")}
                >
                  <History className="h-4 w-4 mr-2" />
                  Histórico
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                >
                  Sair
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/login")}
                >
                  Entrar
                </Button>
              </div>
            )}
            <Button
              variant="outline"
              onClick={() => setShowCart(true)}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-orange-500">
                  {getTotalItems()}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-8">
  <div className="relative">
    <img 
      src="/public/a-happy-black-young-woman-on-a-coffee-shop 2.png" 
      alt="Imagem de café" 
      className="w-full h-auto"
    />
    <div className="absolute bottom-0 left-0 p-4 text-left text-white">
      <h2 className="text-3xl font-bold text-orange-800 mb-2">
        Seu café, no seu tempo
      </h2>
      <p className="text-orange-700 text-lg">
        do seu jeitinho 
      </p>
    </div>
  </div>
</section>



      {/* Menu Section */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <h3 className="text-2xl font-bold text-orange-800 mb-6">
          Selecione a base da sua bebida ☕
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drinks.map((drink) => (
            <Card key={drink.id} className="hover:shadow-lg transition-shadow cursor-pointer bg-white">
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{drink.image}</div>
                <CardTitle className="text-lg">{drink.name}</CardTitle>
                <CardDescription className="text-orange-600 font-semibold">
                  R$ {drink.price.toFixed(2)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  onClick={() => setSelectedDrink(drink)}
                >
                  Escolher
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Modals */}
      {selectedDrink && (
        <DrinkModal
          drink={selectedDrink}
          isOpen={!!selectedDrink}
          onClose={() => setSelectedDrink(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {showCart && (
        <Cart
          items={cart}
          isOpen={showCart}
          onClose={() => setShowCart(false)}
          onUpdateCart={setCart}
        />
      )}
    </div>
  );
};

export default Index;
