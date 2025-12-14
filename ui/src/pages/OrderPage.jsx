import { useState, useEffect } from 'react';
import Header from '../components/Header';
import MenuCard from '../components/MenuCard';
import Cart from '../components/Cart';
import { menuAPI, orderAPI } from '../services/api';
import './OrderPage.css';

function OrderPage({ onNavigate }) {
  const [menus, setMenus] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 메뉴 목록 로드
  useEffect(() => {
    const loadMenus = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('메뉴 목록 로드 시작...');
        const menuList = await menuAPI.getMenus();
        console.log('메뉴 목록 로드 성공:', menuList.length, '개');
        setMenus(menuList);
      } catch (err) {
        console.error('메뉴 로드 실패:', err);
        const errorMessage = err.message || '메뉴를 불러오는데 실패했습니다.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadMenus();
  }, []);

  // 옵션별 가격 계산 헬퍼 함수
  const calculateUnitPrice = (basePrice, options) => {
    let price = basePrice;
    if (options.addShot) price += 500;
    if (options.addSyrup) price += 0; // 현재 시럽 추가는 무료
    return price;
  };

  const handleAddToCart = (item) => {
    // 동일한 메뉴와 옵션 조합이 있는지 확인
    const existingItemIndex = cartItems.findIndex(
      (cartItem) =>
        cartItem.menuId === item.menuId &&
        cartItem.options.addShot === item.options.addShot &&
        cartItem.options.addSyrup === item.options.addSyrup
    );

    if (existingItemIndex !== -1) {
      // 기존 아이템의 수량 증가
      const updatedItems = [...cartItems];
      const unitPrice = calculateUnitPrice(item.basePrice, item.options);
      updatedItems[existingItemIndex].quantity += 1;
      updatedItems[existingItemIndex].totalPrice += unitPrice;
      setCartItems(updatedItems);
    } else {
      // 새 아이템 추가
      setCartItems([...cartItems, item]);
    }
  };

  const handleIncreaseQuantity = (index) => {
    const updatedItems = [...cartItems];
    const item = updatedItems[index];
    const unitPrice = calculateUnitPrice(item.basePrice, item.options);
    updatedItems[index].quantity += 1;
    updatedItems[index].totalPrice += unitPrice;
    setCartItems(updatedItems);
  };

  const handleDecreaseQuantity = (index) => {
    const updatedItems = [...cartItems];
    const item = updatedItems[index];
    const unitPrice = calculateUnitPrice(item.basePrice, item.options);
    
    if (item.quantity > 1) {
      updatedItems[index].quantity -= 1;
      updatedItems[index].totalPrice -= unitPrice;
      setCartItems(updatedItems);
    } else {
      // 수량이 1이면 삭제
      handleRemoveItem(index);
    }
  };

  const handleRemoveItem = (index) => {
    const updatedItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedItems);
  };

  const handleOrder = async () => {
    if (cartItems.length === 0) return;

    const totalAmount = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    // API 요청 형식에 맞게 데이터 변환
    const orderData = {
      items: cartItems.map(item => ({
        menuId: item.menuId,
        menuName: item.menuName,
        quantity: item.quantity,
        options: item.options,
        itemPrice: item.totalPrice / item.quantity, // 단가
        totalPrice: item.totalPrice
      })),
      totalAmount
    };

    try {
      const result = await orderAPI.createOrder(orderData);
      alert(`주문이 완료되었습니다!\n주문번호: ${result.id}\n총 금액: ${totalAmount.toLocaleString()}원`);
      
      // 장바구니 초기화
      setCartItems([]);
    } catch (err) {
      console.error('주문 실패:', err);
      alert(`주문 실패: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="order-page">
        <Header currentPage="order" onNavigate={onNavigate} />
        <main className="order-content">
          <div style={{ padding: '2rem', textAlign: 'center' }}>메뉴를 불러오는 중...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-page">
        <Header currentPage="order" onNavigate={onNavigate} />
        <main className="order-content">
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ color: 'red', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
              {error}
            </div>
            <div style={{ color: '#666', fontSize: '0.9rem', marginTop: '1rem' }}>
              <p>확인 사항:</p>
              <ul style={{ textAlign: 'left', display: 'inline-block', marginTop: '0.5rem' }}>
                <li>백엔드 서버가 실행 중인지 확인하세요 (포트 3000)</li>
                <li>데이터베이스가 실행 중이고 연결되어 있는지 확인하세요</li>
                <li>브라우저 콘솔에서 자세한 오류 메시지를 확인하세요</li>
              </ul>
              <button 
                onClick={() => window.location.reload()} 
                style={{ 
                  marginTop: '1rem', 
                  padding: '0.5rem 1rem', 
                  backgroundColor: '#2d5016', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                새로고침
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="order-page">
      <Header currentPage="order" onNavigate={onNavigate} />
      <main className="order-content">
        <section className="menu-section">
          <div className="menu-grid">
            {menus.map((menu) => (
              <MenuCard
                key={menu.id}
                menu={menu}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </section>
        <section className="cart-section">
          <Cart 
            items={cartItems} 
            onOrder={handleOrder}
            onIncreaseQuantity={handleIncreaseQuantity}
            onDecreaseQuantity={handleDecreaseQuantity}
            onRemoveItem={handleRemoveItem}
          />
        </section>
      </main>
    </div>
  );
}

export default OrderPage;

