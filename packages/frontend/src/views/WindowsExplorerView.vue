<template>
  <div class="h-screen bg-gray-50 flex flex-col">
    <!-- Title Bar -->
    <div class="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
          <FolderIcon class="w-4 h-4 text-white" />
        </div>
        <h1 class="text-lg font-medium text-gray-900">Windows Explorer</h1>
      </div>
      <div class="flex items-center space-x-2">
        <button
          @click="openCreateFolderDialog"
          class="p-2 hover:bg-gray-100 rounded transition-colors duration-200"
          title="New Folder"
        >
          <FolderPlus class="w-4 h-4 text-gray-600" />
        </button>
        <button
          @click="refresh"
          class="p-2 hover:bg-gray-100 rounded transition-colors duration-200"
          title="Refresh"
        >
          <RotateCcw class="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left Panel - Navigation Pane -->
      <div class="w-64 bg-white border-r border-gray-200 flex flex-col">
        <FolderTree @delete-folder="handleDeleteFolder" />
      </div>

      <!-- Right Panel - Details Pane -->
      <div class="flex-1 bg-white">
        <FolderDetails />
      </div>
    </div>

    <!-- Create Folder Dialog -->
    <CreateFolderDialog
      :is-open="isCreateDialogOpen"
      :parent-id="selectedFolderId"
      @close="closeCreateFolderDialog"
      @created="handleFolderCreated"
    />

    <!-- Delete Folder Dialog -->
    <DeleteFolderDialog
      :is-open="isDeleteDialogOpen"
      :folder-id="folderToDelete?.id || null"
      :folder-name="folderToDelete?.name || ''"
      :has-children="folderToDelete?.children ? folderToDelete.children.length > 0 : false"
      :child-count="getTotalChildCount(folderToDelete)"
      @close="closeDeleteDialog"
      @deleted="handleFolderDeleted"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useFolderStore } from '@/stores/folderStore'
import FolderTree from '@/components/FolderTree.vue'
import FolderDetails from '@/components/FolderDetails.vue'
import CreateFolderDialog from '@/components/CreateFolderDialog.vue'
import DeleteFolderDialog from '@/components/DeleteFolderDialog.vue'
import { FolderIcon, RotateCcw, FolderPlus } from 'lucide-vue-next'
import type { Folder } from '@/types/folder'

const store = useFolderStore()
const { selectedFolder } = storeToRefs(store)
const { loadFolders } = store

const isCreateDialogOpen = ref(false)
const isDeleteDialogOpen = ref(false)
const folderToDelete = ref<Folder | null>(null)

const selectedFolderId = computed(() => selectedFolder.value?.id || null)

const refresh = () => {
  loadFolders()
}

const openCreateFolderDialog = () => {
  isCreateDialogOpen.value = true
}

const closeCreateFolderDialog = () => {
  isCreateDialogOpen.value = false
}

const handleFolderCreated = (folder: any) => {
  console.log('Folder created:', folder)
  // The store will automatically update the UI
}

const handleDeleteFolder = (folder: Folder) => {
  folderToDelete.value = folder
  isDeleteDialogOpen.value = true
}

const closeDeleteDialog = () => {
  isDeleteDialogOpen.value = false
  folderToDelete.value = null
}

const handleFolderDeleted = () => {
  console.log('Folder deleted')
  // The store will automatically update the UI
}

const getTotalChildCount = (folder: Folder | null): number => {
  if (!folder || !folder.children) return 0

  let count = 0
  const countChildren = (children: Folder[]) => {
    for (const child of children) {
      count++
      if (child.children && child.children.length > 0) {
        countChildren(child.children)
      }
    }
  }

  countChildren(folder.children)
  return count
}
</script>
