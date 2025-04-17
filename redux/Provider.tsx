"use client";
import React from 'react'
import { Provider } from 'react-redux'
import store, { } from './store'
import { persistor } from './store'
import { PersistGate } from 'redux-persist/integration/react'


const ReduxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
     <Provider store={store}>
          <PersistGate loading={<div>LOADING</div>} persistor={persistor}>
         {children}
         </PersistGate>
        </Provider>

  )
}

export default ReduxProvider