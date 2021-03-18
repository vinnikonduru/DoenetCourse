import React, { useRef } from "react";
import View from "./view";

import useDrop from "../../hooks/useDrop";

export default ({ children, heading, id, onDrop, onDropLeave, onDropEnter, onDropExit, className }) => {
  const dropRef = useRef();
  const { dropState, droppedItem } = useDrop({
    ref: dropRef,
    onDropEnter: () => onDropEnter(id),
    onDrop: onDrop,
    // onDropLeave: () => { onDropleave && onDropLeave(id)},
    onDropExit: onDropExit
  });
  return (
    <View ref={dropRef} heading={heading} droppedItem={droppedItem} classes={className}>
      {children}
    </View>
  );
};
