import React from "react";
import { connect } from "react-redux";
import { orderBy } from 'lodash';
import MenuItem from "@material-ui/core/MenuItem";

import T from "../common/Translation"

const mapStateToProps = state => {
  return {
    tags: state.tags.tags,
    currentLang: state.navigation.currentLang,
  };
};

class SectionTagEditor extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { tags, currentLang, onEditSectionTag, sectionTag } = this.props;
    const orderedTags = orderBy(tags, tag => tag.label[currentLang]);
    const handleSelect = tag => () => {
      onEditSectionTag(tag);
    }

    console.log('sectionTag', sectionTag)

    return (
      <div>
      {
        orderedTags.map((tag, index) => {
          const selectedClass = tag === sectionTag ? "selected" : ""
          return (
            <MenuItem onClick={handleSelect(tag)} key={tag.value} className={`navigation-module ${selectedClass}`}>
              {tag.label[currentLang]}
            </MenuItem>
          )
        })
      }
        <MenuItem onClick={handleSelect(null)} className={`navigation-module ${sectionTag ? '' : 'selected'}`}>
          <T id="remove_tag" defaultText="Remove tag" />
        </MenuItem>
      </div>
    )
  }
}

export default connect(mapStateToProps, null)(SectionTagEditor);
