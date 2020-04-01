import React from "react";
import { connect } from "react-redux";
import { orderBy } from 'lodash';
import MenuItem from "@material-ui/core/MenuItem";

import { saveSelectedTag, closeTagSelectorModal, showNotification } from '../../redux/actions';
import T from "../common/Translation"

const mapStateToProps = state => {
  return {
    tags: state.tags.tags,
    selectedTag: state.tags.selectedTag,
    currentLang: state.navigation.currentLang,
    pageData: state.page.data,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSelectTag: selection => {
      dispatch(saveSelectedTag(selection))
      dispatch(showNotification(`Showing content for ${selection ? selection.label.en : 'all provinces and territories'}`))
      dispatch(closeTagSelectorModal())
    },
  };
};

const TagSelector = props => {
  const { selectedTag, tags, onSelectTag, currentLang, closeTagSelector } = props;
  const orderedTags = orderBy(tags, tag => tag.label[currentLang]);
  const handleSelect = tag => () => {
    onSelectTag(tag);
    if (closeTagSelector) {
      closeTagSelector()
    }
  }

  return (
    <div>
    {
      orderedTags.map((tag, index) => {
        const selectedClass = tag === selectedTag ? "selected" : ""
        return (
          <MenuItem onClick={handleSelect(tag)} key={tag.value} className={`navigation-module ${selectedClass}`}>
            {tag.label[currentLang]}
          </MenuItem>
        )
      })
    }
      <MenuItem onClick={handleSelect(null)} className={`navigation-module ${selectedTag ? '' : 'selected'}`}>
        <T id="all_tags" />
      </MenuItem>
    </div>
  )

}

export default connect(mapStateToProps, mapDispatchToProps)(TagSelector);
