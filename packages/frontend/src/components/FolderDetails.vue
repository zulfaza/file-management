<template>
  <div class="h-full flex flex-col bg-white">
    <!-- Details Pane Header -->
    <div class="bg-gray-50 border-b border-gray-200 px-4 py-2">
      <h3 class="text-sm font-medium text-gray-700">Details Pane</h3>
    </div>

    <!-- No Selection State -->
    <div v-if="!selectedFolder" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <FolderIcon class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500 text-sm">
          Select a folder from the navigation pane to view its contents
        </p>
      </div>
    </div>

    <!-- Selected Folder Content -->
    <div v-else class="flex-1 flex flex-col overflow-hidden">
      <!-- Selected Folder Info -->
      <div class="bg-blue-50 border-b border-blue-200 px-4 py-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-500 rounded flex items-center justify-center">
            <FolderIcon class="w-6 h-6 text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-lg font-medium text-gray-900 truncate">{{ selectedFolder.name }}</h4>
            <p class="text-xs text-gray-600 font-mono truncate">{{ selectedFolder.path }}</p>
          </div>
        </div>
      </div>

      <!-- Contents Section -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <div class="bg-gray-50 border-b border-gray-200 px-4 py-2">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-medium text-gray-700">
              Contents ({{ folderContents.length }})
            </h4>
            <div class="flex items-center gap-2">
              <FolderIcon class="w-4 h-4 text-gray-500" />
              <FileIcon class="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>

        <!-- No Contents -->
        <div v-if="folderContents.length === 0" class="flex-1 flex items-center justify-center">
          <div class="text-center">
            <FolderOpenIcon class="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p class="text-gray-500 text-sm">This folder is empty</p>
          </div>
        </div>

        <!-- Contents List -->
        <div v-else class="flex-1 overflow-y-auto">
          <div class="divide-y divide-gray-100">
            <div
              v-for="item in folderContents"
              :key="item.id"
              class="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
              @dblclick="handleItemDoubleClick(item)"
            >
              <div class="flex items-center gap-3">
                <!-- Folder Icon -->
                <div
                  v-if="item.type === 'folder'"
                  class="w-8 h-8 bg-yellow-100 rounded flex items-center justify-center"
                >
                  <FolderIcon class="w-4 h-4 text-yellow-600" />
                </div>
                <!-- File Icon -->
                <div v-else class="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  <ImageIcon
                    v-if="item.extension && ['png', 'jpg', 'jpeg'].includes(item.extension)"
                    class="w-4 h-4 text-blue-600"
                  />
                  <FileIcon v-else class="w-4 h-4 text-blue-600" />
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-900 truncate">
                      {{ item.name }}
                    </span>
                    <div class="flex items-center gap-2">
                      <!-- Item count for folders -->
                      <span
                        v-if="item.type === 'folder' && getChildrenCount(item) > 0"
                        class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
                      >
                        {{ getChildrenCount(item) }} items
                      </span>
                      <!-- File size for files -->
                      <span
                        v-if="item.type === 'file' && item.size"
                        class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
                      >
                        {{ formatFileSize(item.size) }}
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 mt-1">
                    <p class="text-xs text-gray-500 font-mono truncate">
                      {{ item.path }}
                    </p>
                    <!-- File extension badge -->
                    <span
                      v-if="item.type === 'file' && item.extension"
                      class="text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded"
                    >
                      .{{ item.extension }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Folder } from '@/types/folder'
import type { FileItem } from '@/services/api'
import { useFolderStore } from '@/stores/folderStore'
import { FolderIcon, FolderOpenIcon, FileIcon, ImageIcon } from 'lucide-vue-next'

const store = useFolderStore()

const selectedFolder = computed(() => store.selectedFolder)
const selectedSubfolders = computed(() => store.selectedSubfolders)
const selectedFiles = computed(() => store.selectedFiles)

// Combine folders and files into a single list, with folders first
const folderContents = computed(() => {
  const folders = selectedSubfolders.value
  const files = selectedFiles.value

  // Sort folders and files alphabetically by name
  const sortedFolders = [...folders].sort((a, b) => a.name.localeCompare(b.name))
  const sortedFiles = [...files].sort((a, b) => a.name.localeCompare(b.name))

  return [...sortedFolders, ...sortedFiles]
})

const selectSubfolder = async (folder: Folder) => {
  await store.selectFolder(folder)
}

const openFile = (file: FileItem) => {
  // For now, just log the file. In a real application, you might:
  // - Open the file in a viewer/editor
  // - Download the file
  // - Show file details in a modal
  console.log('Opening file:', file)
  alert(`Opening file: ${file.name}`)
}

const handleItemDoubleClick = (item: Folder | FileItem) => {
  if (item.type === 'folder') {
    selectSubfolder(item as Folder)
  } else {
    openFile(item as FileItem)
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const getChildrenCount = (item: Folder | FileItem): number => {
  if (item.type === 'folder') {
    return (item as Folder).children?.length || 0
  }
  return 0
}
</script>
