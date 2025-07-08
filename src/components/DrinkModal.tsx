
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
      <DialogContent className="flex lg:max-w-[600px] mx-auto rounded-lg bg-[#fff9f3]">
        <div>
          <img 
            src="public/cafe-nas-maos.jpeg" alt="" 
            className="h-auto rounded-lg w-full"
          />
        </div>
        <div>
        <DialogHeader>
          <DialogTitle className="text-xl text-[#754416]">Monte sua bebida</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-2">
          {/* Drink Info */}
          <p className="text-[#754416] font-semibold mb-2">
            Seu pedido:
          </p>
          <div className="flex items-center gap-4 bg-[#fffbe0] rounded-lg px-4 py-2">
            <div className="text-3xl">{drink.image}</div>
            <div>
              <h3 className="font-semibold text-[#754416]">{drink.name}</h3>
              <p className="text-sm text-gray-600">a partir de R$ {drink.price.toFixed(2)}</p>
            </div>
          </div>

        {/* Customizations */}
          <div>
            <h4 className="font-medium mb-3 text-[#754416]">Escolha os demais ingredientes:</h4>
            <div className="space-y-3">
              {customizations.map((custom) => (
                <div key={custom.name} className="flex bg-[#fffbe0] rounded-lg rouded-sm"> 
                    <div className="py-1 px-3 place-content-center">
                      <input
                        type="checkbox"
                        id={custom.name}
                        checked={selectedCustomizations.includes(custom)}
                        onChange={(e) => handleCustomizationChange(custom, e.target.checked)}
                        className="rounded-lg border-gray-300"
                      />
                    </div>
                    <div className="items-start align-center py-1">
                      <div className="">
                        <Label htmlFor={custom.name} className="text-sm">
                          {custom.name}
                        </Label>
                      </div>
                      <span className="text-sm text-gray-600">
                        R$ {custom.price.toFixed(2)}
                      </span>
                    </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between space-evenly gap-2">
            <div className="flex items-center rounded-full bg-[#f8e0b3]">
              <Button
              className="bg-transparent hover:bg-[#f8e0b3] text-[#754416] font-semibold rounded-full"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-center px-1">{quantity}</span>
              <Button
                className="bg-transparent hover:bg-[#f8e0b3] text-[#754416] font-semibold rounded-full"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button 
              className="w-full bg-[#d7dfaf] hover:bg-orange-600 hover:text-white text-[#754416] font-semibold rounded-full"
              onClick={handleAddToCart}
            >
              Adicionar ao carrinho
            </Button>
          </div>
        </div>
      </div>
      </DialogContent>
    </Dialog>
  );
};
