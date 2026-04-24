import React, { forwardRef } from 'react';

import { type BottomSheetModal } from '@gorhom/bottom-sheet';
import styled from 'styled-components/native';

import { useTheme } from '@theme';

import { EditIcon, TrashIcon } from '@components/icons';
import { BottomSheetLabel, BottomSheetMenuEntry, ModalBottomSheet } from '@components/ui';

import i18n from '@translations/i18n';

const SNAP_POINTS = ['20%'];
const ICON_SIZE = 25;

const DeleteLabel = styled(BottomSheetLabel)`
  color: ${({ theme }) => theme.colors.red};
`;

type Props = {
  onEditActivity: () => void;
  onDeleteActivity: () => void;
};

const EditActivityBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({ onEditActivity, onDeleteActivity }, ref) => {
    const theme = useTheme();

    return (
      <ModalBottomSheet ref={ref} snapPoints={SNAP_POINTS} enablePanDownToClose>
        <BottomSheetMenuEntry onPress={onEditActivity}>
          <EditIcon width={ICON_SIZE} height={ICON_SIZE} color={theme.colors.primary} />
          <BottomSheetLabel>{i18n.t('activityDetails.bottomSheet.editActivity')}</BottomSheetLabel>
        </BottomSheetMenuEntry>
        <BottomSheetMenuEntry onPress={onDeleteActivity}>
          <TrashIcon width={ICON_SIZE} height={ICON_SIZE} color={theme.colors.red} />
          <DeleteLabel>{i18n.t('activityDetails.bottomSheet.deleteActivity')}</DeleteLabel>
        </BottomSheetMenuEntry>
      </ModalBottomSheet>
    );
  },
);

EditActivityBottomSheet.displayName = 'EditActivityBottomSheet';

export default EditActivityBottomSheet;
