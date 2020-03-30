import React from "react";
import { connect } from "react-redux";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';

import TagSelector from "../navigation/TagSelector";
import T from "./Translation"

import { closeTagSelectorModal } from '../../redux/actions';

const mapStateToProps = state => {
  return {
    openModal: state.tags.openModal,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onCloseTagSelectorModal: () => {
      dispatch(closeTagSelectorModal())
    }
  };
};


const TagSelectorModal = props => {
  const { openModal, onCloseTagSelectorModal } = props;

  return(
    <Dialog open={openModal} onClose={onCloseTagSelectorModal} aria-labelledby="tag-selector-dialogue" className="tag-selector-modal">
      <DialogContent style={{ padding: '0 10px' }}>
        <h3 className="subheading" id="tag-selector-dialogue">
          <T id="what_province" defaultText="What province are you in?" />
        </h3>
        <Paper elevation={0}>
          <MenuList
            id="tag-selector"
            role="menu"
            className="tag-selector text-center"
          >
            <TagSelector />
          </MenuList>
        </Paper>
      </DialogContent>
    </Dialog>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(TagSelectorModal);
