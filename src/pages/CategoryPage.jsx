import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ArticleItem from "../components/ArticleItem";
import Button from "../components/shared/Button";
import MainTitle from "../components/shared/MainTitle";
import { getCategoryBySlug } from "../store/categorySlice";
import { Spin } from "antd";
import "./csspage/page.css";
import { t } from "i18next";

function CategoryPage() {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const lang = useSelector((state) => state.CONFIG.lang);
  const [loading, setLoading] = useState(false);
  const [isFirstLoading, setIsFirstLoading] = useState(true);

  const { nameCategory, postListByCate, currentPage: pageNumber, totalPage } = useSelector(
    (state) => state.CATEGORY.categoryData
  );
  
  useEffect(() => {
    if (slug) {
      setIsFirstLoading(true); // Bật loading khi bắt đầu fetch
      dispatch(getCategoryBySlug({ slug, pageNumber: 1, lang })).finally(() =>
        setIsFirstLoading(false)
      );
    }
  }, [slug, dispatch, lang]);

  if (isFirstLoading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  const handleLoadMore = () => {
    setLoading(true);
    dispatch(getCategoryBySlug({ slug, pageNumber: pageNumber + 1 })).finally(
      () => setLoading(false)
    );
  };

  return (
    <div className="articles-list section">
      <div className="tcl-container">
        <MainTitle> {t("nameCate")}: {nameCategory || slug} </MainTitle>

        <div className="tcl-row tcl-jc-center">
          {postListByCate.length ? (
            postListByCate.map((item, index) => (
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
            <h2>{t("resultCate")}</h2>
          )}
        </div>

        {pageNumber < totalPage && (
          <div className="text-center">
            <Button onClick={handleLoadMore} type="primary" size="large" loading={loading} disabled={loading}>
              {t("viewMore")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
