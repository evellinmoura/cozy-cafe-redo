import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, CheckCircle, XCircle, Coffee, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ordersAPI } from "@/services/api"; // Ajuste o caminho conforme necessário

interface LiveOrder {
  id: string;
  customerName: string;
  items: string[];
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled";
  orderTime: string;
  estimatedTime: number;
}

const KitchenDashboard = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveOrders, setLiveOrders] = useState<LiveOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});

  // Função para buscar todos os pedidos
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await ordersAPI.getAll();
      
      // Transformar os dados da API para o formato esperado pelo componente
      const formattedOrders = response.map((order: any) => ({
        id: order.id.toString(),
        customerName: order.customer?.name || "Cliente não identificado",
        items: order.items.map((item: any) => item.name || "Item sem nome"),
        status: mapStatus(order.status),
        orderTime: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        estimatedTime: calculateEstimatedTime(order.items)
      }));
      
      setLiveOrders(formattedOrders);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
      setError("Não foi possível carregar os pedidos. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  // Função para mapear o status da API para o status do componente
  const mapStatus = (apiStatus: string): LiveOrder["status"] => {
    switch (apiStatus.toLowerCase()) {
      case "pending": return "pending";
      case "preparing": return "preparing";
      case "ready": return "ready";
      case "delivered": return "delivered";
      case "cancelled": return "cancelled";
      default: return "pending";
    }
  };

  // Função para calcular tempo estimado baseado nos itens
  const calculateEstimatedTime = (items: any[]): number => {
    // Lógica simplificada - 3 minutos para bebidas, 5 minutos para alimentos
    return items.reduce((total, item) => {
      return total + (item.type === 'beverage' ? 3 : 5);
    }, 0);
  };

  // Função para avançar o status do pedido
  const advanceOrderStatus = async (orderId: string) => {
    try {
      setIsUpdating(prev => ({ ...prev, [orderId]: true }));
      await ordersAPI.advanceStatus(orderId);
      await fetchOrders(); // Recarregar os pedidos para garantir sincronização
    } catch (err) {
      console.error("Erro ao avançar status do pedido:", err);
      setError("Não foi possível atualizar o status do pedido.");
    } finally {
      setIsUpdating(prev => ({ ...prev, [orderId]: false }));
    }
  };

  // Função para cancelar um pedido
  const cancelOrder = async (orderId: string) => {
    try {
      setIsUpdating(prev => ({ ...prev, [orderId]: true }));
      await ordersAPI.cancelOrder(orderId);
      setLiveOrders(orders => orders.filter(order => order.id !== orderId));
    } catch (err) {
      console.error("Erro ao cancelar pedido:", err);
      setError("Não foi possível cancelar o pedido.");
    } finally {
      setIsUpdating(prev => ({ ...prev, [orderId]: false }));
    }
  };

  // Função para preparar uma bebida específica
  const prepareBeverage = async (orderId: string, beverageName: string) => {
    try {
      setIsUpdating(prev => ({ ...prev, [orderId]: true }));
      await ordersAPI.prepareBeverage({
        orderId,
        beverageName
      });
      await fetchOrders(); // Recarregar os pedidos após preparo
    } catch (err) {
      console.error("Erro ao preparar bebida:", err);
      setError("Não foi possível iniciar o preparo da bebida.");
    } finally {
      setIsUpdating(prev => ({ ...prev, [orderId]: false }));
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Buscar pedidos inicialmente e a cada 30 segundos
    fetchOrders();
    const refreshInterval = setInterval(fetchOrders, 30000);

    return () => {
      clearInterval(timer);
      clearInterval(refreshInterval);
    };
  }, []);

  const getStatusColor = (status: LiveOrder["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      case "preparing":
        return "bg-blue-100 border-blue-300 text-blue-800";
      case "ready":
        return "bg-green-100 border-green-300 text-green-800";
      case "delivered":
        return "bg-gray-100 border-gray-300 text-gray-800";
      case "cancelled":
        return "bg-red-100 border-red-300 text-red-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  const getStatusIcon = (status: LiveOrder["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5" />;
      case "preparing":
        return <Coffee className="h-5 w-5" />;
      case "ready":
        return <CheckCircle className="h-5 w-5" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5" />;
      case "cancelled":
        return <XCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusText = (status: LiveOrder["status"]) => {
    switch (status) {
      case "pending":
        return "Aguardando";
      case "preparing":
        return "Preparando";
      case "ready":
        return "Pronto";
      case "delivered":
        return "Entregue";
      case "cancelled":
        return "Cancelado";
      default:
        return "Aguardando";
    }
  };

  const pendingOrders = liveOrders.filter(order => order.status === "pending");
  const preparingOrders = liveOrders.filter(order => order.status === "preparing");
  const readyOrders = liveOrders.filter(order => order.status === "ready");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-orange-800 text-xl">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 text-xl">{error}</p>
          <Button 
            onClick={fetchOrders}
            className="mt-4 bg-orange-500 hover:bg-orange-600"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/kitchen")}
              className="border-orange-300 text-orange-700 hover:bg-orange-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-orange-800">Dashboard da Cozinha</h1>
              <p className="text-orange-600">Pedidos em tempo real</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-800">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="text-orange-600">
              {currentTime.toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-800">{pendingOrders.length}</p>
                  <p className="text-sm text-yellow-600">Aguardando</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Coffee className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-800">{preparingOrders.length}</p>
                  <p className="text-sm text-blue-600">Preparando</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-800">{readyOrders.length}</p>
                  <p className="text-sm text-green-600">Prontos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-8 w-8 text-gray-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-800">{liveOrders.length}</p>
                  <p className="text-sm text-gray-600">Total Hoje</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-yellow-800 flex items-center gap-2">
                <Clock className="h-6 w-6" />
                Aguardando ({pendingOrders.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingOrders.map((order) => (
                <div
                  key={order.id}
                  className={`p-4 rounded-lg border-2 ${getStatusColor(order.status)}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold">{order.customerName}</h3>
                    <span className="text-sm">{order.orderTime}</span>
                  </div>
                  <div className="space-y-1 mb-3">
                    {order.items.map((item, index) => (
                      <p key={index} className="text-sm">• {item}</p>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => advanceOrderStatus(order.id)}
                    disabled={isUpdating[order.id]}
                    className="w-full bg-blue-500 hover:bg-blue-600"
                  >
                    {isUpdating[order.id] ? (
                      <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                    ) : (
                      "Começar Preparo"
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => cancelOrder(order.id)}
                    disabled={isUpdating[order.id]}
                    className="w-full mt-2 border-red-500 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancelar Pedido
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Preparing Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-blue-800 flex items-center gap-2">
                <Coffee className="h-6 w-6" />
                Preparando ({preparingOrders.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {preparingOrders.map((order) => (
                <div
                  key={order.id}
                  className={`p-4 rounded-lg border-2 ${getStatusColor(order.status)}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold">{order.customerName}</h3>
                    <span className="text-sm">{order.orderTime}</span>
                  </div>
                  <div className="space-y-1 mb-3">
                    {order.items.map((item, index) => (
                      <p key={index} className="text-sm">• {item}</p>
                    ))}
                  </div>
                  <div className="text-sm mb-3">
                    ⏱️ Tempo estimado: {order.estimatedTime} min
                  </div>
                  <Button
                    size="sm"
                    onClick={() => advanceOrderStatus(order.id)}
                    disabled={isUpdating[order.id]}
                    className="w-full bg-green-500 hover:bg-green-600"
                  >
                    {isUpdating[order.id] ? (
                      <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                    ) : (
                      "Marcar como Pronto"
                    )}
                  </Button>
                  {order.items.some(item => item.toLowerCase().includes('café') || item.toLowerCase().includes('bebida')) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => prepareBeverage(order.id, order.items.find(item => 
                        item.toLowerCase().includes('café') || item.toLowerCase().includes('bebida')) || '')}
                      disabled={isUpdating[order.id]}
                      className="w-full mt-2 border-orange-500 text-orange-600 hover:bg-orange-50"
                    >
                      <Coffee className="h-4 w-4 mr-2" />
                      Preparar Bebida
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Ready Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-green-800 flex items-center gap-2">
                <CheckCircle className="h-6 w-6" />
                Prontos ({readyOrders.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {readyOrders.map((order) => (
                <div
                  key={order.id}
                  className={`p-4 rounded-lg border-2 ${getStatusColor(order.status)}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold">{order.customerName}</h3>
                    <span className="text-sm">{order.orderTime}</span>
                  </div>
                  <div className="space-y-1 mb-3">
                    {order.items.map((item, index) => (
                      <p key={index} className="text-sm">• {item}</p>
                    ))}
                  </div>
                  <div className="text-sm mb-3 text-green-700 font-medium">
                    ✅ Pronto para entrega!
                  </div>
                  <Button
                    size="sm"
                    onClick={() => advanceOrderStatus(order.id)}
                    disabled={isUpdating[order.id]}
                    className="w-full bg-gray-500 hover:bg-gray-600"
                  >
                    {isUpdating[order.id] ? (
                      <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                    ) : (
                      "Marcar como Entregue"
                    )}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default KitchenDashboard;