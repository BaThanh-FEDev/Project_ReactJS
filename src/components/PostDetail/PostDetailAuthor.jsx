import './post-author.css'

function PostDetailAuthor({author, avatar, desc}) {
  let newDesc = desc.replace("<p>", "");
  newDesc = newDesc.replace("</p>", "");

  return (
    <div className="post-author">
      <div className="post-author__bg-avatar">
        <a href="/" className="post-author__avatar">
          <img src={avatar} alt="" />
        </a>
      </div>
      <div className="post-author__nickname">
        <a href="/">{author}</a>
      </div>
      <p className="post-author__desc">{newDesc}</p>
    </div>

  )
}

export default PostDetailAuthor