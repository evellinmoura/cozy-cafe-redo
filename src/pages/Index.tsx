import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, User, History, CircleUserRound, ChevronDown, LogOut, ChefHat } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DrinkModal } from "@/components/DrinkModal";
import { Cart } from "@/components/Cart";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { set } from "date-fns";

interface Drink {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface Customizations {
  name: string;
  price: number;
}

interface CartItem {
  drink: Drink;
  quantity: number;
  customizations: Customizations[];
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
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [initialCustomizations, setInitialCustomizations] = useState<Customizations[]>([]);
  const [initialQuantity, setInitialQuantity] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOpenCart = () => setShowCart(true);
    window.addEventListener("open-cart", handleOpenCart);
    return () => {
      window.removeEventListener("open-cart", handleOpenCart);
    };
  }, []);

  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleEditItem = (item: CartItem, index: number) => {
    setSelectedDrink(item.drink);
    setInitialCustomizations(item.customizations);
    setInitialQuantity(item.quantity);
    setEditingItemIndex(index);
    setShowCart(false);
  }

  const handleAddToCart = (item: CartItem) => {
    if (editingItemIndex !== null) {
      const newCart = [...cart];
      newCart[editingItemIndex] = item;
      setCart(newCart);
      setEditingItemIndex(null);
      setShowCart(true);
    } else {
      setCart((prevCart) => [...prevCart, item]);
    }
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
    <div className="min-h-screen bg-[#fff9f3]">
      {/* Header */}
      <header className="hidden lg:block bg-[#f8e0b3] shadow-md">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 py-2 flex justify-between items-center">
          {/*<div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-orange-800">☕ Terra&Café</h1>
          </div>*/}
          <div className="logo-colorido flex items-center gap-3">
            <img src="public\terracafe_colorido.svg"  width="50" height="50"></img>
            <h1 className="text-2xl font-bold font-serif text-[#754416]">Terra&Café</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowCart(true)}
              className="hover:bg-[#e2ce87] relative rounded-full border-transparent bg-transparent"
            >
              <ShoppingCart className="h-5 w-5 text-[#754416]" />
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-orange-500">
                  {getTotalItems()}
                </Badge>
              )}
            </Button>
            {user ? (
              <div className="flex items-center gap-4 text-[#754416]">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button className="hover:bg-[#e2ce87] rounded-full bg-[#d7dfaf] text-[#754416]">
                      <User className="h-4 w-4 mr-2" />
                      {user.name}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-[#d7dfaf] text-[#754416] rounded-sm">
                    <DropdownMenuItem className="hover:bg-[#e2ce87]" onClick={() => navigate("/history")}>
                      <History className="h-4 w-4 mr-2" />
                      Histórico
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-[#e2ce87]" onClick={() => handleLogout()}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex gap-1">
                <Button
                  className="rounded-full hover:bg-[#e2ce87] text-[#754416] bg-[#d7dfaf]"
                  onClick={() => navigate("/login")}
                >
                  <CircleUserRound className="h-4 w-4 mr-2"/>
                  Entrar
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <header className="block lg:hidden bg-[#f8e0b3] shadow-md">
          <div className="w-full py-2 flex align-center justify-evenly items-center">
            <div>
              <img src="public\terracafe_colorido.svg"  width="50" height="50"></img>
            </div>
            <div>
              <h3 className="text-2xl font-bold font-serif text-[#754416]">
                Terra&Café
              </h3>
            </div>
            <div className="flex items-center">
              <Button
                variant="outline"
                onClick={() => setShowCart(true)}
                className="hover:bg-[#e2ce87] relative rounded-full border-transparent bg-transparent"
              >
                <ShoppingCart className="h-5 w-5 text-[#754416]" />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-orange-500">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
              <div>
                {user ? (
                  <div className="flex items-center gap-4 text-[#754416]">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button className="hover:bg-[#e2ce87] rounded-full bg-[#d7dfaf] text-[#754416]">
                          {user.name}
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-[#d7dfaf] text-[#754416] rounded-sm">
                        <DropdownMenuItem className="hover:bg-[#e2ce87]" onClick={() => navigate("/history")}>
                          <History className="h-4 w-4 mr-2" />
                          Histórico
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-[#e2ce87]" onClick={() => handleLogout()}>
                          <LogOut className="h-4 w-4 mr-2" />
                          Sair
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <div className="flex">
                    <Button
                      className="rounded-full hover:bg-[#e2ce87] text-[#754416] bg-[#d7dfaf]"
                      onClick={() => navigate("/login")}
                    >
                      <CircleUserRound className="h-3 w-3 mr-2"/>
                      Entrar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="relative sm:rounded-lg sm:p-2">
          <div className="bg-[#fffbe0] rounded-lg lg:bg-transparent">
            <img 
              src="/public/a-happy-black-young-woman-on-a-coffee-shop 2.png" 
              alt="Imagem de café" 
              className="w-full h-auto"
            />
            <div className="block lg:hidden p-4 rounded-lg text-left text-[#754416]">
            <h2 className="text-3xl font-bold font-serif">
              Seu café, no seu tempo, do seu jeitinho 💛
            </h2>
          </div>
          </div>
          <div className="bg-[#fff9f3] hidden lg:block m-6 rounded-lg absolute bottom-0 left-0 p-3 text-left text-[#754416]">
            <h2 className="text-3xl font-bold font-serif">
              Seu café, no seu tempo, do seu jeitinho 💛
            </h2>
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
                  onClick={() => {
                    setSelectedDrink(drink);
                    setInitialCustomizations([]);
                    setInitialQuantity(1);
                    setEditingItemIndex(null);
                    setShowCart(false);
                  }}
                >
                  Escolher
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="bg-[#412a2b]">
        <div className="max-w-6xl mx-auto px-5 py-8 flex justify-evenly gap-6 items-center">
          <div className="max-w-xs">
            <p className="text-[#f8e0b3]">
              TERRA&CAFÉ
            </p>
            <h1 className="text-[#ff751f] text-2xl font-bold font-serif my-4">
              Seu café, no seu tempo do seu jeitinho
            </h1>
            <p className="text-[#776c59]">
              Todos os direitos reservados © 2025
            </p>
          </div>
          <div className="justify-items-start max-w-xs">
            <p className="text-[#ff751f] my-2">
              Sobre Nós
            </p>
            <p className="text-[#f8e0b3]">
              Conheça mais sobre a nossa história e missão.
            </p>
            <p className="text-[#f8e0b3]">
              Contatos
            </p>
            <p className="text-[#f8e0b3]">
              Endereços
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedDrink && (
        <DrinkModal
          drink={selectedDrink}
          isOpen={!!selectedDrink}
          onClose={() => {
            setSelectedDrink(null);
            setEditingItemIndex(null);
          }}
          onAddToCart={handleAddToCart}
          initialCustomizations={initialCustomizations}
          initialQuantity={initialQuantity}
          shouldReturnToCart={editingItemIndex !== null}
        />
      )}

      {showCart && (
        <Cart
          items={cart}
          isOpen={showCart}
          onClose={() => setShowCart(false)}
          onUpdateCart={setCart}
          onEditItem={handleEditItem}
        />
      )}
    </div>
  );
};

export default Index;
