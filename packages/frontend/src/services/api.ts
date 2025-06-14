import { supabase } from '@/lib/supabase'

// DOM types for fetch API
type RequestInit = globalThis.RequestInit

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/v1'

// API response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface FileItem {
  id: number
  name: string
  path: string
  type: 'file' | 'folder'
  extension?: string
  size?: number
  parentId?: number
  ownerId: string
  createdAt: string
  updatedAt: string
}

// Helper function to make authenticated API calls
async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  try {
    // Get current session for auth token
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(session?.access_token && {
          Authorization: `Bearer ${session.access_token}`,
        }),
        ...options.headers,
      },
      ...options,
    })

    const result = await response.json()
    return result
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    }
  }
}

// File system API
export const fileApi = {
  // Get all files and folders
  async getAllFiles(limit = 100, offset = 0): Promise<ApiResponse<FileItem[]>> {
    return apiCall(`/files?limit=${limit}&offset=${offset}`)
  },

  // Get file by path
  async getFileByPath(path: string): Promise<ApiResponse<FileItem[]>> {
    return apiCall(`/files?path=${path}`)
  },

  // Search files
  async searchFiles(query: string, limit = 50): Promise<ApiResponse<FileItem[]>> {
    return apiCall(`/files/search/${query}?limit=${limit}`)
  },

  // Create file or folder
  async createFile(fileData: {
    name: string
    path: string
    type: 'file' | 'folder'
    extension?: string
    size?: number
    parentId?: number
    ownerId: string
  }): Promise<ApiResponse<FileItem>> {
    return apiCall('/files', {
      method: 'POST',
      body: JSON.stringify(fileData),
    })
  },

  // Delete file or folder
  async deleteFile(id: number): Promise<ApiResponse<FileItem>> {
    return apiCall(`/files/${id}`, {
      method: 'DELETE',
    })
  },
}
