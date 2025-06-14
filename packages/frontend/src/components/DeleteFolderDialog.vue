<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/[50%] flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-96 max-w-md mx-4">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 class="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900">Delete Folder</h3>
            <p class="text-sm text-gray-500">This action cannot be undone</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="px-6 py-4">
        <div class="mb-4">
          <p class="text-sm text-gray-700 mb-3">
            Are you sure you want to delete the folder
            <span class="font-medium text-gray-900">"{{ folderName }}"</span>?
          </p>

          <div v-if="hasChildren" class="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div class="flex items-start space-x-2">
              <AlertTriangle class="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p class="text-sm font-medium text-yellow-800">Warning</p>
                <p class="text-sm text-yellow-700 mt-1">
                  This folder contains {{ childCount }} item{{ childCount !== 1 ? 's' : '' }}.
                  Deleting it will remove all contents permanently.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
        <button
          @click="handleCancel"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          @click="handleDelete"
          :disabled="isDeleting"
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <Loader2 v-if="isDeleting" class="w-4 h-4 animate-spin" />
          <Trash2 v-else class="w-4 h-4" />
          <span>{{ isDeleting ? 'Deleting...' : 'Delete' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFolderStore } from '@/stores/folderStore'
import { Trash2, AlertTriangle, Loader2 } from 'lucide-vue-next'

interface Props {
  isOpen: boolean
  folderId: number | null
  folderName: string
  hasChildren: boolean
  childCount: number
}

interface Emits {
  (e: 'close'): void
  (e: 'deleted'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const store = useFolderStore()
const isDeleting = ref(false)
const error = ref('')

const handleDelete = async () => {
  if (!props.folderId) return

  try {
    isDeleting.value = true
    error.value = ''

    const result = await store.deleteFolder(props.folderId)

    await store.loadFolders()
    if (result.success) {
      emit('deleted')
      handleCancel()
    } else {
      error.value = result.error || 'Failed to delete folder'
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
    console.error('Error deleting folder:', err)
  } finally {
    isDeleting.value = false
  }
}

const handleCancel = () => {
  error.value = ''
  emit('close')
}
</script>
