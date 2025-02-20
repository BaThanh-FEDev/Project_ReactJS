function Test() {
  return (
    <>
      <li className="item">
        <div className="comments__section">
          <div className="comments__section--avatar">
            <a href="/">
              <img src="/assets/images/avatar1.jpg" alt="" />
            </a>
          </div>
          <div className="comments__section--content">
            <a href="/" className="comments__section--user">
              John Smith
            </a>
            <p className="comments__section--time">2 minutes ago</p>
            <p className="comments__section--text">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nesciunt
              sequi odit exercitationem maiores, iusto unde quibusdam! Ullam
              nisi iste reprehenderit, expedita nam ad. Nisi hic at voluptate
              sint incidunt aut?
            </p>
            {/* <i class="ion-reply comments__section--reply"></i> */}
          </div>
        </div>
        {/* Reply Comments */}
        <ul className="comments">
          <li className="item">
            <div className="comments__section">
              <div className="comments__section--avatar">
                <a href="/">
                  <img src="/assets/images/avatar3.jpg" alt="" />
                </a>
              </div>
              <div className="comments__section--content">
                <a href="/" className="comments__section--user">
                  John Smith
                </a>
                <p className="comments__section--time">2 minutes ago</p>
                <p className="comments__section--text">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit?
                </p>
                {/* <i class="ion-reply comments__section--reply"></i> */}
              </div>
            </div>
          </li>
          <li className="item">
            <div className="comments__section">
              <div className="comments__section--avatar">
                <a href="/">
                  <img src="/assets/images/avatar4.jpg" alt="" />
                </a>
              </div>
              <div className="comments__section--content">
                <a href="/" className="comments__section--user">
                  John Smith
                </a>
                <p className="comments__section--time">2 minutes ago</p>
                <p className="comments__section--text">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Nesciunt sequi odit exercitationem ma?
                </p>
                {/* <i class="ion-reply comments__section--reply"></i> */}
              </div>
            </div>
          </li>
        </ul>
        {/* Reply form */}
        <div className="comments__form">
          <div className="comments__form--control">
            <div className="comments__section--avatar">
              <a href="/">
                <img src="/assets/images/avatar1.jpg" alt="" />
              </a>
            </div>
            <textarea />
          </div>
          <div className="text-right">
            <button className="btn btn-default">Submit</button>
          </div>
        </div>
      </li>

      <li className="item">
        <div className="comments__section">
          <div className="comments__section--avatar">
            <a href="/">
              <img src="/assets/images/avatar2.jpg" alt="" />
            </a>
          </div>
          <div className="comments__section--content">
            <a href="/" className="comments__section--user">
              John Smith
            </a>
            <p className="comments__section--time">2 minutes ago</p>
            <p className="comments__section--text">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nesciunt
              sequi odit exercitationem maiores?
            </p>
            {/* <i class="ion-reply comments__section--reply"></i> */}
          </div>
        </div>
        <div className="comments__hidden">
          <a href="/">
            <i className="icons ion-ios-undo" /> Xem thêm 2 câu trả lời
          </a>
        </div>
      </li>

      <li className="item">
        <div className="comments__section">
          <div className="comments__section--avatar">
            <a href="/">
              <img src="/assets/images/avatar3.jpg" alt="" />
            </a>
          </div>
          <div className="comments__section--content">
            <a href="/" className="comments__section--user">
              John Smith
            </a>
            <p className="comments__section--time">2 minutes ago</p>
            <p className="comments__section--text">
              Lorem ipsum dolor sit, amet?
            </p>
            {/* <i class="ion-reply comments__section--reply"></i> */}
          </div>
        </div>
      </li>
    </>
  );
}
