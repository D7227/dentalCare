import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import { orderApi } from "./slices/orderApi";
import { doctorAuthApi } from "./slices/doctorAuthApi";
import orderLocalReducer from "./slices/orderLocalSlice";
import { teamMemberApi } from "./slices/termMember";

// Combine all reducers (add more slices/APIs here)
const rootReducer = combineReducers({
  auth: authReducer,
  orderLocal: orderLocalReducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [doctorAuthApi.reducerPath]: doctorAuthApi.reducer,
  [teamMemberApi.reducerPath]: teamMemberApi.reducer,
  // Add more slices here
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "orderLocal"], // Persist auth and orderLocal
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/FLUSH",
          "persist/PURGE",
          "persist/REGISTER",
        ],
        ignoredPaths: ["_persist"],
      },
    })
      .concat(orderApi.middleware)
      .concat(doctorAuthApi.middleware)
      .concat(teamMemberApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// Optionally: setupListeners(store.dispatch); // For RTK Query
