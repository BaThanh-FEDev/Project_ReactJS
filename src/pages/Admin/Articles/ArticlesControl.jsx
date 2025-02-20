import { Button, message, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteMultipleArticles, fetchAllPosts, getArticlesByCateOrTag } from "../../../store/postSlice";
import "./articles.css";

function ArticlesControl({selectedArticleIds, setSelectedRowKeys, setSelectedArticleIds }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const tagsList = useSelector((state) => state.TAG.tagsListAll);
    const categoryList = useSelector((state) => state.CATEGORY.categoryList);
  
    const getOptions = (list) => list.map(({ id, name }) => ({ value: String(id), label: name }));
  
    const [newFilter, setNewFilter] = useState({ categories: [], tags: [] });
  
    useEffect(() => {
      const params = new URLSearchParams();
      if (newFilter.categories.length > 0) params.set('categories', newFilter.categories.join(','));
      if (newFilter.tags.length > 0) params.set('tags', newFilter.tags.join(','));
      navigate(`/admin/articles${params.toString() ? `?${params.toString()}` : ''}`);
    }, [newFilter, navigate]);
  
    const handleChange = (value, name) => {
      setNewFilter((prev) => {
        const updatedFilter = { ...prev, [name]: value };
        if (updatedFilter.categories.length === 0 && updatedFilter.tags.length === 0) {
          dispatch(fetchAllPosts({ pageNumber: 1 }));  // Sửa lại action fetchAllPosts ở đây
        } else {
          dispatch(getArticlesByCateOrTag(updatedFilter));
        }
        return updatedFilter;
      });
    };

    const handledeleteArticle = () => {
      if ( selectedArticleIds.length > 0) {
        dispatch(deleteMultipleArticles(selectedArticleIds))
          .then(() => {
            setSelectedArticleIds([]); 
            setSelectedRowKeys([]);
            message.success("Đã xoá bài viết thành công.");
          })
      } else {
        message.warning("Chưa có bài viết nào được chọn.");
      }
    };
  
    return (
      <div className="handleControl">
        
        <div>
        <Button className="deleteArticle" type="" danger onClick={handledeleteArticle}>
          Delete selected articles
        </Button>
        </div>

        <div className="filterWrapper">
          <div className="filterInput">
            <span>Categories:</span>
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Lọc categories"
              onChange={(value) => handleChange(value, 'categories')}
              options={getOptions(categoryList)}
            />
          </div>
          <div className="filterInput">
            <span>Tags:</span>
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Lọc tags"
              onChange={(value) => handleChange(value, 'tags')}
              options={getOptions(tagsList)}
            />
          </div>
        </div>
      </div>
    );
  }

export default ArticlesControl;
