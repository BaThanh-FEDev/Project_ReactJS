import { configureStore } from "@reduxjs/toolkit"
import postReducer from "./postSlice"
import categoryReducer from "./categorySlice"
import tagReducer from "./tagsSlice"
import userReducer from "./userSlice"
import menuReducer from "./menuSlice"
import commentReducer from "./commentSlice"
import configReducer from "./configSlice"

const store = configureStore({
    reducer: {
        POST: postReducer,
        CATEGORY: categoryReducer,
        TAG: tagReducer,
        MENU: menuReducer,
        USER: userReducer,
        COMMENT: commentReducer,
        CONFIG: configReducer
    },
})

export default store