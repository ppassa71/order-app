import './InventoryStatus.css';

function InventoryStatus({ inventory, onInventoryChange }) {
  const getStockStatus = (stock) => {
    if (stock === 0) return { text: '품절', className: 'status-out' };
    if (stock < 5) return { text: '주의', className: 'status-warning' };
    return { text: '정상', className: 'status-normal' };
  };

  return (
    <section className="inventory-section">
      <h2 className="section-title">재고 현황</h2>
      <div className="inventory-grid">
        {inventory.map((item) => {
          const status = getStockStatus(item.stock);
          return (
            <div key={item.menuId} className="inventory-card">
              <div className="inventory-info">
                <h3 className="inventory-menu-name">{item.menuName}</h3>
                <div className="inventory-details">
                  <span className="inventory-stock">{item.stock}개</span>
                  <span className={`inventory-status ${status.className}`}>
                    {status.text}
                  </span>
                </div>
              </div>
              <div className="inventory-controls">
                <button
                  className="inventory-button decrease"
                  onClick={() => onInventoryChange(item.menuId, -1)}
                  aria-label="재고 감소"
                >
                  -
                </button>
                <button
                  className="inventory-button increase"
                  onClick={() => onInventoryChange(item.menuId, 1)}
                  aria-label="재고 증가"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default InventoryStatus;

