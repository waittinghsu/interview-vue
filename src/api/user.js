import request from './request'

export const userApi = {
  // 登入
  login(credentials) {
    return request.post('/auth/login', credentials)
  },

  // 註冊
  register(data) {
    return request.post('/auth/register', data)
  },

  // 取得用戶資料
  getProfile() {
    return request.get('/user/profile')
  },

  // 更新用戶資料
  updateProfile(data) {
    return request.put('/user/profile', data)
  },

  // 登出
  logout() {
    return request.post('/auth/logout')
  },
}
