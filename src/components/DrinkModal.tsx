
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

interface CartItem {
  drink: Drink;
  quantity: number;
  customizations: string[];
  totalPrice: number;
}

interface DrinkModalProps {
  drink: Drink;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

const customizations = [
  { name: "Leite de amêndoas", price: 3.50 },
  { name: "Leite de coco", price: 3.00 },
  { name: "Xarope de Caramelo", price: 3.50 },
  { name: "Chocolate ( para polvilhar )", price: 2.00 }
];

export const DrinkModal = ({ drink, isOpen, onClose, onAddToCart }: DrinkModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState<string[]>([]);

  const handleCustomizationChange = (customization: string, checked: boolean) => {
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
      return total + getCustomizationPrice(custom);
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
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Monte sua bebida</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Drink Info */}
          <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg">
            <div className="text-3xl">{drink.image}</div>
            <div>
              <h3 className="font-semibold">{drink.name}</h3>
              <p className="text-sm text-gray-600">a partir de R$ {drink.price.toFixed(2)}</p>
            </div>
          </div>

          {/* Customizations */}
          <div>
            <h4 className="font-medium mb-3">Escolha os demais ingredientes:</h4>
            <div className="space-y-3">
              {customizations.map((custom) => (
                <div key={custom.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={custom.name}
                      checked={selectedCustomizations.includes(custom.name)}
                      onChange={(e) => handleCustomizationChange(custom.name, e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={custom.name} className="text-sm">
                      {custom.name}
                    </Label>
                  </div>
                  <span className="text-sm text-gray-600">
                    R$ {custom.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center justify-between">
            <span className="font-medium">Quantidade:</span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button 
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            onClick={handleAddToCart}
          >
            Adicionar ao carrinho - R$ {getTotalPrice().toFixed(2)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
