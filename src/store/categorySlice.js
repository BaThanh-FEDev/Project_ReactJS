import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import categoryService from "../services/categoryService";
import postService from "../services/postService";
import { mappingCategoryData, mappingPostData } from "../helpers/mapping";

const initialState = {
  categoryList: [],

  categoryEdit: [],

  categoryData: {
    nameCategory: "",
    postListByCate: [],
    totalPage: null,
    currentPage: 1,
  },

  categoriesData: {
    listCates: [],
    totalPage: 0,
    total: 0,
    currentPage: 1,
  },

};

const name = "category";

export const fetchCategory = createAsyncThunk(
  `${name}/fetchCategory`,
  async (newCategory) => {
    try {
      const response = await categoryService.getAllCategories();
      const dataRes = response.data.map(mappingCategoryData)
      if (newCategory) {
        const data = [...dataRes, ...newCategory];
        return data;
      } else {
        return dataRes;
      }
    } catch (err) {
      console.log("err", err);
    }
  }
);

export const getCategoryBySlug = createAsyncThunk(
  `${name}/getCategoryBySlug`,
  async ({ slug, pageNumber, lang }) => {
    try {
      const response = await categoryService.getCategoryBySlug({ slug, lang});
      
      if (response.data[0]) {
        const dataRes = mappingCategoryData(response.data[0])
        const categoryIdBySlug = dataRes.id;
        const responsePost = await postService.getByCategory({
          id: categoryIdBySlug,
          page: pageNumber,
        });
        const posts = responsePost.data || [];
        
        const data = {
          nameCategory: dataRes.name || slug,
          postListByCate: posts.map(mappingPostData),
          currentPage: pageNumber,
          totalPage: parseInt(responsePost.headers[`x-wp-totalpages`]),
        };
        return data;
      }
      else {
        return {
          nameCategory: slug, // Nếu có lỗi, vẫn trả về slug làm nameCategory
        };
      }
    } catch (err) {
      console.log("err", err);
      
    }
  }
);

export const createCategory = createAsyncThunk(
  `${name}/createCategory`,
  async (categoryData, thunkAPI) => {
    try {
      const response = await categoryService.createCategory(categoryData);
      // thunkAPI.dispatch(fetchCategory());
      thunkAPI.dispatch(fetchCatesAdminWithPaging());
      const data = mappingCategoryData(response.data)      
      return data;
    } catch (err) {
      return {
        status: false,
        error: err.response ? err.response.data : "Lỗi khi tạo danh mục",
      };
    }
  }
);

export const getCategoryById = createAsyncThunk(
  `${name}/getCategoryById`,
  async (categoryId) => {
    try {
      const response = await categoryService.getCategoryById(categoryId);
      const data = mappingCategoryData(response.data)
      return data;
    } catch (err) {
      console.log("err", err);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "posts/updateCategory",
  async ({ categoryId, values }, thunkAPI) => {
    try {
      const response = await categoryService.updateCategory({
        categoryId,
        values,
      });
      thunkAPI.dispatch(fetchCatesAdminWithPaging());
      const data = mappingCategoryData(response.data)
      return data;
    } catch (err) {
      console.error("Error updating post:", err);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  `${name}/deleteCategory`,
  async (categoryId, thunkAPI) => {
    try {
      await categoryService.deleteCategory(categoryId);
      // thunkAPI.dispatch(fetchCategory());
      thunkAPI.dispatch(fetchCatesAdminWithPaging());
    } catch (err) {
      console.log("err", err);
    }
  }
);

export const deleteMultipleCategories = createAsyncThunk(
  `${name}/deleteMultipleCategories`,
  async (selectedIdsCategories, thunkAPI) => {
    try {
      const deletePromises = selectedIdsCategories.map((categoryId) =>
        thunkAPI.dispatch(deleteCategory(categoryId))
      );
      await Promise.all(deletePromises);
      thunkAPI.dispatch(fetchCategory());
    } catch (err) {
      console.error("Lỗi khi xóa nhiều bài viết:", err);
    }
  }
);

export const fetchCatesAdminWithPaging = createAsyncThunk(
  `${name}/fetchCatesAdminWithPaging`,
  async (params = {}, thunkAPI) => {
    try {
      const { page, per_pager, search } = params;
      const response = await categoryService.getAllCateInAdmin(params)
      const total = parseInt(response.headers["x-wp-total"], 10);
      const totalPage = parseInt(response.headers["x-wp-totalpages"]);
      const data = response.data.map(mappingCategoryData);
      return {
        listCates: data,
        total,
        currentPage: page,
        totalPage,
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
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.categoryList = action.payload;
      })

      .addCase(getCategoryBySlug.fulfilled, (state, action) => {
        const { currentPage, postListByCate } = action.payload;
        state.categoryData = {
          ...state.categoryData,
          ...action.payload,
          postListByCate: currentPage === 1? postListByCate : [...state.categoryData.postListByCate, ...postListByCate]
        }
      })

      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.categoryEdit = action.payload;
      })

      .addCase(updateCategory.fulfilled, (state, action) => {
        const updatedCategory = action.payload;

        // Cập nhật bài viết trong chi tiết bài viết
        if (state.categoryEdit?.id === updatedCategory.id) {
          state.categoryEdit = updatedCategory;
        }
        // Cập nhật bài viết trong danh sách bài viết (nếu có)
        state.categoryList = state.categoryList.map((cate) =>
          cate.id === updatedCategory.id ? updatedCategory : cate
        );
      })

      .addCase(fetchCatesAdminWithPaging.fulfilled, (state, action) => {
        state.categoriesData = action.payload;
      });
  },
});

const { reducer, actions } = slice;
export default reducer;
