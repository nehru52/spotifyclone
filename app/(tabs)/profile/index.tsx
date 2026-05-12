import * as React from 'react';
import { ProfileScreen } from '@screens';
import { Header } from '@components';
import { Pages } from '@config';

export default function Profile() {
  return (
    <>
      <Header tab={Pages.PROFILE} />
      <ProfileScreen />
    </>
  );
}
