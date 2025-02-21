import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../services/api";
import { fetchComments } from "./commentSlice";
import detailService from "../services/detailService";
import postService from "../services/postService";

const initialState = {
  postsNew: [],
  postsPopular: [],
  postRelated: [],
  postsGeneral: {
    postsList: [],
    totalPage: null,
    currentPage: 1,
    currentLang: "",
  },

  postDetail: null,
  postDetailEdit: null,

  postSearch: {
    searchList: [],
    totalPage: null,
    currentPage: 1,
  },

  postAll: {
    allPostsList: [],
    totalPage: null,
    currentPage: 1,
  },
  

  url: "",
  loading: false,
  error: null,
};

const name = "posts";

export const fetchAllPosts = createAsyncThunk(
  `${name}/fetchAllPosts`,
  async (params = {}, { dispatch }) => {
    try {
      dispatch(resetAllPosts());
      const response = await postService.getAllPosts(params)
      const totalPage = parseInt(response.headers[`x-wp-totalpages`]);
      const data = {
        allPostsList: response.data,
        totalPage,
        pageNumber: params.pageNumber,
      };
      return data;
    } catch (err) {
      console.log("err", err);
    }
  }
);

export const fetchLatestPosts = createAsyncThunk(
  `${name}/fetchLatestPosts`, 
  async (params = {}, thunkAPI) => {
    try {
      // const { getState } = thunkAPI;
      // const lang = getState().CATEGORY.lang;
      const response = await postService.getLatest({ ...params });
      return response.data;
    } catch (err) {
      console.log("err", err);
    }
  }
);

export const fetchPopularPost = createAsyncThunk(
  `${name}/fetchPopularPost`,
  async (params = {}) => {
    try {
      const response = await postService.getPopular({...params});
      return response.data;
    } catch (err) {
      console.log("err", err);
    }
  }
);

export const fetchGeneralPost = createAsyncThunk(
  `${name}/fetchGeneralPost`,
  async ({ pageNumber, lang }) => {
    try {
      const response = await postService.getGeneral({ page: pageNumber, lang });
      const totalPage = response.headers[`x-wp-totalpages`];
      const data = {
        postsGeneral: response.data,
        totalPageGeneral: totalPage,
        pageNumberGeneral: pageNumber,
        lang,
      };

      return data;
    } catch (err) {
      console.log("err", err);
    }
  }
);

export const fetchRelatedPosts = createAsyncThunk(
  `${name}/fetchRelatedPosts`, 
  async (params) => {
    try {
      const response = await postService.getRelated(params);
      return response.data;
    } catch (err) {
      console.log("err", err);
    }
  }
);

export const searchPostByKeyword = createAsyncThunk(
  `${name}/searchPostByKeyword`,
  async (params) => {
    try {
      const response = await postService.getBySearch(params)
      if (response) {
        const data = {
          postSearch: response.data,
          pageNumberSearch: params.pageNumber,
          totalPageSearch: parseInt(response.headers[`x-wp-totalpages`]),
        };
        return data;
      }
    } catch (err) {
      console.log("err", err);
    }
  }
);

export const getPostDetail = createAsyncThunk(
  `${name}/getPostDetail`, 
  async (slug, thunkAPI) => {
    try {
      const { dispatch } = thunkAPI;
      const response = await detailService.getDetail(slug);
      const idPost = response.data[0].id;

      await dispatch(fetchComments({ idPost, currentPage: 1 }));
      return response.data[0];
    } catch (err) {
      console.log("err", err);
    }
  }
);

export const getArticleById = createAsyncThunk(
  `${name}/getArticleById`, 
  async (postId) => {
    try {
      const response = await postService.getById(postId);
      return response.data;
    } catch (err) {
      console.log("err", err);
    }
  }
);

export const updateArticle = createAsyncThunk(
  "posts/updateArticle",
  async ({ postId, values }, { rejectWithValue }) => {
    try {
      const response = await postService.updatePost({ postId, values })
      return response.data;
    } catch (err) {
      console.error("Error updating post:", err);
      return rejectWithValue(
        err.response?.data || "Có lỗi xảy ra khi cập nhật bài viết"
      );
    }
  }
);

export const createArticle = createAsyncThunk(
  `${name}/createArticle`,
  async ({ values, lang }) => {
    try {
      const response= await postService.createPost({values, lang})
      return response.data;
    } catch (err) {
      console.log("err:", err);
    }
  }
);

export const deleteArticle = createAsyncThunk(
  `${name}/deleteArticle`,
  async (postId, thunkAPI) => {
    try {
      await postService.deletePost(postId);
      thunkAPI.dispatch(fetchAllPosts({ pageNumber: 1 }));
    } catch (err) {
      console.log("err", err);
    }
  }
);

export const deleteMultipleArticles = createAsyncThunk(
  `${name}/deleteMultipleArticles`,
  async (selectedIdsArticles, thunkAPI) => {
    try {
      const deletePromises = selectedIdsArticles.map((postId) =>
        thunkAPI.dispatch(deleteArticle(postId))
      );
      await Promise.all(deletePromises);
      thunkAPI.dispatch(fetchAllPosts({ pageNumber: 1 }));
    } catch (err) {
      console.error("Lỗi khi xóa nhiều bài viết:", err);
    }
  }
);

export const getArticlesByCateOrTag = createAsyncThunk(
  `${name}/getArticlesByCateOrTag`,
  async (params, { dispatch }) => {
    try {
      const { categories, tags } = params;
      const response = await postService.getByCateOrTag({ categories, tags })
      dispatch(setAllPosts(response.data));
    } catch (err) {
      console.log("err", err);
    }
  }
);

const slice = createSlice({
  name,
  initialState,
  reducers: {
    setAllPosts: (state, action) => {
      state.postAll.allPostsList = action.payload; // Cập nhật toàn bộ danh sách
    },
    resetAllPosts: (state) => {
      state.postAll.allPostsList = []; // Reset khi cần
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLatestPosts.fulfilled, (state, action) => {
        state.postsNew = action.payload;
      })
      .addCase(fetchPopularPost.fulfilled, (state, action) => {
        state.postsPopular = action.payload;
      })
      .addCase(fetchGeneralPost.fulfilled, (state, action) => {
        const { pageNumberGeneral, postsGeneral, totalPageGeneral, lang } =
          action.payload;

        // Nếu ngôn ngữ thay đổi, xoá dữ liệu cũ hoàn toàn
        if (state.postsGeneral.currentLang !== lang) {
          state.postsGeneral.postsList = []; // Xoá toàn bộ dữ liệu cũ
          state.postsGeneral.totalPage = 0;
          state.postsGeneral.currentPage = 1;
          state.postsGeneral.currentLang = lang; // Cập nhật ngôn ngữ hiện tại
        }

        // Load thêm hoặc gán dữ liệu mới
        state.postsGeneral.postsList =
          pageNumberGeneral === 1
            ? postsGeneral
            : [...state.postsGeneral.postsList, ...postsGeneral];

        state.postsGeneral.totalPage = totalPageGeneral;
        state.postsGeneral.currentPage = pageNumberGeneral;
      })
      .addCase(getPostDetail.fulfilled, (state, action) => {
        state.postDetail = action.payload;
      })
      .addCase(getArticleById.fulfilled, (state, action) => {
        state.postDetailEdit = action.payload;
      })
      .addCase(fetchRelatedPosts.fulfilled, (state, action) => {
        state.postRelated = action.payload;
      })
      .addCase(searchPostByKeyword.fulfilled, (state, action) => {
        const { postSearch, pageNumberSearch, totalPageSearch } = action.payload;

        state.postSearch.searchList = postSearch;
        state.postSearch.totalPage = totalPageSearch;
        state.postSearch.currentPage = pageNumberSearch;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        if (!action.payload) return;
        const { pageNumber, allPostsList, totalPage } = action.payload;
        state.postAll.allPostsList = allPostsList;
        state.postAll.totalPage = totalPage;
        state.postAll.currentPage = pageNumber;
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        const updatedPost = action.payload;

        // Cập nhật bài viết trong chi tiết bài viết
        if (state.postDetailEdit?.id === updatedPost.id) {
          state.postDetailEdit = updatedPost;
        }

        // Cập nhật bài viết trong danh sách bài viết (nếu có)
        state.postAll.allPostsList = state.postAll.allPostsList.map((post) =>
          post.id === updatedPost.id ? updatedPost : post
        );
      });
  },
});

const { reducer, actions } = slice;
export const { setAllPosts, resetAllPosts } = actions;
export default reducer;
