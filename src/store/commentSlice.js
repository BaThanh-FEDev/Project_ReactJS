import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import commentService from "../services/commentService";

const initialState = {
  commentData: {
    commentList: [],
    totalComment: null,
    currentPage: 1,
  },
  

  commentReplayList: [],
  newReplayComment: "",
  parentId: null,
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
    getParentIdComment(state, action) {
      state.parentId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.fulfilled, (state, action) => {
        const { commentList, currentPage, totalComment } =
          action.payload;
        state.commentData.commentList =
          currentPage === 1
            ? commentList
            : [...state.commentData.commentList, ...commentList];
        state.commentData.totalComment = totalComment;
        state.commentData.currentPage = currentPage;
        if (currentPage === 1) state.commentReplayList = [];
        
      })
      .addCase(fetchChildComments.fulfilled, (state, action) => {
        const newComments = action.payload.filter(
          (newComment) => !state.commentReplayList.some(
            (existingComment) => existingComment.id === newComment.id
          )
        );
        state.commentReplayList = [...state.commentReplayList, ...newComments];
      })
      .addCase(postNewOrReplayComment.fulfilled, (state, action) => {
        if (action.payload.parent === 0) {
          state.commentData.commentList = [action.payload, ...state.commentData.commentList ];
        } else {
          state.newReplayComment = action.payload;
          const isExistingComment = state.commentReplayList.some(comment => comment.id === action.payload.id);

    if (!isExistingComment) {
      state.commentReplayList = [action.payload, ...state.commentReplayList] ;
    }
        }
      });
  },
});

const { reducer, actions } = slice;

export const { getParentIdComment } = actions;

export default reducer;
