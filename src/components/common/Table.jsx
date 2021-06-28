import React from "react";
import { EditableTable } from "react-easy-editables";

export default (props) => {
  return (
    <div className={"my-4"}>
      <EditableTable { ...props } />
    </div>
  );
};
