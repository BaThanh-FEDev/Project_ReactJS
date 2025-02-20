import { Link } from "react-router-dom";

export default function ArticleItemTitle(props) {
  const { slug, title, valueSearch } = props;

  // xử lý trường hợp highligh từ khóa khi search
  let titleRender = title;
  
  if (valueSearch) {
    const regex = new RegExp(valueSearch, "gim");
    titleRender = title.replace(regex, (match) => {
      return `<mark>${match}</mark>`
    });
  }

  return (
    <h2 className="article-item__title">
      <Link to={`/post/${slug}`}>
        <div dangerouslySetInnerHTML={{ __html: titleRender }} />
      </Link>
    </h2>
  );
}
