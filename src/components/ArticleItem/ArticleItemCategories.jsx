import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCategory } from "../../store/categorySlice";

export default function ArticleItemCategories({ categories }) {
  const dispatch = useDispatch();
  const categoryList = useSelector((state) => state.CATEGORY.categoryList);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const lang = useSelector((state) => state.CONFIG.lang);

  // useEffect(() => {
  //   dispatch(fetchCategory());
  // }, [lang, dispatch]);

  useEffect(() => {
    if (categoryList.length > 0) {
      const newCategoryList = categories
        .map((categoryId) => categoryList.find((item) => item.id === categoryId))
        .filter(Boolean);
      setFilteredCategories(newCategoryList);
    }
  }, [categoryList, categories]); // Chạy lại khi Redux cập nhật categoryList

  // const newCagoryList = [];
  // duyet id
  // categories.forEach((categoryId) => {
  //   const categoryItem = categoryList.find((item) => item.id === categoryId);
  //   newCagoryList.push(categoryItem);
  //   console.log(categoryItem);
  // })


  if (categoryList.length === 0) return <></>;
  
  return (
    <ul className="article-item__categories">
      {filteredCategories.map((item, index) => (
        <li key={index}>
          <Link to={`/category/${item.slug || ""}`} className="btn btn-category">
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
