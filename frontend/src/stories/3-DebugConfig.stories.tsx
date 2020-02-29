import DebugConfig from 'components/common/DebugSetting';
import React from 'react';
import { Provider } from 'react-redux';
import store from 'store';

export default {
  title: 'DebugConfig',
  component: DebugConfig,
};

export const Text = () => (
  <Provider store={store}>
    <DebugConfig/>
  </Provider>
);
