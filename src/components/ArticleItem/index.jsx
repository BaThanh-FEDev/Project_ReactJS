import cls from "classnames";
import ArticleItemCategories from "./ArticleItemCategories";
import ArticleItemDesc from "./ArticleItemDesc";
import ArticleItemInfo from "./ArticleItemInfo";
import ArticleItemStats from "./ArticleItemStats";
import ArticleItemThumb from "./ArticleItemThumb";
import ArticleItemTitle from "./ArticleItemTitle";
import "./article-item.css";
import { useState } from "react";

export default function ArticleItem({
  isStyleRow = false,
  isStyleCard = false,
  isShowDesc = false,
  isShowCategoies = false,
  isShowAvatar = true,
  isShowButton = false,
  // title, name, date, image, avatar, link, desc, view, status,
  data,
  valueSearch = "",
}) {
  
  const classes = cls("article-item", {
    "style-card": isStyleCard,
    "style-row": isStyleRow,
  });

  if (!data) return <></>;
  const postId = data.id;
  
  
  const name = data.author_data.nickname;
  const avatar = data.author_data.avatar;
  const image = data.featured_media_url;
  const view = data.view_count;
  const desc = data.excerpt.rendered;
  const categories = data.categories;
  const slug = data.slug;
  const date = data.date;
  const title = data.title.rendered;

  return (
    <article className={classes}>
      <ArticleItemThumb image={image} slug={slug}/>
      <div className="article-item__content">
        {isShowCategoies && <ArticleItemCategories categories={categories} />}
        {isShowCategoies && <ArticleItemStats view={view} />}

        <ArticleItemTitle slug={slug} title={title} valueSearch={valueSearch} />

        {isShowDesc && <ArticleItemDesc desc={desc} valueSearch={valueSearch} />}

        <ArticleItemInfo
          name={name}
          date={date}
          avatar={avatar}
          isShowAvatar={isShowAvatar}
        />
      </div>
    </article>
  );
}
