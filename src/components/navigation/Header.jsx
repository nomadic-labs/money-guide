import React from "react";
import lightLogo from "../../assets/images/nawl-logo-white.svg"
import icon from "../../assets/images/run.svg"
import T from "../common/Translation"

const Header = props => {
  const moduleClass = props.pageData && props.pageData.template === "course-module.js" ? "module" : ""
  const onClickLeave = () => {
    window.location.replace("https://www.google.com");
  }

  return (
    <nav className={`navbar ${moduleClass}`}>
      <div className="logo">
        <a href={'https://nawl.ca/'} className="light"><img src={lightLogo} alt="NAWL | ANFD" /></a>
      </div>
      <div className="fly-away">
        <button onClick={onClickLeave} className="exit-button">
          <span><T id="fly_away" defaultText="Leave quickly" /></span>
          <img src={icon} alt={<T id="fly_away" defaultText="Fly me to another site" />} />
        </button>
      </div>
    </nav>
  );
}

export default Header;
