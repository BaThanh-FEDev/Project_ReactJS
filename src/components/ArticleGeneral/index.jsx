import { t } from "i18next";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { usePostsPaging } from "../../hooks/usePostsPaging";
import { fetchPagingPost } from "../../store/postSlice";
import ArticleItem from "../ArticleItem";
import MainTitle from "../shared/MainTitle";

function ArticleGeneral() {
  const dispatch = useDispatch();
  const { lang, posts, showButtonLoadMore } = usePostsPaging();

  useEffect(() => {
    dispatch(fetchPagingPost({ pageNumber: 1, lang }));
  }, [lang]);

  return (
    <div className="articles-list section">
      <div className="tcl-container">
        <MainTitle>{t("generalArticles")}</MainTitle>
        <div className="tcl-row">
          {posts.map((item, index) => {
            return (
              <div key={index} className="tcl-col-12 tcl-col-md-6">
                <ArticleItem isStyleCard isShowAvatar={false} data={item} />
              </div>
            );
          })}
        </div>
        <div className="text-center">{showButtonLoadMore()}</div>
      </div>
    </div>
  );
}

export default ArticleGeneral;
