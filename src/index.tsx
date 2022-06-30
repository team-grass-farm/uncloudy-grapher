import 'antd/dist/antd.css';

import { ConfigProvider } from 'antd';
import locale from 'antd/lib/locale/ko_KR';
import { ArcElement, Chart, DoughnutController } from 'chart.js';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'styled-components';

import Screens from './screens';
import { persistor, store } from './stores';
import GlobalStyles from './styles/global';
import theme from './styles/theme';

Chart.register(ArcElement, DoughnutController);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <ConfigProvider locale={locale}>
            <GlobalStyles />
            <BrowserRouter>
              <Screens />
            </BrowserRouter>
          </ConfigProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
