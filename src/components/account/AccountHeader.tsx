import React, { type FC } from 'react';

import { Link } from 'expo-router';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { useTheme } from '@theme';

import useProfilePicture from '@api/profilePicture/useProfilePicture';

import { CameraIcon, SettingsIcon } from '@components/icons';
import { SecondaryButton } from '@components/ui';

import i18n from '@translations/i18n';

const Wrapper = styled.View<{ safeMarginTop: number }>`
  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  padding-top: ${({ safeMarginTop, theme }) => safeMarginTop + theme.sizes.outerPadding}px;
  padding-bottom: ${({ theme }) => theme.sizes.outerPadding}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ProfilePictureWrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const DefaultAvatarWrapper = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 50px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: rgba(164, 121, 255, 0.25);
`;

const ProfilePicture = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
`;

const CameraIconWrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  position: absolute;
  left: 70px;
  top: 60px;

  width: 34px;
  height: 34px;
  border-radius: 17px;

  background-color: ${({ theme }) => theme.colors.componentBackground};

  shadow-radius: 5px;
  shadow-offset: 0px 0px;
  shadow-color: ${({ theme }) => theme.colors.primary};
  shadow-opacity: 0.3;
  elevation: 5;
`;

const DetailsWrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  margin-left: ${({ theme }) => theme.sizes.outerPadding}px;

  background-color: ${({ theme }) => theme.colors.background};
`;

const AccountHeader: FC = () => {
  const { top } = useSafeAreaInsets();
  const theme = useTheme();

  const { data: profilePictureData } = useProfilePicture();

  return (
    <Wrapper safeMarginTop={top}>
      <Link href="/settings/profile-picture">
        <ProfilePictureWrapper>
          <DefaultAvatarWrapper>
            {profilePictureData ? (
              <ProfilePicture source={{ uri: profilePictureData }} />
            ) : (
              <CameraIcon width={40} height={40} color={theme.colors.purple} />
            )}
          </DefaultAvatarWrapper>
          <CameraIconWrapper>
            <CameraIcon width={20} height={20} color={theme.colors.primary} />
          </CameraIconWrapper>
        </ProfilePictureWrapper>
      </Link>
      <DetailsWrapper>
        <Link href="/settings" asChild>
          <SecondaryButton label={i18n.t('account.buttons.settings')} Icon={SettingsIcon} />
        </Link>
      </DetailsWrapper>
    </Wrapper>
  );
};

export default AccountHeader;
