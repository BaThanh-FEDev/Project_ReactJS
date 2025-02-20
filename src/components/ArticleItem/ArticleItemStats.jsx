export default function ArticleItemStats(props) {
  return (
    <ul className="article-item__stats">
      <li>
        <i className="icons ion-ios-eye"></i>
        <span className="text">{props.view}</span>
      </li>
    </ul>
  );
}
