export default function ArticleItemAvatar(props) {
  return (
    <div className="article-item__author-image">
      <a aria-label="John Doe" href="/">
        <img src={props.avatar} alt="john-doe" />
      </a>
    </div>
  );
}
