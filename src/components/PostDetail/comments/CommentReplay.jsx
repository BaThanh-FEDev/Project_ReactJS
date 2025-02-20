import { useSelector } from "react-redux";
import { formattedDate } from "../../../helpers/myDayjs";

function CommentReplay() {
  const newReplayComment = useSelector(
    (state) => state.COMMENT.newReplayComment
  );

  if (!newReplayComment) return <></>;

  const contentRendered = newReplayComment.content.rendered
    .replace("<p>", "")
    .replace("</p>", "");
  const dateFormatted = formattedDate(newReplayComment.date);
  return (
    <li className="item">
      <div className="comments__section">
        <div className="comments__section--avatar">
          <a href="/">
            <img src={newReplayComment.author_data.avatar} alt="" />
          </a>
        </div>
        <div className="comments__section--content">
          <a href="/" className="comments__section--user">
            {newReplayComment.author_data.nickName}
          </a>
          <p className="comments__section--time">
            {dateFormatted} - ID: {newReplayComment.id}
          </p>
          <div className="comments__section--text">{contentRendered}</div>
          {/* <i className="ion-reply comments__section--reply"></i> */}
        </div>
      </div>
    </li>
  );
}

export default CommentReplay;
