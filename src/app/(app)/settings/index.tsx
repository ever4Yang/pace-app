import { type FC, useCallback, useState } from 'react';

import useDeleteAccount from '@api/account/useDeleteAccount';
import useSignOut from '@api/auth/useSignOut';

import ConfirmDeleteAccountModal from '@components/settings/ConfirmDeleteAccountModal';
import DeletingAccountModal from '@components/settings/DeletingAccountModal';
import SettingsUI from '@components/settings/SettingsUI';

const SettingsScreen: FC = () => {
  const [confirmDeleteAccountModalVisible, setConfirmDeleteAccountModalVisible] = useState(false);
  const [deletingAccountModalVisible, setDeletingAccountModalVisible] = useState(false);

  const {
    mutate: deleteAccount,
    isPending: isDeleteAccountLoading,
    isError: isDeleteAccountError,
  } = useDeleteAccount();
  const { mutate: signOut } = useSignOut();

  const onDeleteAccount = useCallback((): void => {
    setConfirmDeleteAccountModalVisible(true);
  }, []);

  const deleteAccountAndSignOut = useCallback(async (): Promise<void> => {
    setConfirmDeleteAccountModalVisible(false);

    deleteAccount(undefined, {
      onSuccess: () => {
        signOut();
      },
    });
  }, [deleteAccount, signOut]);

  return (
    <>
      <SettingsUI onDeleteAccount={onDeleteAccount} />
      <ConfirmDeleteAccountModal
        visible={confirmDeleteAccountModalVisible}
        onConfirm={deleteAccountAndSignOut}
        onCancel={() => setConfirmDeleteAccountModalVisible(false)}
      />
      <DeletingAccountModal
        visible={isDeleteAccountLoading || deletingAccountModalVisible}
        hasError={isDeleteAccountError}
        onClose={() => {
          setDeletingAccountModalVisible(false);
        }}
      />
    </>
  );
};

export default SettingsScreen;
