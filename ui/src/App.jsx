import { useState } from 'react'
import OrderPage from './pages/OrderPage'
import AdminPage from './pages/AdminPage'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('order')

  const handleNavigate = (page) => {
    setCurrentPage(page)
  }

  return (
    <div className="app">
      {currentPage === 'order' && <OrderPage onNavigate={handleNavigate} />}
      {currentPage === 'admin' && <AdminPage onNavigate={handleNavigate} />}
    </div>
  )
}

export default App
