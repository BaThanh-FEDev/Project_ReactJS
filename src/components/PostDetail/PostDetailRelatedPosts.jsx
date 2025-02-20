import { useSelector } from "react-redux";
import ArticleRelated from "../ArticleItem/ArticleRelated";

function PostDetailRelatedPosts() {
  const postRelated = useSelector((state) => state.POST.postRelated);
  if (postRelated.length === 0) return <></>;
  let xhtml = postRelated.map((item, index) => {
    return (
      <ArticleRelated
        key={index}
        title={item.title.rendered}
        author={item.author_data.nickname}
        date={item.date}
        link={item.link}
      />
    );
  });
  return (
    <div className="related-post">
      <h2 className="related-post__head">Related Posts</h2>
      {xhtml}
    </div>
  );
}

export default PostDetailRelatedPosts;
