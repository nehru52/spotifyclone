import * as React from 'react';
import { MapScreen } from '@screens';
import { Header } from '@components';
import { Pages } from '@config';

export default function Map() {
  return (
    <>
      <Header tab={Pages.MAP} />
      <MapScreen />
    </>
  );
}
