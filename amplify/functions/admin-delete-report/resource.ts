import { defineFunction } from '@aws-amplify/backend';

export const adminDeleteReport = defineFunction({
  name: 'admin-delete-report',
  entry: './handler.ts',
});
