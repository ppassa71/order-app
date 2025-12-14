import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import InventoryStatus from '../components/InventoryStatus';
import OrderStatus from '../components/OrderStatus';
import { menuAPI, orderAPI } from '../services/api';
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
  const [inventory, setInventory] = useState([]);

  // 주문 목록 상태
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  // 데이터 로드 함수
  const loadData = async () => {
    try {
      setLoading(true);
      
      // 재고 조회
      const stockData = await menuAPI.getStock();
      // 필드명 정규화 (대소문자 문제 대응)
      const normalizedStock = stockData.map(item => ({
        menuId: item.menuId || item.menuid || item.id,
        menuName: item.menuName || item.menuname || item.name,
        stock: item.stock || 0
      }));
      console.log('재고 데이터 로드:', normalizedStock);
      setInventory(normalizedStock);

      // 주문 목록 조회
      const ordersData = await orderAPI.getOrders();
      const formattedOrders = ordersData.map(order => ({
        orderId: order.id,
        orderTime: new Date(order.orderTime),
        items: order.items,
        totalAmount: order.totalAmount,
        status: order.status
      }));
      setOrders(formattedOrders);

      // 통계 조회
      const stats = await orderAPI.getStatistics();
      setDashboardStats({
        totalOrders: stats.totalOrders,
        receivedOrders: stats.receivedOrders,
        inProgressOrders: stats.inProgressOrders,
        completedOrders: stats.completedOrders
      });
    } catch (error) {
      console.error('데이터 로드 실패:', error);
      alert('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    loadData();
    
    // 주기적으로 데이터 갱신 (30초마다)
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  // 재고 업데이트 함수
  const handleInventoryChange = async (menuId, change) => {
    try {
      // menuId 검증
      if (menuId === undefined || menuId === null) {
        console.error('menuId가 전달되지 않았습니다:', menuId);
        alert('메뉴 ID가 유효하지 않습니다.');
        return;
      }

      // menuId와 change 값을 명시적으로 숫자로 변환
      const menuIdNum = Number(menuId);
      const changeNum = Number(change);

      if (isNaN(menuIdNum) || menuIdNum <= 0) {
        console.error('유효하지 않은 menuId:', menuId, '->', menuIdNum);
        alert('유효하지 않은 메뉴 ID입니다.');
        return;
      }

      if (isNaN(changeNum)) {
        console.error('유효하지 않은 change 값:', change, '->', changeNum);
        alert('유효하지 않은 재고 변경 값입니다.');
        return;
      }

      console.log('재고 업데이트 요청:', { menuId: menuIdNum, change: changeNum });
      const updated = await menuAPI.updateStock(menuIdNum, changeNum);
      console.log('재고 업데이트 성공:', updated);

      setInventory(prevInventory => 
        prevInventory.map(item => 
          item.menuId === menuIdNum 
            ? { ...item, stock: updated.stock }
            : item
        )
      );
    } catch (error) {
      console.error('재고 업데이트 실패:', error);
      alert(`재고 업데이트 실패: ${error.message}`);
    }
  };

  // 주문 상태 업데이트 함수
  const handleOrderStatusChange = async (orderId, currentStatus) => {
    try {
      // 상태 변경 순서: 주문 접수 -> 제조 중 -> 완료
      let newStatus;
      if (currentStatus === '주문 접수') {
        newStatus = '제조 중';
      } else if (currentStatus === '제조 중') {
        newStatus = '완료';
      } else {
        return; // 완료 상태는 변경 불가
      }

      await orderAPI.updateOrderStatus(orderId, newStatus);
      
      // 로컬 상태 업데이트
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.orderId === orderId 
            ? { ...order, status: newStatus }
            : order
        )
      );

      // 통계 다시 로드
      const stats = await orderAPI.getStatistics();
      setDashboardStats({
        totalOrders: stats.totalOrders,
        receivedOrders: stats.receivedOrders,
        inProgressOrders: stats.inProgressOrders,
        completedOrders: stats.completedOrders
      });
    } catch (error) {
      console.error('주문 상태 업데이트 실패:', error);
      alert(`주문 상태 업데이트 실패: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <Header currentPage="admin" onNavigate={onNavigate} />
        <main className="admin-content">
          <div style={{ padding: '2rem', textAlign: 'center' }}>데이터를 불러오는 중...</div>
        </main>
      </div>
    );
  }

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

