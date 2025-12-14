import './Dashboard.css';

function Dashboard({ stats }) {
  const statItems = [
    { label: '총 주문', value: stats.totalOrders, color: '#2563eb' },
    { label: '주문 접수', value: stats.receivedOrders, color: '#f59e0b' },
    { label: '제조 중', value: stats.inProgressOrders, color: '#8b5cf6' },
    { label: '제조 완료', value: stats.completedOrders, color: '#10b981' }
  ];

  return (
    <section className="dashboard-section">
      <h2 className="section-title">관리자 대시보드</h2>
      <div className="dashboard-stats">
        {statItems.map((item, index) => (
          <div key={index} className="stat-card">
            <div className="stat-label">{item.label}</div>
            <div className="stat-value" style={{ color: item.color }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Dashboard;

