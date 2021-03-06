import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { chatsReducer } from './reducers/chats.jsx';
import { messagesReducer } from './reducers/messages.jsx'
import { profileReducer } from './reducers/profile.jsx';

const persistConfig = {
    key: 'root',
    storage,
}

const rootReducer = combineReducers({
    chatsReducer,
    messagesReducer,
    profileReducer,
});

/* const persistedReducer = persistReducer(persistConfig, rootReducer); */

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
    /* persistedReducer */rootReducer,
    composeEnhancers(applyMiddleware(thunk))
)

/* export const persistor = persistStore(store); */