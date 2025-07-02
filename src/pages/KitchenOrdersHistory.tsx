
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Order {
  id: string;
  customerName: string;
  date: string;
  time: string;
  status: string;
  total: number;
  discount: number;
}

const KitchenOrdersHistory = () => {
  const navigate = useNavigate();

  const [orders] = useState<Order[]>([
    { id: "PROD001", customerName: "João", date: "07/08/2025", time: "17:21", status: "Em preparação", total: 7.00, discount: 0.00 },
    { id: "PROD002", customerName: "Timna", date: "07/08/2025", time: "17:22", status: "Em preparação", total: 12.00, discount: 12.00 },
    { id: "PROD003", customerName: "Zé Bentinho da Silva", date: "07/08/2025", time: "18:20", status: "Cancelado", total: 9.00, discount: 9.00 },
    { id: "PROD004", customerName: "Marlene", date: "04/08/2025", time: "16:00", status: "Entregue", total: 8.50, discount: 8.50 },
    { id: "PROD005", customerName: "Bruce Wave", date: "04/08/2025", time: "10:00", status: "Entregue", total: 6.00, discount: 6.00 },
    { id: "PROD006", customerName: "Gugu Liberato", date: "04/08/2025", time: "08:30", status: "Cancelado", total: 7.00, discount: 7.00 }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em preparação":
        return "bg-blue-100 text-blue-800";
      case "Entregue":
        return "bg-green-100 text-green-800";
      case "Cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/kitchen")}
            className="border-orange-300 text-orange-700 hover:bg-orange-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-orange-800">Histórico de Pedidos</h1>
            <p className="text-orange-600">Visualize todos os pedidos realizados</p>
          </div>
        </div>

        {/* Orders History Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-orange-800">
              Jornada de cada cliente 🧑‍🍳
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Status do pedido</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Desconto</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.time}</TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>R$ {order.total.toFixed(2)}</TableCell>
                    <TableCell>R$ {order.discount.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KitchenOrdersHistory;
