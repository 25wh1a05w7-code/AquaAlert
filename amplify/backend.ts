import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { adminDeleteReport } from './functions/admin-delete-report/resource';

defineBackend({
  auth,
  data,
  adminDeleteReport,
});
