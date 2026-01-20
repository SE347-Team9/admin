import { io, Socket } from 'socket.io-client';
import { toast } from 'react-toastify';

const SOCKET_URL = 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(userId: string, role: string) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
      this.reconnectAttempts = 0;
      
      // Join role and user rooms
      this.socket?.emit('join', { userId, role });
      
      toast.success('Đã kết nối real-time', { autoClose: 2000 });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Server disconnected, need to reconnect manually
        this.socket?.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        toast.error('Không thể kết nối real-time. Vui lòng tải lại trang.', {
          autoClose: false,
        });
      }
    });

    // Setup event listeners
    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Distribution events
    this.socket.on('distribution:created', (data) => {
      console.log('Distribution created:', data);
      toast.info(`📦 ${data.message}: ${data.code}`, { autoClose: 5000 });
      window.dispatchEvent(new CustomEvent('distribution:created', { detail: data }));
    });

    this.socket.on('distribution:approved', (data) => {
      console.log('Distribution approved:', data);
      toast.success(`✅ ${data.message}: ${data.code}`, { autoClose: 5000 });
      window.dispatchEvent(new CustomEvent('distribution:approved', { detail: data }));
    });

    this.socket.on('distribution:cancelled', (data) => {
      console.log('Distribution cancelled:', data);
      toast.warning(`❌ ${data.message}: ${data.code}`, { autoClose: 5000 });
      window.dispatchEvent(new CustomEvent('distribution:cancelled', { detail: data }));
    });

    // Payment events
    this.socket.on('payment:created', (data) => {
      console.log('Payment created:', data);
      toast.info(`💰 ${data.message}: ${data.code}`, { autoClose: 5000 });
      window.dispatchEvent(new CustomEvent('payment:created', { detail: data }));
    });

    this.socket.on('payment:confirmed', (data) => {
      console.log('Payment confirmed:', data);
      toast.success(`✅ ${data.message}: ${data.code}`, { autoClose: 5000 });
      window.dispatchEvent(new CustomEvent('payment:confirmed', { detail: data }));
    });

    // Import events
    this.socket.on('import:created', (data) => {
      console.log('Import created:', data);
      toast.info(`📥 ${data.message}: ${data.code}`, { autoClose: 5000 });
      window.dispatchEvent(new CustomEvent('import:created', { detail: data }));
    });

    this.socket.on('import:confirmed', (data) => {
      console.log('Import confirmed:', data);
      toast.success(`✅ ${data.message}: ${data.code}`, { autoClose: 5000 });
      window.dispatchEvent(new CustomEvent('import:confirmed', { detail: data }));
    });

    // Agency debt events
    this.socket.on('agency:debt_changed', (data) => {
      console.log('Agency debt changed:', data);
      toast.info(`💳 ${data.message}`, { autoClose: 5000 });
      window.dispatchEvent(new CustomEvent('agency:debt_changed', { detail: data }));
    });

    // Account events
    this.socket.on('account:created', (data) => {
      console.log('Account created:', data);
      toast.info(`👤 ${data.message}`, { autoClose: 5000 });
      window.dispatchEvent(new CustomEvent('account:created', { detail: data }));
    });

    // Agency events
    this.socket.on('agency:created', (data) => {
      console.log('Agency created:', data);
      toast.info(`🏢 ${data.message}`, { autoClose: 5000 });
      window.dispatchEvent(new CustomEvent('agency:created', { detail: data }));
    });

    // Product events
    this.socket.on('product:created', (data) => {
      console.log('Product created:', data);
      toast.info(`📦 ${data.message}`, { autoClose: 5000 });
      window.dispatchEvent(new CustomEvent('product:created', { detail: data }));
    });

    this.socket.on('product:stock_changed', (data) => {
      console.log('Product stock changed:', data);
      toast.info(`📊 ${data.message}`, { autoClose: 3000 });
      window.dispatchEvent(new CustomEvent('product:stock_changed', { detail: data }));
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('Socket disconnected manually');
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  // Listen to specific event
  on(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback);
  }

  // Remove listener
  off(event: string, callback?: (data: any) => void) {
    if (callback) {
      this.socket?.off(event, callback);
    } else {
      this.socket?.off(event);
    }
  }

  // Emit event to server
  emit(event: string, data: any) {
    this.socket?.emit(event, data);
  }
}

export const socketService = new SocketService();
export default socketService;
