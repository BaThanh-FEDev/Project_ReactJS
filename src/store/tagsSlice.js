import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import postService from "../services/postService";
import tagService from "../services/tagService";
import { mappingPostData, mappingTagsData } from "../helpers/mapping";

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
      const data = response.data.map(mappingTagsData)
      return data;
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
      const data = response.data.map(mappingTagsData);
      
      return data;
    } catch (err) {
      console.log("err", err);
    }
  }
);

export const getPostByTags = createAsyncThunk(
  `${name}/getPostByTags`,
  async ({ slug, pageNumber, lang }) => {
    try {
      const response = await tagService.getTagBySlug({ slug, lang });

      if (response.data[0]) {
        const dataRes = mappingTagsData(response.data[0]) 
        const tagIdBySlug = dataRes.id;
        const responsePost = await postService.getByTag({
          id: tagIdBySlug,
          page: pageNumber,
        });
        const posts = responsePost.data || []
        const data = {
          nameTag: dataRes.name || slug,
          postListByTag: posts.map(mappingPostData),
          currentPage: pageNumber,
          totalPage: parseInt(responsePost.headers[`x-wp-totalpages`]),
        };
        return data;
      }
      else {
        return {
          nameTag: slug, // Nếu có lỗi, vẫn trả về slug làm nameTag
        };
      }
    } catch (err) {
      console.log("err", err);
      
    }
  }
);

export const createTag = createAsyncThunk(
  `${name}/createTag`,
  async (tagData, thunkAPI) => {
    try {
      const { dispatch } = thunkAPI;
      const response = await tagService.createTag({ tagData });
      const data = mappingTagsData(response.data)

      // dispatch(fetchTagsName());
      dispatch(fetchTagsAdminWithPaging());
      return data;
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
      const data = mappingTagsData(response.data);
      return data;
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
      const data = mappingTagsData(response.data);
      return data;
    } catch (err) {
      console.error("Error updating post:", err);
    }
  }
);

export const deleteTag = createAsyncThunk(
  `${name}/deleteTag`,
  async (tagId, thunkAPI) => {
    try {
      await tagService.deleteTag(tagId);

      // thunkAPI.dispatch(fetchTagsName());
      thunkAPI.dispatch(fetchTagsAdminWithPaging());
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
      const dataRes = response.data.map(mappingTagsData);
      return {
        listTags: dataRes,
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
        const { currentPage, postListByTag } = action.payload;
        state.tagData = {
          ...state.tagData,
          ...action.payload,
          postListByTag: currentPage === 1? postListByTag : [...state.tagData.postListByTag, ...postListByTag]
        }
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
