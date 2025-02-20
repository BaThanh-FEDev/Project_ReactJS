import { useSelector } from "react-redux";
import "./post-detail.css";
import PostDetailComments from "./PostDetailComments";
import PostDetailRichText from "./PostDetailRichText";
import PostDetailTags from "./PostDetailTags";
import { formattedDate } from "../../helpers/myDayjs";

function PostDetailContent() {
  const postDetail = useSelector((state) => state.POST.postDetail);
  if (!postDetail) return <></>;

  const image = postDetail.featured_media_url;
  const content = postDetail.content.rendered;
  const tags = postDetail.tags;
  const avatar = postDetail.author_data.avatar;
  const excerpt = postDetail.excerpt.rendered;
  const modifiedTime = formattedDate(postDetail.modified);
  const commentCount = postDetail.comment_count;
  const commentName = postDetail.author_data.nickname;

  return (
    <div className="post-detail__content">
      <div className="thumbnail">
        <img src={image} alt="blog-title" />
      </div>

      <div className="content-padding">
        <PostDetailRichText content={content} />
        <PostDetailTags tags={tags} />
        <PostDetailComments
          avatar={avatar}
          commentCount={commentCount}
          excerpt={excerpt}
          modifiedTime={modifiedTime}
          commentName={commentName}
        />
      </div>
    </div>
  );
}

export default PostDetailContent;
