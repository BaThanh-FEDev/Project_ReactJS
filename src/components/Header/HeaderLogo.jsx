import { Link } from "react-router-dom";

function HeaderLogo() {
  return (
    <div className="tcl-col-2">
      {/* Logo */}
      <div className="header-logo">
        <Link to="/">
          <img src="/assets/images/logo.png" alt="Go to homepage" />
        </Link>
      </div>
    </div>
  );
}

export default HeaderLogo;
