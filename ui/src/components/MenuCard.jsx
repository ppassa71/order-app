import { useState } from 'react';
import './MenuCard.css';

function MenuCard({ menu, onAddToCart }) {
  const [addShot, setAddShot] = useState(false);
  const [addSyrup, setAddSyrup] = useState(false);

  const handleAddToCart = () => {
    onAddToCart({
      menuId: menu.id,
      menuName: menu.name,
      basePrice: menu.price,
      options: {
        addShot,
        addSyrup
      },
      quantity: 1,
      totalPrice: menu.price + (addShot ? 500 : 0)
    });
    
    // 옵션 초기화
    setAddShot(false);
    setAddSyrup(false);
  };

  const displayPrice = menu.price + (addShot ? 500 : 0);

  return (
    <div className="menu-card">
      <div className="menu-image">
        <div className="image-placeholder">이미지</div>
      </div>
      <div className="menu-info">
        <h3 className="menu-name">{menu.name}</h3>
        <p className="menu-price">{displayPrice.toLocaleString()}원</p>
        <p className="menu-description">{menu.description}</p>
        <div className="menu-options">
          <label className="option-checkbox">
            <input
              type="checkbox"
              checked={addShot}
              onChange={(e) => setAddShot(e.target.checked)}
            />
            <span>샷 추가 (+500원)</span>
          </label>
          <label className="option-checkbox">
            <input
              type="checkbox"
              checked={addSyrup}
              onChange={(e) => setAddSyrup(e.target.checked)}
            />
            <span>시럽 추가 (+0원)</span>
          </label>
        </div>
        <button className="add-to-cart-button" onClick={handleAddToCart}>
          담기
        </button>
      </div>
    </div>
  );
}

export default MenuCard;

