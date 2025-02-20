import { Link } from "react-router-dom";

export default function ArticleItemThumb(props) {
  const {image} = props
  return (
    <div className="article-item__thumbnail">
      <Link to={`/post/${props.slug}`}>
        <img src={props.image ? props.image : undefined} alt={props.image || 'thumbnail'} />
      </Link>
    </div>
  );
}
