<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/[50%] flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-96 max-w-md mx-4">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Create New Folder</h3>
      </div>

      <!-- Content -->
      <div class="px-6 py-4">
        <div class="mb-4">
          <label for="folderName" class="block text-sm font-medium text-gray-700 mb-2">
            Folder Name
          </label>
          <input
            id="folderName"
            v-model="folderName"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter folder name"
            @keyup.enter="handleCreate"
            @keyup.esc="handleCancel"
          />
        </div>

        <div class="mb-4">
          <label for="path" class="block text-sm font-medium text-gray-700 mb-2"> Path </label>
          <input
            id="path"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 disabled:text-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter folder name"
            :value="store.selectedFolder?.path ?? '/'"
            ref="inputPathRef"
            disabled
          />
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
          @click="handleCreate"
          :disabled="!folderName.trim()"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { useFolderStore } from '@/stores/folderStore'
import { useAuthStore } from '@/stores/auth'

interface Props {
  isOpen: boolean
  parentId?: number | null
}

interface Emits {
  (e: 'close'): void
  (e: 'created', folder: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const store = useFolderStore()
const folderName = ref('')
const error = ref('')
const inputFolderNameRef = ref<HTMLInputElement>()

const handleCreate = async () => {
  const authStore = useAuthStore()

  if (!folderName.value.trim()) {
    error.value = 'Folder name cannot be empty'
    return
  }

  if (!authStore.user?.id) {
    error.value = 'Need login'
    return
  }

  const result = await store.createFolder(
    props.parentId || null,
    folderName.value.trim(),
    authStore.user?.id,
  )

  if (result.success) {
    emit('created', result.folder)
    handleCancel()
  } else {
    error.value = result.error || 'Failed to create folder'
  }
}

const handleCancel = () => {
  folderName.value = ''
  error.value = ''
  emit('close')
}

// Focus input when dialog opens
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      nextTick(() => {
        inputFolderNameRef.value?.focus()
      })
    }
  },
)
</script>
