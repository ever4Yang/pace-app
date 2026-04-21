import * as FileSystem from 'expo-file-system';

import { deleteProfile } from './storage';

export default async function signOut(): Promise<void> {
  await deleteProfile();
  if (FileSystem.cacheDirectory) {
    try {
      await FileSystem.deleteAsync(FileSystem.cacheDirectory);
      // eslint-disable-next-line no-empty
    } catch {}
  }

  if (FileSystem.documentDirectory) {
    try {
      await FileSystem.deleteAsync(FileSystem.documentDirectory);
      // eslint-disable-next-line no-empty
    } catch {}
  }

}
