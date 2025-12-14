import { useState } from 'react';
import Header from '../components/Header';
import MenuCard from '../components/MenuCard';
import Cart from '../components/Cart';
import './OrderPage.css';

// 임시 메뉴 데이터 (나중에 API에서 가져올 예정)
const mockMenus = [
  {
    id: 1,
    name: '아메리카노(ICE)',
    price: 4000,
    description: '에스프레소에 물을 넣어 만든 시원한 아메리카노',
    imageUrl: ''
  },
  {
    id: 2,
    name: '아메리카노(HOT)',
    price: 4000,
    description: '에스프레소에 물을 넣어 만든 따뜻한 아메리카노',
    imageUrl: ''
  },
  {
    id: 3,
    name: '카페라떼',
    price: 5000,
    description: '에스프레소와 스팀 밀크가 만나 부드러운 맛',
    imageUrl: ''
  },
  {
    id: 4,
    name: '카푸치노',
    price: 5000,
    description: '에스프레소와 우유 거품이 어우러진 클래식 커피',
    imageUrl: ''
  },
  {
    id: 5,
    name: '카라멜 마키아토',
    price: 5500,
    description: '카라멜 시럽이 들어간 달콤한 커피',
    imageUrl: ''
  },
  {
    id: 6,
    name: '바닐라 라떼',
    price: 5500,
    description: '바닐라 시럽이 들어간 부드러운 라떼',
    imageUrl: ''
  },
  {
    id: 7,
    name: '카페모카',
    price: 5500,
    description: '초콜릿과 커피가 만나 달콤 쌉쌀한 맛',
    imageUrl: ''
  },
  {
    id: 8,
    name: '콜드브루',
    price: 4500,
    description: '차가운 물로 우려낸 깔끔한 커피',
    imageUrl: ''
  }
];

function OrderPage({ onNavigate }) {
  const [cartItems, setCartItems] = useState([]);

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

  const handleOrder = () => {
    if (cartItems.length === 0) return;

    const totalAmount = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const orderData = {
      items: cartItems,
      totalAmount
    };

    // TODO: 서버로 주문 데이터 전송
    console.log('주문 데이터:', orderData);
    alert(`주문이 완료되었습니다!\n총 금액: ${totalAmount.toLocaleString()}원`);
    
    // 장바구니 초기화
    setCartItems([]);
  };

  return (
    <div className="order-page">
      <Header currentPage="order" onNavigate={onNavigate} />
      <main className="order-content">
        <section className="menu-section">
          <div className="menu-grid">
            {mockMenus.map((menu) => (
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

