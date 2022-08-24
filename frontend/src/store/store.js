import {configureStore} from '@reduxjs/toolkit'
import userStrikerReducer from './features/userStriker'
import groundReducer from './features/groundDetail'
import movingPuckReducer from './features/movingPuck'


const store = configureStore({
    reducer: {
        ground: groundReducer,
        userStriker: userStrikerReducer,
        movingPuck: movingPuckReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false})
})

export default store