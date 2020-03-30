import React from "react";
import lightLogo from "../../assets/images/nawl-logo-white.svg"
import darkLogo from "../../assets/images/nawl-logo.svg"

const Header = props => {
  const moduleClass = props.pageData && props.pageData.template === "course-module.js" ? "module" : ""

  return (
    <nav className={`navbar ${moduleClass}`}>
      <div className="logo">
        <a href={'https://nawl.ca/'} className="light"><img src={lightLogo} alt="NAWL | ANFD" /></a>
        <a href={'https://nawl.ca/'} className="dark"><img src={darkLogo} alt="NAWL | ANFD" /></a>
      </div>
    </nav>
  );
}

export default Header;
