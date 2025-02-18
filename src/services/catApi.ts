import axios from 'axios'
import type { Cat } from '../types/cat'

const api = axios.create({
  baseURL: 'https://api.api-ninjas.com/v1',
  headers: {
    'X-Api-Key': import.meta.env.VITE_API_NINJAS_KEY,
  },
})

export const fetchCatsByBreed = async (breed: string): Promise<Cat[]> => {
  try {
    const response = await api.get(`/cats?name=${breed}`)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch cats')
    }
    throw error
  }

}

interface ApiResponse<T> {
  data: T;
}

export const fetchCatsListByBreed = async (): Promise<Cat[]> => {
  try {
    const response: ApiResponse<Cat[]> = await api.get('/cats?min_weight=1')
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch cats')
    }
    throw error
  }
}
