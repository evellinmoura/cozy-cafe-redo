// Simulação de endpoints - em produção seria uma API real
const API_BASE_URL = 'https://localhost:8080'; // URL fictícia para exemplo

// Simulador de delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulador de responses HTTP
export class MockApiService {
  private static users: any[] = [];
  private static orders: any[] = [];

  static async simulateGet(endpoint: string): Promise<any> {
    await delay(500); // Simula latência de rede

    switch (endpoint) {
      case '/auth/me':
        const userData = localStorage.getItem('user');
        if (!userData) throw new Error('User not found');
        return { data: JSON.parse(userData) };
      
      case '/orders':
        return { data: this.orders };
      
      default:
        throw new Error('Endpoint not found');
    }
  }

  static async simulatePost(endpoint: string, data: any): Promise<any> {
    await delay(700); // Simula latência de rede

    switch (endpoint) {
      case '/auth/login':
        const user = { ...data, name: "Usuário", id: Date.now() };
        localStorage.setItem('user', JSON.stringify(user));
        return { data: user };
      
      case '/auth/register':
        const newUser = { ...data, isNewUser: true, id: Date.now() };
        localStorage.setItem('user', JSON.stringify(newUser));
        return { data: newUser };
      
      case '/orders':
        const order = {
          id: Date.now().toString(),
          ...data,
          date: new Date().toISOString(),
          status: "Concluído"
        };
        this.orders.unshift(order);
        
        // Também salva no localStorage para manter compatibilidade
        const existingOrders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
        const updatedOrders = [order, ...existingOrders];
        localStorage.setItem('orderHistory', JSON.stringify(updatedOrders));
        
        return { data: order };
      
      default:
        throw new Error('Endpoint not found');
    }
  }

  static async simulateDelete(endpoint: string): Promise<any> {
    await delay(300);

    if (endpoint === '/auth/logout') {
      localStorage.removeItem('user');
      return { data: { message: 'Logout successful' } };
    }

    throw new Error('Endpoint not found');
  }
}

// Função helper para fazer requisições HTTP simuladas
export const apiRequest = async (
  method: 'GET' | 'POST' | 'DELETE',
  endpoint: string,
  data?: any
): Promise<any> => {
  try {
    switch (method) {
      case 'GET':
        return await MockApiService.simulateGet(endpoint);
      case 'POST':
        return await MockApiService.simulatePost(endpoint, data);
      case 'DELETE':
        return await MockApiService.simulateDelete(endpoint);
      default:
        throw new Error('Unsupported method');
    }
  } catch (error) {
    console.error(`API Error on ${method} ${endpoint}:`, error);
    throw error;
  }
};