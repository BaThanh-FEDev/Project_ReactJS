
function PostDetailRichText(props) {
  return (
    <div className="rte">
       <div dangerouslySetInnerHTML={{ __html: props.content }} />
    </div>
  )
}

export default PostDetailRichText