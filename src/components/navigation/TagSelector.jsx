import React from "react";
import { connect } from "react-redux";
import { orderBy } from 'lodash';
import MenuItem from "@material-ui/core/MenuItem";

import T from "../common/Translation"

const mapStateToProps = state => {
  return {
    tags: state.tags,
    currentLang: state.navigation.currentLang,
    pageData: state.page.data,
  };
};

const handleSelectedTag = tag => {
  return () => console.log(`Selected tag`, tag)
}


const TagSelector = props => {
  const orderedTags = orderBy(props.tags, tag => tag.label[props.currentLang]);
  return (
    <div>
    {
      orderedTags.map((tag, index) => {
        return (
          <MenuItem onClick={handleSelectedTag} key={tag.value} className="navigation-module">
            {tag.label[props.currentLang]}
          </MenuItem>
        )
      })
    }
    </div>
  );
}

export default connect(mapStateToProps, null)(TagSelector);
