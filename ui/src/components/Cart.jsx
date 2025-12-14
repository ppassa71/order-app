import './Cart.css';

function Cart({ items, onOrder, onIncreaseQuantity, onDecreaseQuantity, onRemoveItem }) {
  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

  const getOptionText = (options) => {
    const optionTexts = [];
    if (options.addShot) optionTexts.push('샷 추가');
    if (options.addSyrup) optionTexts.push('시럽 추가');
    return optionTexts.length > 0 ? ` (${optionTexts.join(', ')})` : '';
  };

  const formatCartItemName = (item) => {
    const optionText = getOptionText(item.options);
    return `${item.menuName}${optionText}`;
  };

  return (
    <div className="cart">
      <h2 className="cart-title">장바구니</h2>
      <div className="cart-content">
        <div className="cart-left">
          <div className="cart-items">
            {items.length === 0 ? (
              <p className="cart-empty">장바구니가 비어있습니다.</p>
            ) : (
              items.map((item, index) => (
                <div key={index} className="cart-item">
                  <div className="cart-item-info">
                    <span className="cart-item-name">
                      {formatCartItemName(item)}
                    </span>
                    <div className="cart-item-controls">
                      <button 
                        className="quantity-button decrease"
                        onClick={() => onDecreaseQuantity(index)}
                        aria-label="수량 감소"
                      >
                        -
                      </button>
                      <span className="cart-item-quantity">{item.quantity}</span>
                      <button 
                        className="quantity-button increase"
                        onClick={() => onIncreaseQuantity(index)}
                        aria-label="수량 증가"
                      >
                        +
                      </button>
                      <button 
                        className="remove-button"
                        onClick={() => onRemoveItem(index)}
                        aria-label="삭제"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  <span className="cart-item-price">{item.totalPrice.toLocaleString()}원</span>
                </div>
              ))
            )}
          </div>
        </div>
        {items.length > 0 && (
          <div className="cart-right">
            <div className="cart-total">
              총 금액 <strong>{totalAmount.toLocaleString()}원</strong>
            </div>
            <button className="order-button" onClick={onOrder}>
              주문하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;

