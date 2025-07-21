import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ordersAPI } from "@/services/api";

interface OrderItem {
  id: string;
  date: string;
  items: {
    name: string;
    quantity: number;
    customizations: string[];
    price: number;
  }[];
  total: number;
  status: "entregue" | "preparando" | "cancelado";
}

const History = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Buscando pedidos para usuário:", user?.id);
        const response = await ordersAPI.getByClientId(user.id);
        console.log("Resposta completa do backend:", response);
        console.log("Tipo da resposta:", typeof response);
        console.log("É array?", Array.isArray(response));
        
        // Verifica diferentes estruturas possíveis da resposta
        let pedidosArray = [];
        
        if (Array.isArray(response)) {
          pedidosArray = response;
        } else if (response && Array.isArray(response.pedidos)) {
          pedidosArray = response.pedidos;
        } else if (response && Array.isArray(response.data)) {
          pedidosArray = response.data;
        } else if (response && response.results && Array.isArray(response.results)) {
          pedidosArray = response.results;
        } else {
          console.warn("Estrutura de resposta não reconhecida:", response);
          setOrders([]);
          return;
        }
        
        console.log("Array de pedidos extraído:", pedidosArray);
        console.log("Quantidade de pedidos:", pedidosArray.length);
        
        if (pedidosArray.length === 0) {
          console.log("Nenhum pedido encontrado");
          setOrders([]);
          return;
        }
        
        // Mapeia os dados do backend para o formato esperado
        const formattedOrders = pedidosArray.map((order: any, index: number) => {
          // Mapeia os itens do pedido
          const items = Array.isArray(order.itens)
            ? order.itens.map((item: any, itemIndex: number) => ({
                name: item.bebida || `Item ${itemIndex + 1}`,
                quantity: item.quantidade ? parseInt(item.quantidade) : 1,
                customizations: Array.isArray(item.ingredientes) ? item.ingredientes : [],
                price: item.preco ? parseFloat(item.preco) : 0
              }))
            : [];

          return {
            id: order.id?.toString() || `pedido-${index}`,
            date: order.data_hora || order.data_criacao || order.created_at || order.date || new Date().toISOString(),
            items,
            total: parseFloat(order.valor_total || order.total || order.preco_total || "0"),
            status: (order.status?.toLowerCase() || "preparando") as "entregue" | "preparando" | "cancelado"
          };
        });

        console.log("Pedidos formatados:", formattedOrders);
        setOrders(formattedOrders);
      } catch (err) {
        console.error("Erro detalhado ao buscar pedidos:", err);
        setError(`Erro ao carregar histórico: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchOrders();
    } else {
      setLoading(false);
      setError("Usuário não encontrado. Faça login novamente.");
    }
  }, [user?.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "entregue":
        return "bg-green-100 text-green-800";
      case "preparando":
        return "bg-yellow-100 text-yellow-800";
      case "cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-orange-800">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-orange-800">Histórico de Pedidos</h1>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-orange-200 to-yellow-200 rounded-lg p-6 mb-8 text-center">
          <div className="text-4xl mb-2">👩🏽‍🍳</div>
          <h2 className="text-2xl font-bold text-orange-800 mb-1">
            O tradicional bem feito
          </h2>
          <p className="text-orange-700">
            com muito carinho 🧡
          </p>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-orange-800">
            Total de Pedidos: {orders.length}
          </h3>
          
          <h3 className="text-xl font-bold text-orange-800">
            Esse é o seu Histórico com a gente 😊
          </h3>

          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-600">Você ainda não fez nenhum pedido conosco.</p>
              <Button 
                onClick={() => navigate("/")} 
                className="mt-4 bg-orange-600 hover:bg-orange-700"
              >
                Fazer primeiro pedido
              </Button>
            </div>
          ) : (
            // Tabela de pedidos
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-yellow-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Pedido</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Data</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Quantidade</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Total</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <div key={index} className="text-sm">
                                <p className="font-medium">{item.name}</p>
                                {item.customizations.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {item.customizations.map((custom, i) => (
                                      <Badge key={i} variant="secondary" className="text-xs">
                                        {custom}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(order.date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          R$ {order.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={`${getStatusColor(order.status)} border-0`}>
                            {order.status.toUpperCase()}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
