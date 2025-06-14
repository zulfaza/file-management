import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Folder } from '@/types/folder'
import { FolderService } from '@/services/folderService'
import { fileApi, type FileItem } from '@/services/api'
import { slugtify } from '@/lib/string'

export const useFolderStore = defineStore('folder', () => {
  // State
  const folders = ref<Folder[]>([])
  const items = ref<FileItem[]>([])
  const selectedFolder = ref<Folder | null>(null)
  const expandedFolders = ref<Set<number>>(new Set())
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const selectedSubfolders = computed(() => {
    if (!selectedFolder.value) return []
    return FolderService.getDirectSubfolders(selectedFolder.value)
  })

  const selectedFiles = computed(() => {
    if (!selectedFolder.value) return []
    return items.value.filter(
      (item: FileItem) => item.type === 'file' && item.parentId === selectedFolder.value?.id,
    )
  })

  const isFolderExpanded = computed(() => {
    return (folderId: number) => expandedFolders.value.has(folderId)
  })

  const isFolderSelected = computed(() => {
    return (folderId: number) => selectedFolder.value?.id === folderId
  })

  const groupFilesToFolders = (items: FileItem[]): Folder[] => {
    const itemMap = new Map<number, Folder & { parentId?: number }>()
    for (const item of items) {
      itemMap.set(item.id, {
        ...item,
        children: item.type === 'folder' ? [] : undefined,
      })
    }
    const roots: Folder[] = []
    for (const item of itemMap.values()) {
      if (item.parentId && itemMap.has(item.parentId)) {
        const parent = itemMap.get(item.parentId)!
        if (!parent.children) parent.children = []
        parent.children.push(item)
      } else {
        roots.push(item)
      }
    }
    return roots
  }

  // Actions
  const loadFolders = async () => {
    try {
      isLoading.value = true
      error.value = null
      const responseApi = await fileApi.getFileByPath('/')
      folders.value = groupFilesToFolders(responseApi.data ?? [])
      items.value = responseApi.data ?? []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load folders'
      console.error('Error loading folders:', err)
    } finally {
      isLoading.value = false
    }
  }

  const selectFolder = async (folder: Folder) => {
    selectedFolder.value = folder
  }

  const toggleFolderExpansion = (folderId: number) => {
    if (expandedFolders.value.has(folderId)) {
      expandedFolders.value.delete(folderId)
    } else {
      expandedFolders.value.add(folderId)
    }
  }

  const expandFolder = (folderId: number) => {
    expandedFolders.value.add(folderId)
  }

  const collapseFolder = (folderId: number) => {
    expandedFolders.value.delete(folderId)
  }

  const expandAllFolders = () => {
    const allFolderIds = FolderService.flattenFolders(folders.value).map((f) => f.id)
    expandedFolders.value = new Set(allFolderIds)
  }

  const collapseAllFolders = () => {
    expandedFolders.value.clear()
  }

  const clearSelection = () => {
    selectedFolder.value = null
  }

  const createFolder = async (parentId: number | null, folderName: string, ownerId: string) => {
    const parentFolder = parentId ? items.value.find((item) => item.id === parentId) : null
    const slug = slugtify(folderName)
    const data = {
      name: folderName,
      path: parentFolder ? `${parentFolder.path}/${slug}` : `/${slug}`,
      type: 'folder' as const,
      parentId: parentId ? parentId : undefined,
      ownerId: ownerId,
    }
    const response = await fileApi.createFile(data)

    if (response.success && response.data) {
      const newFolder = response.data

      // If creating in the currently selected folder, expand it
      if (parentId && expandedFolders.value.has(parentId)) {
        // Parent is already expanded, no need to do anything
      } else if (parentId) {
        // Expand the parent folder to show the new folder
        expandedFolders.value.add(parentId)
      }

      const newItems = Array.from([...items.value, response.data])

      items.value = newItems
      folders.value = groupFilesToFolders(items.value)
      // Select the newly created folder
      selectFolder(newFolder)

      return { success: true, folder: newFolder }
    } else {
      return { success: false, error: response.error }
    }
  }

  const deleteFolder = async (folderId: number) => {
    const responseApi = await fileApi.deleteFile(folderId)
    if (responseApi.success) {
      // If the deleted folder was selected, clear selection
      if (selectedFolder.value?.id === folderId) {
        selectedFolder.value = null
      }
      // Remove from expanded folders
      expandedFolders.value.delete(folderId)

      return { success: true }
    } else {
      return { success: false, error: responseApi.error }
    }
  }

  return {
    // State
    folders,
    items,
    selectedFolder,
    expandedFolders,
    isLoading,
    error,

    // Getters
    selectedSubfolders,
    selectedFiles,
    isFolderExpanded,
    isFolderSelected,

    // Actions
    loadFolders,
    selectFolder,
    toggleFolderExpansion,
    expandFolder,
    collapseFolder,
    expandAllFolders,
    collapseAllFolders,
    clearSelection,
    createFolder,
    deleteFolder,
  }
})
