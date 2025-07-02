
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Trash2 } from "lucide-react";
import { PaymentModal } from "./PaymentModal";

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

interface CartProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateCart: (items: CartItem[]) => void;
}

export const Cart = ({ items, isOpen, onClose, onUpdateCart }: CartProps) => {
  const [showPayment, setShowPayment] = useState(false);

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(index);
      return;
    }
    
    const updatedItems = [...items];
    const item = updatedItems[index];
    const pricePerUnit = item.totalPrice / item.quantity;
    updatedItems[index] = {
      ...item,
      quantity: newQuantity,
      totalPrice: pricePerUnit * newQuantity
    };
    onUpdateCart(updatedItems);
  };

  const removeItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    onUpdateCart(updatedItems);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.totalPrice, 0);
  };

  const handlePaymentComplete = () => {
    alert("Pedido realizado com sucesso! Obrigado pela preferência!");
    onUpdateCart([]);
    setShowPayment(false);
  };

  if (items.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center">Carrinho</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🛒</div>
            <p className="text-gray-600">Seu carrinho está vazio</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-lg mx-auto max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center">O que você está levando 🛒</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Header da tabela */}
            <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-600 border-b pb-2">
              <div className="col-span-4">Item</div>
              <div className="col-span-3">Adicionais</div>
              <div className="col-span-2">Quantidade</div>
              <div className="col-span-2">Preço</div>
              <div className="col-span-1"></div>
            </div>

            {/* Items do carrinho */}
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-start py-3 border-b">
                <div className="col-span-4 flex items-center gap-2">
                  <span className="text-2xl">{item.drink.image}</span>
                  <div>
                    <p className="font-medium text-sm">{item.drink.name}</p>
                  </div>
                </div>
                
                <div className="col-span-3">
                  {item.customizations.length > 0 ? (
                    <div className="space-y-1">
                      {item.customizations.map((custom, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {custom}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">Sem adicionais</span>
                  )}
                </div>
                
                <div className="col-span-2 flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => updateQuantity(index, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => updateQuantity(index, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="col-span-2 text-sm font-medium">
                  R$ {item.totalPrice.toFixed(2)}
                </div>
                
                <div className="col-span-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-500 hover:text-red-700"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}

            <Separator />

            {/* Total */}
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Subtotal</span>
              <span className="text-orange-600">R$ {getTotalPrice().toFixed(2)}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={onClose}
              >
                Continuar comprando
              </Button>
              <Button 
                className="flex-1 bg-orange-500 hover:bg-orange-600"
                onClick={() => setShowPayment(true)}
              >
                Fechar pedido
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Pagamento */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        total={getTotalPrice()}
        onPaymentComplete={handlePaymentComplete}
      />
    </>
  );
};
