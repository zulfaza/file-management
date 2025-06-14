import {
  integer,
  varchar,
  text,
  timestamp,
  index,
  pgEnum,
  pgTable,
  foreignKey,
} from 'drizzle-orm/pg-core';

// Enum for file types
export const fileTypeEnum = pgEnum('file_type', ['file', 'folder']);

// Enum for file extensions
export const fileExtensionEnum = pgEnum('file_extension', [
  'txt',
  'pdf',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'jpg',
  'jpeg',
  'png',
]);

// Files and folders table
export const fileSystemTable = pgTable(
  'file_system',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    path: text().notNull().unique(),
    type: fileTypeEnum('file_type').notNull(),
    extension: fileExtensionEnum('file_extension'),
    size: integer(), // in bytes, null for folders
    parentId: integer(), // for folder hierarchy - will be handled in relations
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow(),
    ownerId: text(),
  },
  (table) => [
    index('path_idx').on(table.path),
    index('parent_idx').on(table.parentId),
    index('type_idx').on(table.type),
    index('owner_idx').on(table.ownerId),
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
    }).onDelete('cascade'),
  ]
);

// Export types for TypeScript
export type FileSystem = typeof fileSystemTable.$inferSelect;
export type NewFileSystem = typeof fileSystemTable.$inferInsert;
