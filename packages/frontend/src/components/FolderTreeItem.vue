<template>
  <div class="w-full">
    <div
      class="flex items-center min-h-8 px-2 cursor-pointer transition-colors duration-150 hover:bg-blue-50 group"
      :class="{
        'bg-blue-100 border-r-2 border-blue-500': isSelected,
      }"
      :style="{ paddingLeft: `${level * 16 + 8}px` }"
      @click="handleClick"
      @contextmenu.prevent="handleContextMenu"
    >
      <div class="flex items-center w-full gap-1">
        <!-- Expand/Collapse Button -->
        <button
          v-if="hasChildren"
          @click.stop="toggleExpansion"
          class="w-4 h-4 flex items-center justify-center hover:bg-gray-200 rounded transition-colors duration-150"
        >
          <ChevronRight
            class="w-3 h-3 text-gray-500 transition-transform duration-150"
            :class="{ 'rotate-90': isExpanded }"
          />
        </button>
        <div v-else class="w-4"></div>

        <!-- Folder Icon -->
        <div class="flex items-center justify-center w-4 h-4">
          <FolderIcon v-if="!isExpanded" class="w-4 h-4 text-yellow-500" />
          <FolderOpenIcon v-else class="w-4 h-4 text-yellow-500" />
        </div>

        <!-- Folder Name -->
        <span
          class="flex-1 text-sm text-gray-700 truncate"
          :class="{ 'font-medium': isSelected }"
          :title="folder.path"
        >
          {{ folder.name }}
        </span>

        <!-- Actions (visible on hover) -->
        <div
          class="opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center space-x-1"
        >
          <button
            @click.stop="handleDelete"
            class="p-1 hover:bg-red-100 rounded transition-colors duration-150"
            title="Delete folder"
          >
            <Trash2 class="w-3 h-3 text-red-500" />
          </button>
        </div>
      </div>
    </div>

    <!-- Children -->
    <div v-if="isExpanded && hasChildren" class="w-full">
      <FolderTreeItem
        v-for="child in folder.children"
        :key="child.id"
        :folder="child"
        :level="level + 1"
        @select="$emit('select', $event)"
        @toggle="$emit('toggle', $event)"
        @delete="$emit('delete', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Folder } from '@/types/folder'
import { useFolderStore } from '@/stores/folderStore'
import { ChevronRight, FolderIcon, FolderOpenIcon, Trash2 } from 'lucide-vue-next'

interface Props {
  folder: Folder
  level: number
}

interface Emits {
  (e: 'select', folder: Folder): void
  (e: 'toggle', folderId: number): void
  (e: 'delete', folder: Folder): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const store = useFolderStore()

const isSelected = computed(() => store.isFolderSelected(props.folder.id))
const isExpanded = computed(() => store.isFolderExpanded(props.folder.id))
const hasChildren = computed(() => {
  return props.folder.children && props.folder.children.length > 0
})

const handleClick = () => {
  emit('select', props.folder)
}

const toggleExpansion = () => {
  emit('toggle', props.folder.id)
}

const handleDelete = () => {
  emit('delete', props.folder)
}

const handleContextMenu = () => {
  emit('select', props.folder)
}
</script>
