import { useState } from 'react';
import './MenuCard.css';

function MenuCard({ menu, onAddToCart }) {
  const [addShot, setAddShot] = useState(false);
  const [addSyrup, setAddSyrup] = useState(false);

  // 옵션별 가격 계산 헬퍼 함수
  const calculatePrice = (basePrice, options) => {
    let price = basePrice;
    if (options.addShot) price += 500;
    if (options.addSyrup) price += 0; // 현재 시럽 추가는 무료
    return price;
  };

  // 이미지 경로 가져오기 함수
  const getImageSrc = () => {
    // menu.imageUrl이 있으면 사용
    if (menu.imageUrl && menu.imageUrl.trim() !== '') {
      return menu.imageUrl;
    }

    // 메뉴 ID로 이미지 파일 찾기 (public/images 폴더에서)
    // 파일명 형식: menu-{id}.svg, menu-{id}.jpg, menu-{id}.png 등
    // SVG를 우선 시도 (생성된 플레이스홀더 이미지)
    const extensions = ['svg', 'jpg', 'jpeg', 'png', 'webp'];
    for (const ext of extensions) {
      const imagePath = `/images/menu-${menu.id}.${ext}`;
      // 실제 파일 존재 여부는 브라우저에서 확인 (onError로 처리)
      return imagePath;
    }
    
    return null;
  };

  const handleAddToCart = () => {
    const options = { addShot, addSyrup };
    const totalPrice = calculatePrice(menu.price, options);
    
    onAddToCart({
      menuId: menu.id,
      menuName: menu.name,
      basePrice: menu.price,
      options,
      quantity: 1,
      totalPrice
    });
    
    // 옵션 초기화
    setAddShot(false);
    setAddSyrup(false);
  };

  const displayPrice = calculatePrice(menu.price, { addShot, addSyrup });
  const imageSrc = getImageSrc();

  return (
    <div className="menu-card">
      <div className="menu-image">
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={menu.name}
            className="menu-image-img"
            onError={(e) => {
              // 이미지 로드 실패 시 플레이스홀더 표시
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`image-placeholder ${imageSrc ? 'hidden' : ''}`}>
          {imageSrc ? '' : '이미지'}
        </div>
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

