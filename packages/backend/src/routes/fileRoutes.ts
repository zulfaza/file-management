import { Elysia, t } from 'elysia';
import { FileSystemService } from '../services/fileSystemService';

const fileSystemService = new FileSystemService();

// Define the extension enum values for validation
const extensionEnum = t.Union([
  t.Literal('txt'),
  t.Literal('pdf'),
  t.Literal('doc'),
  t.Literal('docx'),
  t.Literal('xls'),
  t.Literal('xlsx'),
  t.Literal('ppt'),
  t.Literal('pptx'),
  t.Literal('jpg'),
  t.Literal('jpeg'),
  t.Literal('png'),
]);

export const fileRoutes = new Elysia({ prefix: '/v1/files' })
  .get(
    '/',
    async ({ query }) => {
      try {
        const limit = parseInt(query.limit as string) || 100;
        const offset = parseInt(query.offset as string) || 0;
        const path = query.path;
        const files = await fileSystemService.getAllFiles(limit, offset, path);

        return { success: true, data: files };
      } catch (error) {
        console.log(error);
        return { success: false, error: 'Failed to fetch files' };
      }
    },
    {
      query: t.Object({
        limit: t.Optional(t.String()),
        offset: t.Optional(t.String()),
        path: t.Optional(t.String()),
      }),
    }
  )

  .get(
    '/search/:query',
    async ({ params, query }) => {
      try {
        const limit = parseInt(query.limit as string) || 50;
        const files = await fileSystemService.searchFiles(params.query, limit);
        return { success: true, data: files };
      } catch (error) {
        return { success: false, error: 'Failed to search files' };
      }
    },
    {
      params: t.Object({
        query: t.String(),
      }),
      query: t.Object({
        limit: t.Optional(t.String()),
      }),
    }
  )

  // Create new file or folder
  .post(
    '/',
    async ({ body }) => {
      try {
        const file = await fileSystemService.createFile(body);
        return { success: true, data: file };
      } catch (error) {
        console.log(error);
        return { success: false, error: 'Failed to create file' };
      }
    },
    {
      body: t.Object({
        name: t.String(),
        path: t.String(),
        type: t.Union([t.Literal('file'), t.Literal('folder')]),
        extension: t.Optional(extensionEnum),
        size: t.Optional(t.Number()),
        parentId: t.Optional(t.Number()),
        ownerId: t.String(),
      }),
    }
  )

  // Update file or folder
  .put(
    '/:id',
    async ({ params, body }) => {
      try {
        const id = parseInt(params.id);
        const file = await fileSystemService.updateFile(id, body);
        if (!file) {
          return { success: false, error: 'File not found' };
        }
        return { success: true, data: file };
      } catch (error) {
        return { success: false, error: 'Failed to update file' };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        name: t.Optional(t.String()),
        path: t.Optional(t.String()),
        type: t.Optional(t.Union([t.Literal('file'), t.Literal('folder')])),
        extension: t.Optional(extensionEnum),
        size: t.Optional(t.Number()),
        parentId: t.Optional(t.Number()),
        ownerId: t.String(),
      }),
    }
  )

  // Delete file or folder
  .delete(
    '/:id',
    async ({ params }) => {
      try {
        const id = parseInt(params.id);
        const file = await fileSystemService.deleteFile(id);

        if (!file) {
          return { success: false, error: 'File not found' };
        }

        return { success: true, data: file };
      } catch (error) {
        return { success: false, error: 'Failed to delete file' };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  );
