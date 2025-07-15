import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { orderApi } from './slices/orderApi';
import { doctorAuthApi } from './slices/doctorAuthApi';
import { userDataReducer } from './slices';
import { userDataApi } from './slices/userDataSlice';
import orderLocalReducer from './slices/orderLocalSlice';

// Combine all reducers (add more slices/APIs here)
const rootReducer = combineReducers({
  [orderApi.reducerPath]: orderApi.reducer,
  orderLocal: orderLocalReducer,
  [doctorAuthApi.reducerPath]: doctorAuthApi.reducer,
  [userDataApi.reducerPath]: userDataApi.reducer,
  userData: userDataReducer,
  // Add more slices here
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'orderLocal', 'userData'], // Persist auth, orderLocal, userData
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/FLUSH',
          'persist/PURGE',
          'persist/REGISTER',
        ],
        ignoredPaths: ['_persist'],
      },
    })
      .concat(orderApi.middleware)
      .concat(doctorAuthApi.middleware)
      .concat(userDataApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// Optionally: setupListeners(store.dispatch); // For RTK Query 