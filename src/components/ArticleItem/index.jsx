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
  
  
  const name = data.authorData.nickname;
  const avatar = data.authorData.avatar;
  const image = data.image;
  const view = data.viewCount;
  const desc = data.description;
  const categories = data.categoryIds;
  const slug = data.slug;
  const date = data.publishDate;
  const title = data.title;

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
