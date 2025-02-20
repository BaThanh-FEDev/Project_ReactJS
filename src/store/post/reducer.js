import { createReducer } from "@reduxjs/toolkit";
import {
  actGetIDPost,
  actGetSlug,
  actPostGeneral,
  actPostNew,
  actPostPoPular,
  actPostRelated,
} from "./actions";

const initialState = {
  postsNew: [],
  postsPopular: [],
  postsGeneral: [],
  // postDetail: null,
  slugPost: null,
  postRelated: [],
};

const reducer = createReducer(initialState, (builer) => {
  builer.addCase(actPostNew, (state, action) => {
    state.postsNew = action.payload;
  });
  builer.addCase(actPostPoPular, (state, action) => {
    state.postsPopular = action.payload;
  });
  builer.addCase(actPostGeneral, (state, action) => {
    state.postsGeneral = [...state.postsGeneral, ...action.payload];
  });
  builer.addCase(actGetSlug, (state, action) => {
    state.slugPost = action.payload[0];
  });
  builer.addCase(actPostRelated, (state, action) => {
    state.postRelated = action.payload;
  });
  builer.addCase(actGetIDPost, (state, action) => {
    state.idPost = action.payload[0].id;
  });
});

export default reducer;
