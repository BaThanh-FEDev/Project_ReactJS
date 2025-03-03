import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { mappingCategoryData, mappingPostData, mappingTagsData } from "../helpers/mapping";
import categoryService from "../services/categoryService";
import tagService from "../services/tagService";
import postService from "../services/postService";

export const getPostsByType = createAsyncThunk(
  "fetchAction/getPostsByType",
  async ({ type, slug, pageNumber, lang }, { rejectWithValue }) => {
    try {
      let response;
      let dataRes;
      let idBySlug;

      if (type === "categories") {
        response = await categoryService.getCategoryBySlug({ slug, lang });
        if (!response.data[0]) return rejectWithValue({ error: "Category not found", slug });

        dataRes = mappingCategoryData(response.data[0]);
        idBySlug = dataRes.id;
      } else if (type === "tags") {
        response = await tagService.getTagBySlug({ slug, lang });
        if (!response.data[0]) return rejectWithValue({ error: "Tag not found", slug });

        dataRes = mappingTagsData(response.data[0]);
        idBySlug = dataRes.id;
      } else {
        return rejectWithValue({ error: "Invalid type", type });
      }

      // Gọi API lấy bài viết theo category hoặc tag
      const responsePost = await postService[type === "categories" ? "getByCategory" : "getByTag"]({
        id: idBySlug,
        page: pageNumber,
      });

      const posts = responsePost.data || [];
      return {
        name: dataRes.name || slug,
        postList: posts.map(mappingPostData),
        pageNumber,
        totalPage: parseInt(responsePost.headers[`x-wp-totalpages`], 10) || 0,
        type,
      };
    } catch (err) {
      console.error(`Error fetching ${type}:`, err);
      return rejectWithValue({ error: err.message, slug, type });
    }
  }
);

const initialState = {
  categoryData: {
    nameCategory: "",
    postList: [],
    totalPage: 0,
    currentPage: 1,
  },
  tagData: {
    nameTag: "",
    postList: [],
    totalPage: 0,
    currentPage: 1,
  },
};

const fetchActionSlice = createSlice({
  name: "fetchAction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPostsByType.fulfilled, (state, action) => {

      if (action.meta.arg.type === "categories") {
        state.categoryData = action.payload; // Cập nhật dữ liệu category
      } else {
        state.tagData = action.payload; // Cập nhật dữ liệu tag
      }
    });
  },
});

export default fetchActionSlice.reducer;
