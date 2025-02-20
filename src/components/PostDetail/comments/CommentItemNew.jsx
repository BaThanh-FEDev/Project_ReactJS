import { useSelector } from "react-redux";
import { formattedDate } from "../../../helpers/myDayjs";

function CommentItemNew() {
  const newComment = useSelector(state => state.COMMENT.newComment);
  
  if(!newComment) return <></>
  console.log(newComment);
  const contentRendered = newComment.content.rendered
    .replace("<p>", "")
    .replace("</p>", "");
  const dateFormatted = formattedDate(newComment.date);

  return (
    <li className="item">
      <div className="comments__section">
        <div className="comments__section--avatar">
          <a href="/">
            <img src={newComment.author_data.avatar} alt="" />
          </a>
        </div>
        <div className="comments__section--content">
          <a href="/" className="comments__section--user">
            {newComment.author_data.nickName}
          </a>
          <p className="comments__section--time">{dateFormatted} - ID: {newComment.id}</p>
          <div className="comments__section--text">{contentRendered}</div>
          <i className="ion-reply comments__section--reply"></i>
        </div>
      </div>
    </li>
  );
}

export default CommentItemNew;
