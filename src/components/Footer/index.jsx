import { useSelector } from 'react-redux';
import './footer.css';
import { Link } from 'react-router-dom';

function Footer() {
  const categoryList = useSelector((state) => state.CATEGORY.categoryList);
  const postListByTag = useSelector((state) => state.TAG.tagData.postListByTag)
  
  
  function renderList (list) {
    let xhtml = list.map((item, index) => {
      if(index < 5) {
        return (
          <li key={index}>
            <Link to="/">{item.name}</Link>
          </li>
        )
      }
    })
    return xhtml
  }
  
  
  return (
    <footer id="footer" className="bg-white">
      <div className="tcl-container">
        <div className="footer">
          <div className="tcl-row">
            {/* Footer Column */}
            <div className="tcl-col-12 tcl-col-sm-6 tcl-col-md-4 tcl-col-lg-3">
              <div className="footer-logo">
                <img src="/assets/images/logo.png" alt="NuxtBlog Logo" />
              </div>
              <p>© 2025, All Rights Reserved.</p>
            </div>
            {/* Footer Column */}
            <div className="tcl-col-12 tcl-col-sm-6 tcl-col-md-4 tcl-col-lg-3">
              <div className="footer-title">
                <p>Categories</p>
              </div>
              <ul className="footer-content__list">
                {renderList(categoryList)}
              </ul>
            </div>
            {/* Footer Column */}
            <div className="tcl-col-12 tcl-col-sm-6 tcl-col-md-4 tcl-col-lg-3">
              <div className="footer-title">
                <p>Tags</p>
              </div>
              <ul className="footer-content__list">
                {renderList(postListByTag)}
              </ul>
            </div>
            {/* Footer Column */}
            <div className="tcl-col-12 tcl-col-sm-6 tcl-col-md-4 tcl-col-lg-3">
              <div className="footer-title">
                <p>Information</p>
              </div>
              <div className="footer-facebook">
                <div
                  className="fb-page"
                  data-href="/"
                  data-tabs
                  data-width
                  data-height
                  data-small-header="false"
                  data-adapt-container-width="true"
                  data-hide-cover="false"
                  data-show-facepile="true"
                >
                  <blockquote cite="/" className="fb-xfbml-parse-ignore">
                    <Link to="/">Demo Project ReactJS</Link>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
