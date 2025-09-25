import { ApiClient } from '@/api-client'
import { BACKEND_URL } from './Config'

const api = new ApiClient({ baseUrl: BACKEND_URL })

export default api 
