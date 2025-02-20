import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ArticleItem from "../components/ArticleItem";
import Button from "../components/shared/Button";
import MainTitle from "../components/shared/MainTitle";
import { getPostByTags } from "../store/tagsSlice";
import { Spin } from "antd";
import "./csspage/page.css";
import { t } from "i18next";

function TagsPage() {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const [loading, setLoading] = useState(false);

  const { postListByTag, nameTag, currentPage, totalPage } = useSelector(
    (state) => state.TAG.tagData
  );

  useEffect(() => {
    if (slug) dispatch(getPostByTags({ slug, pageNumber: 1 }));
  }, [slug, dispatch]);

  if (!postListByTag) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  const handleLoadMore = () => {
    setLoading(true);
    dispatch(getPostByTags({ slug, pageNumber: currentPage + 1 })).finally(
      () => setLoading(false)
    );
  };

  return (
    <div className="articles-list section">
      <div className="tcl-container">
        <MainTitle>{t("nameTag")}: {nameTag || slug} </MainTitle>

        <div className="tcl-row tcl-jc-center">
          {postListByTag.length ? (
            postListByTag.map((item, index) => (
              <div key={index} className="tcl-col-12 tcl-col-md-8">
                <ArticleItem
                  data={item}
                  isStyleCard
                  isShowCategoies
                  isShowAvatar={false}
                  isShowDesc={false}
                />
              </div>
            ))
          ) : (
            <h2>{t("resultTag")}</h2>
          )}
        </div>

        {currentPage < totalPage && (
          <div className="text-center">
            <Button onClick={handleLoadMore} type="primary" size="large" loading={loading} disabled={loading}>
              Tải thêm
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TagsPage;
