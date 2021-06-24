import React from "react";
import { Link } from "gatsby"
import Hidden from '@material-ui/core/Hidden';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Popover from "@material-ui/core/Popover";
import Fab from '@material-ui/core/Fab';

import {
  TwitterShareButton,
  TwitterIcon,
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  EmailShareButton,
  EmailIcon,
} from 'react-share';


import PopupNavigation from "./PopupNavigation"
import TagSelector from "./TagSelector"
import T from "../common/Translation"

import { LANGUAGE_OPTIONS, HOME_URLS } from "../../utils/constants"

const isClient = typeof window !== 'undefined';

class Footer extends React.Component {
  state = {
    anchorEl: null,
    tagAnchor: null,
    shareAnchor: null,
  };

  openMenu = e => {
    this.setState({ anchorEl: e.currentTarget });
  };

  closeMenu = e => {
    this.setState({ anchorEl: null });
  };

  openTagSelector = e => {
    this.setState({ tagAnchor: e.currentTarget });
  };

  closeTagSelector = e => {
    this.setState({ tagAnchor: null });
  };

  openShareButtons = e => {
    this.setState({ shareAnchor: e.currentTarget });
  };

  closeShareButtons = e => {
    this.setState({ shareAnchor: null });
  };

  render() {
    const { props, openMenu, closeMenu, openTagSelector, closeTagSelector, openShareButtons, closeShareButtons } = this;
    const { anchorEl, shareAnchor, tagAnchor } = this.state;
    const pageTranslations = props.pageTranslations || {};
    const shareUrl = props.location ? props.location.href : isClient ? window.location.origin : "";
    const shareTitle = props.pageData ? props.pageData.title : "Feminist Law Reform 101"
    const currentLang = props.currentLang
    const home = HOME_URLS[currentLang];

    return (
      <footer>
        <PopupNavigation anchorEl={anchorEl} closeMenu={closeMenu} />
        <TagSelector closeTagSelector={closeTagSelector} tagAnchor={tagAnchor} />
        <Popover
          id="share-buttons"
          role="menu"
          anchorEl={shareAnchor}
          open={Boolean(shareAnchor)}
          onClose={closeShareButtons}
          className="share-buttons-menu"
          elevation={0}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <Card variant="outlined" className="share-buttons-popover">
            <CardContent style={{ padding: "0.5rem" }}>
              <TwitterShareButton url={shareUrl} title={shareTitle}>
                <TwitterIcon size={36} round />
              </TwitterShareButton>

              <FacebookShareButton url={shareUrl} quote={shareTitle}>
                <FacebookIcon size={36} round />
              </FacebookShareButton>

              <LinkedinShareButton url={shareUrl} title={shareTitle}>
                <LinkedinIcon size={36} round />
              </LinkedinShareButton>

              <EmailShareButton url={shareUrl} subject={shareTitle}>
                <EmailIcon size={36} round />
              </EmailShareButton>
            </CardContent>
          </Card>
        </Popover>
          <Container maxWidth="md">
            <Grid container>
              <Hidden smDown>
                <Grid item xs={false} md={4} className="footer-section footer-left">
                  <Link to={home} className="site-title no-text-decoration">
                    <T id="site_title" />
                  </Link>
                </Grid>
              </Hidden>
              <Grid item xs={12} md={8} className="footer-section footer-right">
                <button
                  onClick={openTagSelector}
                  aria-owns={tagAnchor ? "tag-selector" : null}
                  aria-haspopup="true"
                >
                  <T id="select_province" />
                </button>
                <button
                  onClick={openShareButtons}
                  aria-owns={shareAnchor ? "share-buttons" : null}
                  aria-haspopup="true"
                >
                  <T id="share" />
                </button>
                {
                  Object.keys(pageTranslations).map(key => {
                    if (pageTranslations[key]) {
                      const language = LANGUAGE_OPTIONS.find(o => o.value === key) || {}
                      return(
                        <Link key={key} to={pageTranslations[key].slug}>
                          {language.label}
                        </Link>
                      )
                    } else {
                      return null
                    }
                  })
                }

              </Grid>
              <Fab
                id="toc-btn"
                onClick={openMenu}
                aria-controls="toc"
                aria-haspopup="true"
                style={currentLang === "fr" ? {fontSize: '1rem'} : {}}
              >
                <T id="table_of_contents" />
              </Fab>
            </Grid>
          </Container>
      </footer>
    );
  }
}

export default Footer;
