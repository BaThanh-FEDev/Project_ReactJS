export default function ArticleItemDesc(props) {
  // replace <p> -> ''
  // replace </p> -> ''
  // <p>abc</p> -> abc
  const paragraph = props.desc;
  let html = paragraph.replace('<p>', '');
  html = html.replace('</p>', '');
  const array_html = html.split(" ");
  const new_array = array_html.slice(0, 25);
  let new_html = new_array.join(" ");
  const desc = new_html.concat("...");

  let descRender = desc;
  const valueSearch = props.valueSearch;
  if(valueSearch) {
    const regex = new RegExp(valueSearch, "gi");
    descRender = desc.replace(regex, (match) => {
      return `<mark>${match}</mark>`
    });
  }

  return (
    // <p>{`${new_html}...`}</p>
    <p dangerouslySetInnerHTML={{ __html: descRender}}/>
  );
}
