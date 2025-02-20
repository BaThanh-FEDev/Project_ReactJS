/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLatestPosts } from "../../store/postSlice";
import ArticleItem from "../ArticleItem";
import MainTitle from "../shared/MainTitle";
import "./latest-news-list.css";
import { t } from "i18next";

function ArticleLatest() {
  const dispatch = useDispatch();
  const postsNew = useSelector((state) => state.POST.postsNew);
  const lang = useSelector((state) => state.CONFIG.lang);

  useEffect(() => {
    dispatch(fetchLatestPosts());
  }, [lang]);

  return (
    <div className="latest-news section">
      <div className="tcl-container">
        <MainTitle>{t("newArticles")}</MainTitle>
        <div className="latest-news__list spacing">
          {postsNew.map((item, index) => {
            return (
              <div key={index} className="latest-news__card">
                <ArticleItem data={item} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ArticleLatest;
