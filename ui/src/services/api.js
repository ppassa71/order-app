/**
 * API 서비스 레이어
 * 백엔드 API와 통신하는 함수들
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * 공통 fetch 함수
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    console.log(`[API] 요청: ${config.method || 'GET'} ${url}`);
    const response = await fetch(url, config);
    
    // 응답이 JSON이 아닐 수 있으므로 확인
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(`서버 응답 오류 (${response.status}): ${text}`);
    }

    if (!response.ok) {
      const errorMessage = data.error || `HTTP ${response.status} 오류`;
      console.error(`[API] 오류 응답:`, errorMessage);
      throw new Error(errorMessage);
    }

    console.log(`[API] 성공: ${url}`);
    return data;
  } catch (error) {
    // 네트워크 오류인지 확인
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error(`[API] 네트워크 오류: 서버에 연결할 수 없습니다. (${url})`);
      throw new Error(`서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요. (${API_BASE_URL})`);
    }
    
    console.error(`[API] 요청 오류 (${url}):`, error);
    throw error;
  }
}

/**
 * 메뉴 API
 */
export const menuAPI = {
  /**
   * 메뉴 목록 조회
   */
  async getMenus() {
    const response = await fetchAPI('/menus');
    return response.data;
  },

  /**
   * 재고 조회
   */
  async getStock() {
    const response = await fetchAPI('/menus/stock');
    return response.data;
  },

  /**
   * 재고 업데이트
   */
  async updateStock(menuId, change) {
    const response = await fetchAPI(`/menus/${menuId}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ change })
    });
    return response.data;
  }
};

/**
 * 주문 API
 */
export const orderAPI = {
  /**
   * 주문 생성
   */
  async createOrder(orderData) {
    const response = await fetchAPI('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
    return response.data;
  },

  /**
   * 주문 조회
   */
  async getOrder(orderId) {
    const response = await fetchAPI(`/orders/${orderId}`);
    return response.data;
  },

  /**
   * 주문 목록 조회
   */
  async getOrders(filters = {}) {
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.offset) queryParams.append('offset', filters.offset);

    const queryString = queryParams.toString();
    const endpoint = `/orders${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetchAPI(endpoint);
    return response.data;
  },

  /**
   * 주문 상태 업데이트
   */
  async updateOrderStatus(orderId, status) {
    const response = await fetchAPI(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    return response.data;
  },

  /**
   * 주문 통계 조회
   */
  async getStatistics() {
    const response = await fetchAPI('/orders/statistics');
    return response.data;
  }
};

