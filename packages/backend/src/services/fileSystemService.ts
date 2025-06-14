import { db, fileSystemTable, type NewFileSystem } from '../db';
import { eq, like, asc } from 'drizzle-orm';

export class FileSystemService {
  // Get all files and folders
  async getAllFiles(limit = 100, offset = 0, path = '/') {
    return await db
      .select()
      .from(fileSystemTable)
      .where(like(fileSystemTable.path, `${path}%`))
      .orderBy(asc(fileSystemTable.name))
      .limit(limit)
      .offset(offset);
  }

  // Search files and folders
  async searchFiles(query: string, limit = 50) {
    return await db
      .select()
      .from(fileSystemTable)
      .where(like(fileSystemTable.name, `%${query}%`))
      .orderBy(asc(fileSystemTable.name))
      .limit(limit);
  }

  // Create new file or folder
  async createFile(fileData: NewFileSystem) {
    const result = await db
      .insert(fileSystemTable)
      .values(fileData)
      .returning();

    return result[0];
  }

  // Update file or folder
  async updateFile(id: number, updates: Partial<NewFileSystem>) {
    const result = await db
      .update(fileSystemTable)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(fileSystemTable.id, id))
      .returning();

    return result[0];
  }

  // Delete file or folder
  async deleteFile(id: number) {
    const result = await db
      .delete(fileSystemTable)
      .where(eq(fileSystemTable.id, id))
      .returning();

    return result[0];
  }
}
