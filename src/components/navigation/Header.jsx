import React from "react";
import Hidden from '@material-ui/core/Hidden';
import lightLogo from "../../assets/images/nawl-logo-white.svg"
import darkLogo from "../../assets/images/nawl-logo.svg"

const Header = props => {
  const moduleClass = props.pageData && props.pageData.template === "course-module.js" ? "module" : ""
  return (
    <nav className={`navbar ${moduleClass}`}>
      <div className="logo">
        <Hidden mdUp>
          <a href={'https://nawl.ca/'}><img src={lightLogo} alt="NAWL | ANFD" /></a>
        </Hidden>
        <Hidden smDown>
          <a href={'https://nawl.ca/'}><img src={darkLogo} alt="NAWL | ANFD" /></a>
        </Hidden>
      </div>
    </nav>
  );
}

export default Header;
