import React from "react";
import { graphql } from "gatsby";
import { connect } from "react-redux";
import Container from '@material-ui/core/Container';
import { EditableText, EditableParagraph } from "react-easy-editables";

import {
  updatePage,
  loadPageData,
  openTagSelectorModal
} from "../redux/actions";

import Layout from "../layouts/default.js";
import CourseModules from "../components/common/CourseModules"
import T from "../components/common/Translation"
import verticalHeader from "../assets/images/header-vertical.jpg"
import horizontalHeader from "../assets/images/header-horizontal.jpg"
import TagSelectorModal from "../components/common/TagSelectorModal"


const mapDispatchToProps = dispatch => {
  return {
    onUpdatePageData: (page, id, data) => {
      dispatch(updatePage(page, id, data));
    },
    onLoadPageData: data => {
      dispatch(loadPageData(data));
    },
    openTagSelectorModal: () => {
      dispatch(openTagSelectorModal())
    }
  };
};

const mapStateToProps = state => {
  return {
    pageData: state.page.data,
    isLoggedIn: state.adminTools.isLoggedIn,
  };
};

class HomePage extends React.Component {

  constructor(props) {
    super(props)
    const initialPageData = {
      ...this.props.data.pages,
      content: JSON.parse(this.props.data.pages.content)
    };

    this.props.onLoadPageData(initialPageData);
  }

  componentDidMount() {
    if (!this.props.selectedTag) {
      this.props.openTagSelectorModal()
    }
  }

  onSave = id => content => {
    this.props.onUpdatePageData("nawl", id, content);
  };

  render() {
    const content = this.props.pageData ? this.props.pageData.content : JSON.parse(this.props.data.pages.content);

    return (
      <Layout light={true} location={this.props.location}>
        <div className="bg-image title-main">
          <img src={horizontalHeader} alt="" />
        </div>
        <div className="title-mobile">
          <img src={verticalHeader} alt="" />
          <div className="bg-dark course-title">
            <div className="text-light text-center title">
              <h1><T id="site_title" /></h1>
            </div>
          </div>
        </div>

        <section id="about" className="wow fadeIn">
          <Container maxWidth="md">
            <h2 className="underline">
              <EditableText content={content["about-title"]} handleSave={this.onSave("about-title")} />
            </h2>
            <EditableParagraph content={content["about-description"]} handleSave={this.onSave("about-description")} />

            <h3 className="subheading">
              <EditableText content={content["about-disclaimer-heading"]} handleSave={this.onSave("about-disclaimer-heading")} />
            </h3>
            <EditableParagraph content={content["about-disclaimer-text"]} handleSave={this.onSave("about-disclaimer-text")} />

            <h3 className="subheading">
              <EditableText content={content["about-accessibility-heading"]} handleSave={this.onSave("about-accessibility-heading")} />
            </h3>
            <EditableParagraph content={content["about-accessibility-text"]} handleSave={this.onSave("about-accessibility-text")} />

          </Container>
        </section>

        <section id="acknowledgements" className="wow fadeIn highlight">
          <Container maxWidth="md">
            <h2 className="">
              <EditableText content={content["acknowledgements-header"]} handleSave={this.onSave("acknowledgements-header")} />
            </h2>
            <EditableParagraph content={content["acknowledgements"]} handleSave={this.onSave("acknowledgements")} />
          </Container>
        </section>

        <section id="course-modules" className="wow fadeIn">
          <Container maxWidth="md">
            <h2 className="underline">
              <EditableText content={content["modules-title"]} handleSave={this.onSave("modules-title")} />
            </h2>
            <CourseModules />
          </Container>
        </section>

        <section id="nawl" className="wow fadeIn highlight">
          <Container maxWidth="md">
            <h2 className="">
              <EditableText content={content["nawl-header"]} handleSave={this.onSave("nawl-header")} />
            </h2>
            <EditableParagraph content={content["nawl-description"]} handleSave={this.onSave("nawl-description")} />
          </Container>
        </section>

        <TagSelectorModal />

      </Layout>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

export const query = graphql`
  query {
    pages(id: { eq: "nawl" }) {
      id
      content
      title
      description
      slug
      lang
      translations {
        en {
          slug
          id
        }
        fr {
          slug
          id
        }
      }
    }
  }
`;


