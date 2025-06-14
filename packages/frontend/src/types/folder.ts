import type { FileItem } from '@/services/api'

export interface Folder extends FileItem {
  children?: Folder[]
  isExpanded?: boolean
  isSelected?: boolean
}

export interface FolderState {
  folders: Folder[]
  selectedFolder: Folder | null
  expandedFolders: Set<string>
}

export interface FolderApiResponse {
  folders: Folder[]
}
