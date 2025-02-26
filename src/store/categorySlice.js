import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import categoryService from "../services/categoryService";
import postService from "../services/postService";

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
      if (newCategory) {
        const data = [...response.data, ...newCategory];
        return data;
      } else {
        return response.data;
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
      if (response.data) {
        const categoryIdBySlug = response.data[0].id;
        const responsePost = await postService.getByCategory({
          id: categoryIdBySlug,
          page: pageNumber,
        });
        
        const data = {
          nameCategory: response.data[0].name || slug,
          postListByCate: responsePost.data || [],
          pageNumber,
          totalPageCate: parseInt(responsePost.headers[`x-wp-totalpages`]),
        };
        return data;
      }
    } catch (err) {
      console.log("err", err);
      return {
        nameCategory: slug, // Nếu có lỗi, vẫn trả về slug làm nameCategory
      };
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

      return response.data;
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
      return response.data;
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
      return response.data;
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
      const data = response.data;
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
        const { nameCategory, totalPageCate, pageNumber, postListByCate } =
          action.payload;

        if (!Array.isArray(postListByCate)) {
          // Nếu không có postListByCate, gán lại mảng rỗng
          state.categoryData.postListByCate = [];
        } else {
          // Nếu có postListByCate hợp lệ, cập nhật lại nó
          state.categoryData.postListByCate =
            pageNumber === 1
              ? postListByCate
              : [...state.categoryData.postListByCate, ...postListByCate];
        }
        state.categoryData.nameCategory = nameCategory || "Default Category";
        state.categoryData.totalPage = totalPageCate;
        state.categoryData.currentPage = pageNumber;
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
