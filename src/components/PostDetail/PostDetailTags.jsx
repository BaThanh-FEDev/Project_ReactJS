import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function PostDetailTags(props) {
  const { tags } = props;
  const tagsListOfPost = useSelector((state) => state.TAG.tagsListOfPost);
  const isLoading = useSelector((state) => state.TAG.loading); // Thêm loading state

  if (isLoading || !tagsListOfPost.length) {
    return <div className="skeleton-tags">Loading...</div>; // Thay bằng hiệu ứng skeleton
  }
  let arrayTag = tags
    .map((tagId) => tagsListOfPost.find((item) => item?.id === tagId))
    .filter(Boolean); 

  // for (let i = 0; i < tagsListOfPost.length; i++) {
  //   const tagItem = tagsListOfPost.find((item) => item.id === tags[i]);
  //   arrayTag.push(tagItem);
  // }

  // tags.forEach((tagId) => {
  //   const tagItem = tagsListOfPost.find((item) => item.id === tagId);
  //   arrayTag.push(tagItem);
  // });

  if (arrayTag.length === 0) return <></>;

  return (
    <div className="post-detail__tags">
      <h2>Tags</h2>
      <ul>
        {arrayTag.map((item, index) => (
          <li key={index} className="item">
            <Link to={`/tag/${item.slug}`} className="btn btn-default">
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostDetailTags;
