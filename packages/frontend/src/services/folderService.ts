import type { Folder } from '@/types/folder'
export class FolderService {
  /**
   * Get direct subfolders of a given folder
   */
  static getDirectSubfolders(folder: Folder): Folder[] {
    return folder.children?.filter((item) => item.type === 'folder') || []
  }

  /**
   * Find a folder by its ID in the folder tree
   */
  static findFolderById(folders: Folder[], id: number): Folder | null {
    for (const folder of folders) {
      if (folder.id === id) {
        return folder
      }
      if (folder.children) {
        const found = this.findFolderById(folder.children, id)
        if (found) return found
      }
    }
    return null
  }

  /**
   * Get the complete path to a folder
   */
  static getFolderPath(folder: Folder): string {
    return folder.path
  }

  /**
   * Check if a folder has children
   */
  static hasChildren(folder: Folder): boolean {
    return !!(folder.children && folder.children.length > 0)
  }

  /**
   * Get all folders in a flat structure for easier manipulation
   */
  static flattenFolders(folders: Folder[]): Folder[] {
    const result: Folder[] = []

    const traverse = (folderList: Folder[]) => {
      for (const folder of folderList) {
        result.push(folder)
        if (folder.children) {
          traverse(folder.children)
        }
      }
    }

    traverse(folders)
    return result
  }
}
