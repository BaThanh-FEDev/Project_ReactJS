import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import commentService from "../services/commentService";

const initialState = {
  commentList: [],
  totalPageComment: 0,
  totalComment: 0,
  currentPageComment: 1,

  commentReplayList: [],

  newComment: "",
  newReplayComment: "",
  parentId: null,
  isFocus: "",
};

const name = "comment";

export const fetchComments = createAsyncThunk(
  `${name}/fetchComments`, // action type
  async (params) => {
    try {
      const response = await commentService.getComments(params)

      const data = {
        commentList: response.data,
        currentPage: params.currentPage,
        totalComment: parseInt(response.headers[`x-wp-total`]),
        totalPageComment: parseInt(response.headers[`x-wp-totalpages`]),
      };
      return data;
    } catch (err) {
      console.log("err", err);
    }
  }
);

export const fetchChildComments = createAsyncThunk(
  `${name}/fetchChildComments`, // action type
  async (params) => {
    try {
      const response = await commentService.getChildComments(params);
      return response.data;
    } catch (err) {
      console.log("err", err);
    }
  }
);

export const postNewOrReplayComment = createAsyncThunk(
  `${name}/postNewOrReplayComment`,
  async (data) => {
    try {
      const response = await commentService.postNewOrReplay(data);
      return response.data;
    } catch (err) {
      console.log("err", err);
    }
  }
);

const slice = createSlice({
  name,
  initialState,
  reducers: {
    getParentId(state, action) {
      state.parentId = action.payload;
    },
    isFocusForm(state, action) {
      state.isFocus = action.payload;
    },

    resetFocus(state) {
      console.log("resetFocus");

      state.isFocus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.fulfilled, (state, action) => {
        const { commentList, currentPage, totalPageComment, totalComment } =
          action.payload;
        state.commentList =
          currentPage === 1
            ? commentList
            : [...state.commentList, ...commentList];
        state.totalPageComment = totalPageComment;
        state.totalComment = totalComment;
        state.currentPageComment = currentPage;
        if (currentPage === 1) state.commentReplayList = [];
      })
      .addCase(fetchChildComments.fulfilled, (state, action) => {
        state.commentReplayList = [
          ...state.commentReplayList,
          ...action.payload,
        ];
      })
      .addCase(postNewOrReplayComment.fulfilled, (state, action) => {
        if (action.payload.parent === 0) {
          state.newComment = action.payload;
          state.commentList = [...state.commentList, action.payload];
        } else {
          state.newReplayComment = action.payload;
          state.commentReplayList = [
            ...state.commentReplayList,
            action.payload,
          ];
        }
      });
  },
});

const { reducer, actions } = slice;

export const { getParentId, isFocusForm, resetFocus } = actions;

export default reducer;
