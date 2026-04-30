import React, { forwardRef, useCallback } from 'react';

import GorhomBottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  type BottomSheetModalProps,
  type BottomSheetProps,
  BottomSheetView,
  BottomSheetModal as GorhomBottomSheetModal,
} from '@gorhom/bottom-sheet';
import styled from 'styled-components/native';

import { useTheme } from '@theme';

import Text from './Text';

const StyledBottomSheet = styled(GorhomBottomSheet)`
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
`;

const ContentWrapper = styled(BottomSheetView)`
  background-color: ${({ theme }) => theme.colors.background};
`;

export const MenuEntry = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  padding-horizontal: ${({ theme }) => theme.sizes.outerPadding}px;
  padding-vertical: ${({ theme }) => theme.sizes.innerPadding}px;
`;

export const Label = styled(Text)`
  font-size: 16px;
  margin-left: ${({ theme }) => theme.sizes.outerPadding}px;
`;

type Props = BottomSheetProps & {
  hideBackdrop?: boolean;
};

const BottomSheet = forwardRef<GorhomBottomSheet, Props>(
  ({ hideBackdrop, children, ...props }, ref) => {
    const theme = useTheme();

    const renderBackdrop = useCallback(
      (backdropProps: BottomSheetBackdropProps) => {
        if (hideBackdrop) {
          return null;
        }

        return <BottomSheetBackdrop {...backdropProps} appearsOnIndex={0} disappearsOnIndex={-1} />;
      },
      [hideBackdrop],
    );

    return (
      <StyledBottomSheet
        ref={ref}
        index={0}
        handleIndicatorStyle={{ backgroundColor: theme.colors.primary }}
        backgroundStyle={{ backgroundColor: theme.colors.background }}
        backdropComponent={renderBackdrop}
        {...props}>
        <ContentWrapper>{children}</ContentWrapper>
      </StyledBottomSheet>
    );
  },
);

BottomSheet.displayName = 'BottomSheet';

type ModalProps = Omit<BottomSheetModalProps, 'children'> & {
  hideBackdrop?: boolean;
  children?: React.ReactNode;
};

export const ModalBottomSheet = forwardRef<GorhomBottomSheetModal, ModalProps>(
  ({ hideBackdrop, children, ...props }, ref) => {
    const theme = useTheme();

    const renderBackdrop = useCallback(
      (backdropProps: BottomSheetBackdropProps) => {
        if (hideBackdrop) {
          return null;
        }

        return <BottomSheetBackdrop {...backdropProps} appearsOnIndex={0} disappearsOnIndex={-1} />;
      },
      [hideBackdrop],
    );

    return (
      <GorhomBottomSheetModal
        ref={ref}
        handleIndicatorStyle={{ backgroundColor: theme.colors.primary }}
        backgroundStyle={{ backgroundColor: theme.colors.background }}
        backdropComponent={renderBackdrop}
        {...props}>
        <ContentWrapper>{children}</ContentWrapper>
      </GorhomBottomSheetModal>
    );
  },
);

ModalBottomSheet.displayName = 'ModalBottomSheet';

export default BottomSheet;
