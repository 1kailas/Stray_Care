import axios, { AxiosError } from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Types
export interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'VOLUNTEER' | 'ADMIN'
  phoneNumber?: string
  address?: string
  status?: 'ACTIVE' | 'SUSPENDED'
  lastLogin?: string
  createdAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  phoneNumber?: string
  role?: string
}

export interface AuthResponse {
  token: string
  refreshToken?: string
  type?: string
  user: User
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}

export interface DogReport {
  id: string
  dogName?: string
  condition?: string
  location: string
  latitude?: number
  longitude?: number
  coordinates?: {
    type: string
    coordinates: [number, number]
  }
  description: string
  imageUrl?: string
  photos?: string[]
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESCUED' | 'COMPLETED' | 'CLOSED'
  urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  priority?: number
  reportedBy?: User
  reporterName?: string
  reporterContact?: string
  assignedTo?: User
  createdAt: string
  updatedAt: string
}

export interface Volunteer {
  id: string
  name: string
  email: string
  phoneNumber: string
  address: string
  availability: string
  experience: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  tasks?: VolunteerTask[]
  createdAt: string
}

export interface VolunteerTask {
  id: string
  volunteerId: string
  title: string
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  dueDate?: string
  assignedBy?: string
  assignedDate: string
  completedDate?: string
  notes?: string
}

export interface Adoption {
  id: string
  dogReportId?: string
  dogName: string
  dogDescription: string
  dogPhotoUrl?: string
  adopterId?: string
  adopterName?: string
  adopterContact?: string
  adopterEmail?: string
  adopterAddress?: string
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'COMPLETED'
  notes?: string
  applicationDate?: string
  approvalDate?: string
  completionDate?: string
  createdAt: string
}

export interface Donation {
  id: string
  amount: number
  donorName: string
  donorEmail: string
  message?: string
  status: 'PENDING' | 'COMPLETED' | 'FAILED'
  createdAt: string
}

export interface ForumPost {
  id: string
  title: string
  content: string
  author: User
  likes: number
  commentCount: number
  comments?: ForumComment[]
  isPinned: boolean
  isLocked: boolean
  createdAt: string
  updatedAt: string
}

export interface ForumComment {
  id: string
  content: string
  authorId: string
  authorName: string
  createdAt: string
  likes: number
}

export interface Notification {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

export interface VaccinationRecord {
  id: string
  dogReportId: string
  dogName: string
  vaccineType: string
  vaccinationDate: string
  nextDueDate: string
  veterinarianName: string
  notes?: string
  createdAt: string
}

// API Functions
export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data)
    return response.data.data // Extract data from ApiResponse wrapper
  },
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data)
    return response.data.data // Extract data from ApiResponse wrapper
  },
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/me')
    return response.data.data // Extract data from ApiResponse wrapper
  },
}

export const dogReportsApi = {
  getAll: async (params?: any): Promise<DogReport[]> => {
    const response = await api.get<ApiResponse<DogReport[]>>('/dog-reports', { params })
    return response.data.data
  },
  getById: async (id: string): Promise<DogReport> => {
    const response = await api.get<ApiResponse<DogReport>>(`/dog-reports/${id}`)
    return response.data.data
  },
  create: async (data: any): Promise<DogReport> => {
    const response = await api.post<ApiResponse<DogReport>>('/dog-reports', data)
    return response.data.data
  },
  update: async (id: string, data: Partial<DogReport>): Promise<DogReport> => {
    const response = await api.put<ApiResponse<DogReport>>(`/dog-reports/${id}`, data)
    return response.data.data
  },
  updateStatus: async (id: string, status: string): Promise<DogReport> => {
    const response = await api.patch<ApiResponse<DogReport>>(`/dog-reports/${id}/status`, { status })
    return response.data.data
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/dog-reports/${id}`)
  },
  getNearby: async (lat: number, lng: number): Promise<DogReport[]> => {
    const response = await api.get<ApiResponse<DogReport[]>>(`/dog-reports/nearby/${lat}/${lng}`)
    return response.data.data
  },
}

export const volunteersApi = {
  getAll: async (): Promise<Volunteer[]> => {
    const response = await api.get<ApiResponse<Volunteer[]>>('/volunteers')
    return response.data.data
  },
  create: async (data: Partial<Volunteer>): Promise<Volunteer> => {
    const response = await api.post<ApiResponse<Volunteer>>('/volunteers', data)
    return response.data.data
  },
  updateStatus: async (id: string, status: string): Promise<Volunteer> => {
    const response = await api.patch<ApiResponse<Volunteer>>(`/volunteers/${id}/status`, { status })
    return response.data.data
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/volunteers/${id}`)
  },
}

export const adoptionsApi = {
  getAll: async (): Promise<Adoption[]> => {
    const response = await api.get<ApiResponse<Adoption[]>>('/adoptions')
    return response.data.data
  },
  create: async (data: Partial<Adoption>): Promise<Adoption> => {
    const response = await api.post<ApiResponse<Adoption>>('/adoptions', data)
    return response.data.data
  },
  update: async (id: string, data: Partial<Adoption>): Promise<Adoption> => {
    const response = await api.put<ApiResponse<Adoption>>(`/adoptions/${id}`, data)
    return response.data.data
  },
  updateStatus: async (id: string, status: string): Promise<Adoption> => {
    const response = await api.patch<ApiResponse<Adoption>>(`/adoptions/${id}/status`, { status })
    return response.data.data
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/adoptions/${id}`)
  },
}

export const donationsApi = {
  getAll: async (): Promise<Donation[]> => {
    const response = await api.get<ApiResponse<Donation[]>>('/donations')
    return response.data.data
  },
  create: async (data: Partial<Donation>): Promise<Donation> => {
    const response = await api.post<ApiResponse<Donation>>('/donations', data)
    return response.data.data
  },
  getTotal: async (): Promise<number> => {
    const response = await api.get<ApiResponse<number>>('/donations/total')
    return response.data.data
  },
}

export const forumApi = {
  getAll: async (): Promise<ForumPost[]> => {
    const response = await api.get<ApiResponse<ForumPost[]>>('/forum')
    return response.data.data
  },
  getById: async (id: string): Promise<ForumPost> => {
    const response = await api.get<ApiResponse<ForumPost>>(`/forum/${id}`)
    return response.data.data
  },
  create: async (data: Partial<ForumPost>): Promise<ForumPost> => {
    const response = await api.post<ApiResponse<ForumPost>>('/forum', data)
    return response.data.data
  },
  like: async (id: string): Promise<void> => {
    await api.patch(`/forum/${id}/like`)
  },
  addComment: async (postId: string, comment: Partial<ForumComment>): Promise<ForumPost> => {
    const response = await api.post<ApiResponse<ForumPost>>(`/forum/${postId}/comments`, comment)
    return response.data.data
  },
}

export const notificationsApi = {
  getAll: async (): Promise<Notification[]> => {
    const response = await api.get<ApiResponse<Notification[]>>('/notifications')
    return response.data.data
  },
  markAsRead: async (id: string): Promise<void> => {
    await api.patch(`/notifications/${id}/read`)
  },
  markAllAsRead: async (): Promise<void> => {
    await api.patch('/notifications/mark-all-read')
  },
  getUnreadCount: async (): Promise<number> => {
    const response = await api.get<ApiResponse<number>>('/notifications/unread-count')
    return response.data.data
  },
}

export const vaccinationsApi = {
  getAll: async (): Promise<VaccinationRecord[]> => {
    const response = await api.get<ApiResponse<VaccinationRecord[]>>('/vaccinations')
    return response.data.data
  },
  create: async (data: Partial<VaccinationRecord>): Promise<VaccinationRecord> => {
    const response = await api.post<ApiResponse<VaccinationRecord>>('/vaccinations', data)
    return response.data.data
  },
  getByDogId: async (dogId: string): Promise<VaccinationRecord[]> => {
    const response = await api.get<ApiResponse<VaccinationRecord[]>>(`/vaccinations/dog/${dogId}`)
    return response.data.data
  },
}

// Users API (Admin)
export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<ApiResponse<User[]>>('/users')
    return response.data.data
  },
  changeRole: async (id: string, role: string): Promise<User> => {
    const response = await api.patch<ApiResponse<User>>(`/users/${id}/role`, { role })
    return response.data.data
  },
  toggleStatus: async (id: string, status: string): Promise<User> => {
    const response = await api.patch<ApiResponse<User>>(`/users/${id}/status`, { status })
    return response.data.data
  },
}

// Dogs API (separate from dog reports)
export interface Dog {
  id: string
  name: string
  breed: string
  age: number
  gender: string
  size: string
  description: string
  photos?: string[]
  healthStatus?: string
  vaccinated: boolean
  neutered: boolean
  temperament?: string
  goodWithKids?: boolean
  goodWithPets?: boolean
  specialNeeds?: string
  status: string // AVAILABLE, PENDING, ADOPTED
  addedBy?: string
  addedDate?: string
  updatedDate?: string
}

export const dogsApi = {
  getAll: async (): Promise<Dog[]> => {
    const response = await api.get<ApiResponse<Dog[]>>('/dogs')
    return response.data.data
  },
  create: async (data: Partial<Dog>): Promise<Dog> => {
    const response = await api.post<ApiResponse<Dog>>('/dogs', data)
    return response.data.data
  },
  update: async (id: string, data: Partial<Dog>): Promise<Dog> => {
    const response = await api.put<ApiResponse<Dog>>(`/dogs/${id}`, data)
    return response.data.data
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/dogs/${id}`)
  },
}

// Volunteer Tasks API
export const volunteerTasksApi = {
  // Get all tasks (admin view)
  getAll: async (): Promise<VolunteerTask[]> => {
    const response = await api.get<ApiResponse<VolunteerTask[]>>('/volunteer-tasks')
    return response.data.data
  },
  // Get tasks for a specific volunteer
  getByVolunteerId: async (volunteerId: string): Promise<VolunteerTask[]> => {
    const response = await api.get<ApiResponse<VolunteerTask[]>>(`/volunteer-tasks/volunteer/${volunteerId}`)
    return response.data.data
  },
  // Get tasks for current logged-in volunteer
  getMyTasks: async (): Promise<VolunteerTask[]> => {
    const response = await api.get<ApiResponse<VolunteerTask[]>>('/volunteer-tasks/my-tasks')
    return response.data.data
  },
  // Create new task (admin only)
  create: async (data: Partial<VolunteerTask>): Promise<VolunteerTask> => {
    const response = await api.post<ApiResponse<VolunteerTask>>('/volunteer-tasks', data)
    return response.data.data
  },
  // Update task
  update: async (id: string, data: Partial<VolunteerTask>): Promise<VolunteerTask> => {
    const response = await api.put<ApiResponse<VolunteerTask>>(`/volunteer-tasks/${id}`, data)
    return response.data.data
  },
  // Update task status (volunteers can update their own tasks)
  updateStatus: async (id: string, status: string, notes?: string): Promise<VolunteerTask> => {
    const response = await api.patch<ApiResponse<VolunteerTask>>(`/volunteer-tasks/${id}/status`, { status, notes })
    return response.data.data
  },
  // Delete task (admin only)
  delete: async (id: string): Promise<void> => {
    await api.delete(`/volunteer-tasks/${id}`)
  },
}

export default api
