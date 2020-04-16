import React from "react";
import { StaticQuery, graphql } from "gatsby"
import Helmet from "react-helmet";
import { connect } from "react-redux";
import { filter } from 'lodash'
import withRoot from '../utils/withRoot';

import Notification from "../components/notifications/Notification";
import AccountButton from "../components/navigation/AccountButton"
import Footer from "../components/navigation/Footer"
import Header from "../components/navigation/Header"
import CreatePageModal from "../components/editing/CreatePageModal";
import TagSelectorModal from "../components/common/TagSelectorModal"

import {
  EditablesContext,
  theme
} from 'react-easy-editables';

import {
  setOrderedPages,
  setCurrentLang,
  setPages,
  setTranslations,
  setTags,
  saveSelectedTag,
  closeTagSelectorModal,
  openTagSelectorModal,
} from "../redux/actions"

import "../assets/sass/less-cms/base.scss";
import "../assets/sass/custom.scss";

import favicon from '../assets/images/icon.png'

export const editorTheme = {
  ...theme,
  primaryColor: "#E57A68",
  editContainerHighlight: {
    ...theme.editContainerHighlight,
    outline: "1px solid #E57A68",
  },
  actions: {
    ...theme.actions,
    backgroundColor: "#E57A68",
  }
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flexGrow: '1'
  }
}

const mapStateToProps = state => {
  return {
    isEditingPage: state.adminTools.isEditingPage,
    pageData: state.page.data,
    pages: state.pages.pages,
    orderedPages: state.pages.orderedPages,
    currentLang: state.navigation.currentLang,
    translations: state.translations,
    tags: state.tags,
    selectedTag: state.tags.selectedTag
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setTranslations: translations => {
      dispatch(setTranslations(translations));
    },
    setTags: tags => {
      dispatch(setTags(tags));
    },
    onSelectTag: selection => {
      dispatch(saveSelectedTag(selection))
      dispatch(closeTagSelectorModal())
    },
    setPages: pages => {
      dispatch(setPages(pages));
    },
    setOrderedPages: orderedPages => {
      dispatch(setOrderedPages(orderedPages));
    },
    setCurrentLang: lang => {
      dispatch(setCurrentLang(lang));
    },
    openTagSelectorModal: () => {
      dispatch(openTagSelectorModal())
    }
  };
};


class DefaultLayout extends React.Component {
  componentDidMount() {
    const currentLang = this.props.pageData ? this.props.pageData.lang : "en";
    const modulePages = filter(this.props.allPages, page => (page.category === "modules" && page.lang === currentLang))
    const orderedPages = this.orderedPages(modulePages.find(page => page.head))

    if (!this.props.selectedTag) {
      this.props.openTagSelectorModal()
    }

    if (localStorage !== undefined) {
      const savedSelectedTagId = localStorage.getItem('money-guide-province-id')

      if (savedSelectedTagId) {
        const selectedTag = this.props.allTags[savedSelectedTagId]
        this.props.onSelectTag(selectedTag)
      }
    }

    this.props.setOrderedPages(orderedPages)
    this.props.setCurrentLang(currentLang)
    this.props.setPages(this.props.allPages)
    this.props.setTranslations(this.props.allTranslations)
    this.props.setTags(this.props.allTags)
  }

  nextPage = page => {
    return this.props.allPages[page.next];
  }

  orderedPages = (page, arr=[]) => {
    if (!page) {
      return arr
    }

    if (arr.includes(page)) {
      return arr
    }

    arr.push(page)

    const nextPage = this.nextPage(page)
    if (page === nextPage) {
      return arr
    }
    return this.orderedPages(this.nextPage(page), arr)
  }

  render() {
    const { props } = this;
    return(
      <div style={styles.container} className={`nl-page ${props.className || ""}`}>
        <Helmet>
          <title>
            Money and the Law Guide
          </title>
          <meta
            charSet="utf-8"
            description="A woman’s guide to money, relationships and the law"
            keywords="money, relationships, law, feminism, NAWL, National Association of Women and the Law"
            viewport="width=device-width,initial-scale=1.0,maximum-scale=1"
          />
          <link rel="icon" href={favicon} type="image/x-icon" />
        </Helmet>
        <Notification />
        <AccountButton />

        <EditablesContext.Provider value={ { theme: editorTheme, showEditingControls: props.isEditingPage } }>
          <div className="page-wrapper">
            <Header { ...props } />
            <main>{props.children}</main>
            <Footer { ...props } />
          </div>
          <CreatePageModal />
          <TagSelectorModal />
        </EditablesContext.Provider>
      </div>
    )
  }
}

const LayoutContainer = props => (
  <StaticQuery
    query={graphql`
      query {
        allPages {
          edges {
            node {
              id
              title
              slug
              lang
              category
              next
              head
              content
            }
          }
        }
        allTags {
          nodes {
            id
            value
            label {
              en
              fr
            }
          }
        }
        allTranslations {
          nodes {
            id
            en
            fr
          }
        }
      }
    `}
    render={data => {
      const pagesArr = data.allPages.edges.map(edge => edge.node);
      const pages = pagesArr.reduce((obj, page) => {
        obj[page.id] = page
        return obj
      }, {})

      const translationsArr = data.allTranslations.nodes
      const translations = translationsArr.reduce((obj, node) => {
        obj[node.id] = node
        return obj
      }, {})

      const tagsArr = data.allTags.nodes
      const tags = tagsArr.reduce((obj, node) => {
        obj[node.id] = node
        return obj
      }, {})

      return(
        <DefaultLayout data={data} allPages={pages} allTranslations={translations} allTags={tags} {...props} />
      )
    }}
  />
)

export default withRoot(connect(mapStateToProps, mapDispatchToProps)(LayoutContainer));


