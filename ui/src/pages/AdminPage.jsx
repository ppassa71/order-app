import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import InventoryStatus from '../components/InventoryStatus';
import OrderStatus from '../components/OrderStatus';
import './AdminPage.css';

function AdminPage({ onNavigate }) {
  // 대시보드 통계 상태
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    receivedOrders: 0,
    inProgressOrders: 0,
    completedOrders: 0
  });

  // 재고 상태
  const [inventory, setInventory] = useState([
    { menuId: 1, menuName: '아메리카노(ICE)', stock: 10 },
    { menuId: 2, menuName: '아메리카노(HOT)', stock: 10 },
    { menuId: 3, menuName: '카페라떼', stock: 10 },
    { menuId: 4, menuName: '카푸치노', stock: 8 },
    { menuId: 5, menuName: '카라멜 마키아토', stock: 5 },
    { menuId: 6, menuName: '바닐라 라떼', stock: 3 },
    { menuId: 7, menuName: '카페모카', stock: 0 },
    { menuId: 8, menuName: '콜드브루', stock: 12 }
  ]);

  // 주문 목록 상태
  const [orders, setOrders] = useState([
    {
      orderId: 1,
      orderTime: new Date('2024-07-31T13:00:00'),
      items: [
        { menuId: 1, menuName: '아메리카노(ICE)', quantity: 1, price: 4000 }
      ],
      totalAmount: 4000,
      status: '주문 접수'
    }
  ]);

  // 재고 업데이트 함수
  const handleInventoryChange = (menuId, change) => {
    setInventory(prevInventory => 
      prevInventory.map(item => 
        item.menuId === menuId 
          ? { ...item, stock: Math.max(0, item.stock + change) }
          : item
      )
    );
  };

  // 주문 상태 업데이트 함수
  const handleOrderStatusChange = (orderId, newStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.orderId === orderId 
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  // 대시보드 통계 업데이트 (orders 변경 시 자동 업데이트)
  useEffect(() => {
    const totalOrders = orders.length;
    const receivedOrders = orders.filter(o => o.status === '주문 접수').length;
    const inProgressOrders = orders.filter(o => o.status === '제조 중').length;
    const completedOrders = orders.filter(o => o.status === '제조 완료').length;

    setDashboardStats({
      totalOrders,
      receivedOrders,
      inProgressOrders,
      completedOrders
    });
  }, [orders]);

  return (
    <div className="admin-page">
      <Header currentPage="admin" onNavigate={onNavigate} />
      <main className="admin-content">
        <Dashboard stats={dashboardStats} />
        <InventoryStatus 
          inventory={inventory} 
          onInventoryChange={handleInventoryChange}
        />
        <OrderStatus 
          orders={orders}
          onOrderStatusChange={handleOrderStatusChange}
        />
      </main>
    </div>
  );
}

export default AdminPage;

