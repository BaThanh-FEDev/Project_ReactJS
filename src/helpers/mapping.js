// xong
export function mappingPostData(item) {
  return {
    id: item.id,
    publishDate: item["date"],
    slug: item["slug"],
    title: item.title.rendered,
    description: item.excerpt.rendered,
    image: item.featured_media_url,
    viewCount: item.view_count,
    commentCount: item.comment_count,
    excerpt: item.rendered,
    link: item.link,
    authorData: {
      id: item.author,
      nickname: item.author_data.nickname,
      description: item.author_data.description,
      avatar: item.author_data.avatar,
    },

    categoryIds: item.categories,
    tagsIds: item.tags,
    content: item.content.rendered,
    status: item.status,
  };
}

// xong
export function mappingMenuData(item) {
  let childItems = item?.child_items
    ? item?.child_items.map(mappingMenuData)
    : null;

  return {
    id: item.ID,
    title: item.title,
    childItems: childItems,
  };
}

// xong
export function mappingCommentData(item) {
  return {
    id: item.id,
    date: item.date,
    content: item.content.rendered,
    commentReplyCount: item.comment_reply_count,
    parent: item.parent,
    authorData: {
      nickName: item.author_data.nickname,
      avatar: item.author_data.avatar,
    },
  };
}

// xong
export function mappingProfileData(item) {
  return {
    avatar: item.simple_local_avatar?.full || null,
    id: item.id,
    email: item.email,
    nickName: item.nickname,
    firstName: item.first_name,
    lastName: item.last_name,
    description: item.description,
    avatarId: item.simple_local_avatar?.media_id
  };
}

//xong
export function mappingCategoryData(item) {
  return {
    key: item.id,
    id: item.id,
    slug: item.slug,
    name: item.name,
    parent: item.parent,
  };
}

//xong
export function mappingTagsData(item) {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
  };
}
