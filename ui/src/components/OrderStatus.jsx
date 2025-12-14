import './OrderStatus.css';

function OrderStatus({ orders, onOrderStatusChange }) {
  const formatOrderTime = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}월 ${day}일 ${hours}:${minutes}`;
  };

  const formatOrderItems = (items) => {
    return items.map(item => `${item.menuName} x ${item.quantity}`).join(', ');
  };

  return (
    <section className="order-status-section">
      <h2 className="section-title">주문 현황</h2>
      <div className="order-list">
        {orders.length === 0 ? (
          <p className="order-empty">주문이 없습니다.</p>
        ) : (
          orders.map((order) => (
            <div key={order.orderId} className="order-card">
              <div className="order-info">
                <div className="order-time">{formatOrderTime(order.orderTime)}</div>
                <div className="order-items">{formatOrderItems(order.items)}</div>
                <div className="order-amount">{order.totalAmount.toLocaleString()}원</div>
              </div>
              <div className="order-actions">
                {order.status === '주문 접수' && (
                  <button
                    className="order-action-button start"
                    onClick={() => onOrderStatusChange(order.orderId, '제조 중')}
                  >
                    제조 시작
                  </button>
                )}
                {order.status === '제조 중' && (
                  <button
                    className="order-action-button complete"
                    onClick={() => onOrderStatusChange(order.orderId, '제조 완료')}
                  >
                    제조 완료
                  </button>
                )}
                {order.status === '제조 완료' && (
                  <span className="order-status-badge">완료</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default OrderStatus;

