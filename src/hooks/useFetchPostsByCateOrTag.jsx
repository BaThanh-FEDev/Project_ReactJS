import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPostsByType } from "../store/fetchAction";
import { Spin } from "antd";

const useFetchPosts = ({ type, slug, pageNumber, lang }) => {
  const dispatch = useDispatch();
  const [isFirstLoading, setIsFirstLoading] = useState(true);

  const data = useSelector((state) => 
    type === "category" ? state.fetchAction.categoryData : state.fetchAction.tagData
  );
  

  useEffect(() => {
    if (slug) {
      dispatch(getPostsByType({ type, slug, pageNumber, lang })).finally(() => setIsFirstLoading(false));
    }
  }, [type, slug, pageNumber, lang, dispatch]);

  if (isFirstLoading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return { data, isFirstLoading };
};

export default useFetchPosts;
