import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import postService from "../services/postService";
import tagService from "../services/tagService";

const initialState = {
  tagsListOfPost: [],
  isLoading: false,

  tagData: {
    nameTag: "",
    postListByTag: [],
    totalPage: null,
    currentPage: 1,
  },

  tagsListAll: [],

  tagEdit: [],

  tagsData: {
    listTags: [],
    totalpages: 0,
    total: 0,
    currentPage: 1,
  },
};

const name = "tags";

export const fetchTagsName = createAsyncThunk(
  `${name}/fetchTagsName`,
  async () => {
    try {
      const response = await tagService.getAllTag();
      return response.data;
    } catch (err) {
      console.log("err", err);
    }
  }
);

export const getTagsByIdPost = createAsyncThunk(
  `${name}/getTagsByIdPost`,
  async (postId) => {
    try {
      const response = await tagService.getByIdPost(postId);
      return response.data;
    } catch (err) {
      console.log("err", err);
    }
  }
);

export const getPostByTags = createAsyncThunk(
  `${name}/getPostByTags`,
  async ({ slug, pageNumber }) => {
    try {
      const response = await tagService.getTagBySlug({ slug });

      if (response.data) {
        const tagIdBySlug = response.data[0].id;
        const responsePost = await postService.getByTag({
          id: tagIdBySlug,
          page: pageNumber,
        });

        const data = {
          nameTag: response.data[0].name || slug,
          postListByTag: responsePost.data || [],
          pageNumber,
          totalPageTag: parseInt(responsePost.headers[`x-wp-totalpages`]),
        };
        return data;
      }
    } catch (err) {
      console.log("err", err);
      return {
        nameTag: slug, // Nếu có lỗi, vẫn trả về slug làm nameTag
      };
    }
  }
);

export const createTag = createAsyncThunk(
  `${name}/createTag`,
  async (tagData, thunkAPI) => {
    try {
      const { dispatch } = thunkAPI;
      const response = await tagService.createTag({ tagData });

      // dispatch(fetchTagsName());
      dispatch(fetchTagsAdminWithPaging());
      return response.data;
    } catch (err) {
      return {
        status: false,
        error: err.response ? err.response.data : "Lỗi khi tạo danh mục",
      };
    }
  }
);

export const getTagById = createAsyncThunk(
  `${name}/getTagById`, // action type
  async (tagId) => {
    try {
      const response = await tagService.getTagById(tagId);
      return response.data;
    } catch (err) {
      console.log("err", err);
    }
  }
);

export const updateTag = createAsyncThunk(
  "posts/updateTag",
  async ({ tagId, values }) => {
    try {
      const response = await tagService.updateTag({ tagId, values });
      return response.data;
    } catch (err) {
      console.error("Error updating post:", err);
    }
  }
);

export const deleteTag = createAsyncThunk(
  `${name}/deleteTag`,
  async (tagId, thunkAPI) => {
    try {
      const response = await tagService.deleteTag(tagId);

      // thunkAPI.dispatch(fetchTagsName());
      thunkAPI.dispatch(fetchTagsAdminWithPaging());

      return response.data;
    } catch (err) {
      console.log("err", err);
    }
  }
);

export const deleteMultipleTags = createAsyncThunk(
  `${name}/deleteMultipleTags`,
  async (selectedIdsTags, thunkAPI) => {
    try {
      const deletePromises = selectedIdsTags.map((tagId) =>
        thunkAPI.dispatch(deleteTag(tagId))
      );
      await Promise.all(deletePromises);
      thunkAPI.dispatch(fetchTagsName());
    } catch (err) {
      console.error("Lỗi khi xóa nhiều bài viết:", err);
    }
  }
);

export const fetchTagsAdminWithPaging = createAsyncThunk(
  `${name}/fetchTagsAdminWithPaging`,
  async (params = {}, thunkAPI) => {
    try {
      const { page, per_pager, search } = params;
      const response = await tagService.getAllTagInAdmin(params)
      const total = parseInt(response.headers["x-wp-total"], 10);
      const totalpages = parseInt(response.headers["x-wp-totalpages"]);
      const data = response.data;
      return {
        listTags: data,
        total,
        currentPage: page,
        totalpages,
      };
    } catch (err) {
      console.log("Error fetching tags:", err);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const slice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTagsByIdPost.fulfilled, (state, action) => {
        state.tagsListOfPost = action.payload || [];
        state.isLoading = false;
      })
      .addCase(getPostByTags.fulfilled, (state, action) => {
        const { nameTag, totalPageTag, pageNumber, postListByTag } =
          action.payload;

        if (!Array.isArray(postListByTag)) {
          // Nếu không có postListByTag, gán lại mảng rỗng
          state.tagData.postListByTag = [];
        } else {
          // Nếu có postListByTag hợp lệ, cập nhật lại nó
          state.tagData.postListByTag =
            pageNumber === 1
              ? postListByTag
              : [...state.tagData.postListByTag, ...postListByTag];
        }
        state.tagData.nameTag = nameTag || "Default Tag";
        state.tagData.totalPage = totalPageTag;
        state.tagData.currentPage = pageNumber;
      })

      .addCase(fetchTagsName.fulfilled, (state, action) => {
        state.tagsListAll = action.payload;
      })
      .addCase(getTagById.fulfilled, (state, action) => {
        state.tagEdit = action.payload;
      })
      .addCase(updateTag.fulfilled, (state, action) => {
        const updateTag = action.payload;

        // Cập nhật bài viết trong chi tiết bài viết
        if (state.tagEdit?.id === updateTag.id) {
          state.tagEdit = updateTag;
        }

        // Cập nhật bài viết trong danh sách bài viết (nếu có)
        // state.tagsListAll = state.tagsListAll.map((tag) =>
        //   tag.id === updateTag.id ? updateTag : tag
        // );
        state.tagsData.listTags = state.tagsData.listTags.map((tag) =>
          tag.id === updateTag.id ? updateTag : tag
        );
      })
      .addCase(fetchTagsAdminWithPaging.fulfilled, (state, action) => {
        state.tagsData = action.payload;
      });
  },
});

const { reducer, actions } = slice;
export default reducer;
