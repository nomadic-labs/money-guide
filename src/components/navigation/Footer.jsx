import React from "react";
import { Link } from "gatsby"
import Hidden from '@material-ui/core/Hidden';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Menu from "@material-ui/core/Menu";
import Popover from "@material-ui/core/Popover";
import BottomNavigation from '@material-ui/core/BottomNavigation';
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
    const translations = props.pageData ? props.pageData.translations || {} : {}
    const shareUrl = props.location ? props.location.href : isClient ? window.location.origin : "";
    const shareTitle = props.pageData ? props.pageData.title : "Feminist Law Reform 101"
    const currentLang = props.pageData ? props.pageData.lang : "en";
    const home = HOME_URLS[currentLang];

    return (
      <footer>
        <Menu
          id="toc"
          role="menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={closeMenu}
          className="table-of-contents"
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
          <PopupNavigation />
        </Menu>
        <Menu
          id="tag-selector"
          role="menu"
          anchorEl={tagAnchor}
          open={Boolean(tagAnchor)}
          onClose={closeTagSelector}
          className="tag-selector"
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
          <TagSelector closeTagSelector={closeTagSelector} />
        </Menu>
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
        <Hidden smDown>
          <Container maxWidth="md">
            <Grid container>
              <Grid item xs={false} md={4} className="footer-section footer-left">
                <Link to={home} className="site-title no-text-decoration">
                  <T id="site_title" />
                </Link>
              </Grid>
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
                <button><T id="download_syllabus" /></button>
                <button><T id="podcast" /></button>
                {
                  Object.keys(translations).map(key => {
                    if (translations[key]) {
                      const language = LANGUAGE_OPTIONS.find(o => o.value === key) || {}
                      return(
                        <Link key={key} to={translations[key].slug}>
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
                aria-owns={anchorEl ? "toc" : null}
                aria-haspopup="true"
              >
                <T id="table_of_contents" />
              </Fab>
            </Grid>
          </Container>
        </Hidden>
        <Hidden mdUp>
          <BottomNavigation
            style={{ height: "auto", justifyContent: "space-between", alignItems: "center"}}
          >
            <div className="d-flex align-center footer-left">
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
              <button><T id="download_syllabus" /></button>
              <button><T id="podcast" /></button>
              {
                Object.keys(translations).map(key => {
                  if (translations[key]) {
                    const language = LANGUAGE_OPTIONS.find(o => o.value === key) || {}
                    return(
                      <Link key={key} to={translations[key].slug}>
                        {language.label}
                      </Link>
                    )
                  } else {
                    return null
                  }
                })
              }
              </div>
              <Fab
                id="toc-btn"
                onClick={openMenu}
                aria-owns={anchorEl ? "toc" : null}
                aria-haspopup="true"
              >
                <T id="table_of_contents" />
              </Fab>
          </BottomNavigation>
        </Hidden>
      </footer>
    );
  }
}

export default Footer;
