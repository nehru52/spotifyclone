import * as React from 'react';
import { BookingScreen } from '@screens';
import { Header } from '@components';
import { Pages } from '@config';

export default function Booking() {
  return (
    <>
      <Header tab={Pages.BOOKING} />
      <BookingScreen />
    </>
  );
}
