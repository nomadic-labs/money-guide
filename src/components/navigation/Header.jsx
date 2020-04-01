import React from "react";
import lightLogo from "../../assets/images/nawl-logo-white.svg"
import rocketShip from "../../assets/images/fly-away.svg"
import T from "../common/Translation"

const Header = props => {
  const moduleClass = props.pageData && props.pageData.template === "course-module.js" ? "module" : ""

  return (
    <nav className={`navbar ${moduleClass}`}>
      <div className="logo">
        <a href={'https://nawl.ca/'} className="light"><img src={lightLogo} alt="NAWL | ANFD" /></a>
      </div>
      <div className="fly-away">
        <a href={'https://www.cbc.ca/news'} className="light">
          <img src={rocketShip} alt={<T id="fly_away" defaultText="Fly me to another site" />} />
          <span><T id="fly_away" defaultText="Fly me to another site" /></span>
        </a>
      </div>
    </nav>
  );
}

export default Header;
