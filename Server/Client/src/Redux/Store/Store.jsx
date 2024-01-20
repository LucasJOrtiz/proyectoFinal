import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../Reducer/Reducer';

export default function myStore(preloadedState) {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
    devTools: process.env.NODE_ENV !== 'production',
  });
  
  return store;
}