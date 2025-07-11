
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus } from "lucide-react";

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

interface DrinkModalProps {
  drink: Drink;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
  initialCustomizations?: Customizations[];
  initialQuantity?: number;
  shouldReturnToCart?: boolean;
}

const customizations: Customizations[] = [
  { name: "Leite de amêndoas", price: 3.50 },
  { name: "Leite de coco", price: 3.00 },
  { name: "Xarope de Caramelo", price: 3.50 },
  { name: "Chocolate ( para polvilhar )", price: 2.00 }
];

export const DrinkModal = ({ drink, isOpen, onClose, onAddToCart, initialCustomizations, initialQuantity, shouldReturnToCart }: DrinkModalProps) => {
  const [selectedCustomizations, setSelectedCustomizations] = useState<Customizations[]>(initialCustomizations || []);
  const [quantity, setQuantity] = useState<number>(initialQuantity || 1);
  const handleCustomizationChange = (customization: Customizations, checked: boolean) => {
    if (checked) {
      setSelectedCustomizations(prev => [...prev, customization]);
    } else {
      setSelectedCustomizations(prev => prev.filter(c => c !== customization));
    }
  };

  const getCustomizationPrice = (name: string) => {
    return customizations.find(c => c.name === name)?.price || 0;
  };

  const getTotalPrice = () => {
    const basePrice = drink.price * quantity;
    const customizationPrice = selectedCustomizations.reduce((total, custom) => {
      return total + getCustomizationPrice(custom.name);
    }, 0) * quantity;
    return basePrice + customizationPrice;
  };

  const handleAddToCart = () => {
    const item: CartItem = {
      drink,
      quantity,
      customizations: selectedCustomizations,
      totalPrice: getTotalPrice()
    };
    onAddToCart(item);
    onClose();
    if (shouldReturnToCart) {
      setTimeout(() => {
        const event = new CustomEvent("openCart");
        window.dispatchEvent(event);
      }, 100);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex flex-col gap-6 max-w-2xl mx-auto bg-[#fff9f3] rounded-lg p-4">
        {/* TOPO: Imagem + Info */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Imagem */}
          <img
            src="public/cafe-nas-maos.jpeg"
            alt=""
            className="w-full md:w-1/2 h-auto rounded-lg object-cover"
          />

          {/* Informações da bebida */}
          <div className="flex-1">
            <DialogHeader>
              <DialogTitle className="text-xl text-[#754416]">Monte sua bebida</DialogTitle>
            </DialogHeader>

            <div className="mt-4 space-y-4">
              <div>
                <p className="text-[#754416] font-semibold">Seu pedido:</p>
                <div className="flex items-center gap-4 bg-[#fffbe0] rounded-lg px-4 py-2">
                  <div className="text-3xl">{drink.image}</div>
                  <div>
                    <h3 className="font-semibold text-[#754416]">{drink.name}</h3>
                    <p className="text-sm text-gray-600">a partir de R$ {drink.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Customizações */}
              <div>
                <h4 className="font-medium text-[#754416] mb-2">Escolha os ingredientes:</h4>
                <div className="space-y-2">
                  {customizations.map((custom) => (
                    <div key={custom.name} className="flex items-start gap-2 bg-[#fffbe0] p-2 rounded-lg">
                      <input
                        type="checkbox"
                        id={custom.name}
                        checked={selectedCustomizations.includes(custom)}
                        onChange={(e) => handleCustomizationChange(custom, e.target.checked)}
                        className="mt-1"
                      />
                      <div>
                        <Label htmlFor={custom.name} className="text-sm">{custom.name}</Label>
                        <p className="text-sm text-gray-600">R$ {custom.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BASE: Subtotal + quantidade + botão */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
          <div className="bg-[#f4b3b3] w-full md:w-1/2 px-4 py-2 text-[#745416] font-semibold rounded-lg text-center">
            Subtotal: R$ {getTotalPrice().toFixed(2)}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Quantidade */}
            <div className="flex items-center rounded-full bg-[#f8e0b3] px-2">
              <Button
                className="bg-transparent hover:bg-[#f8e0b3] text-[#754416] font-bold rounded-full"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-center px-2">{quantity}</span>
              <Button
                className="bg-transparent hover:bg-[#f8e0b3] text-[#754416] font-bold rounded-full"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Botão */}
            <Button
              className="w-full md:w-auto bg-[#d7dfaf] hover:bg-orange-600 hover:text-white text-[#754416] font-semibold rounded-full"
              onClick={handleAddToCart}
            >
              Adicionar ao carrinho
            </Button>
          </div>
        </div>
      </DialogContent>

    </Dialog>
  );
};
