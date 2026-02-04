import axios from 'axios'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request 攔截器
request.interceptors.request.use(
  (config) => {
    // 從 localStorage 取得 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response 攔截器
request.interceptors.response.use(
  (response) => {
    // 直接返回 data
    return response.data
  },
  (error) => {
    const { response } = error

    if (response) {
      switch (response.status) {
        case 401:
          // 未授權，清除 token 並跳轉登入
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          console.error('沒有權限訪問')
          break
        case 404:
          console.error('請求的資源不存在')
          break
        case 500:
          console.error('伺服器錯誤')
          break
        default:
          console.error(`請求錯誤: ${response.status}`)
      }
    }
    else {
      console.error('網路連線異常')
    }

    return Promise.reject(error)
  },
)

export default request
