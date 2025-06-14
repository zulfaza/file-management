<template>
  <div class="flex flex-col h-full">
    <!-- Navigation Pane Header -->
    <div class="bg-gray-50 border-b border-gray-200 px-3 py-2">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-gray-700">Navigation Panel</h3>
        <div class="flex items-center space-x-1">
          <button
            @click="expandAll"
            class="p-1 hover:bg-gray-200 rounded transition-colors duration-200"
            title="Expand All"
          >
            <ChevronDown class="w-3 h-3 text-gray-600" />
          </button>
          <button
            @click="collapseAll"
            class="p-1 hover:bg-gray-200 rounded transition-colors duration-200"
            title="Collapse All"
          >
            <ChevronRight class="w-3 h-3 text-gray-600" />
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center p-4">
      <div class="text-center">
        <Loader2 class="w-6 h-6 text-blue-500 animate-spin mx-auto mb-2" />
        <span class="text-sm text-gray-600">Loading folders...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex-1 flex items-center justify-center p-4">
      <div class="text-center">
        <AlertCircle class="w-6 h-6 text-red-500 mx-auto mb-2" />
        <span class="text-sm text-gray-600 mb-2 block">Error: {{ error }}</span>
        <button
          @click="loadFolders"
          class="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Folder Tree -->
    <div v-else class="flex-1 overflow-y-auto">
      <div class="py-2">
        <FolderTreeItem
          v-for="folder in folders"
          :key="folder.id"
          :folder="folder"
          :level="0"
          @select="selectFolder"
          @toggle="toggleFolderExpansion"
          @delete="handleDeleteFolder"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useFolderStore } from '@/stores/folderStore'
import FolderTreeItem from './FolderTreeItem.vue'
import { ChevronDown, ChevronRight, Loader2, AlertCircle } from 'lucide-vue-next'

// Define emits
const emit = defineEmits<{
  'delete-folder': [folder: any]
}>()

const store = useFolderStore()

// Use storeToRefs for reactive properties
const { folders, isLoading, error } = storeToRefs(store)

// Keep methods as direct store references
const { loadFolders, toggleFolderExpansion, expandAllFolders, collapseAllFolders } = store

const selectFolder = async (folder: any) => {
  await store.selectFolder(folder)
}

const expandAll = () => {
  expandAllFolders()
}

const collapseAll = () => {
  collapseAllFolders()
}

const handleDeleteFolder = (folder: any) => {
  // Emit the delete event to parent component
  emit('delete-folder', folder)
}

onMounted(() => {
  loadFolders()
})
</script>
