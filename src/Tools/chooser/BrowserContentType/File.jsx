import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faThumbtack } from '@fortawesome/free-solid-svg-icons';
import DragItem from "../../TreeView/components/drag-item";
import PropTypes from 'prop-types';

const File = ({ branchId, classes, onClick, onDoubleClick, title, publishDate,
  draftDate, isShared, isPublic, isPinned, tableIndex, 
  onDragStart, onDragOver, onDragEnd }) => {

  const onDraggableDragOverCb = (listId) => {
    onDragOver(listId, "content")
  }

  const onDragStartCb = (draggedId) => {
    onDragStart({draggedId: draggedId, draggedType: "content", tableIndex: tableIndex});
  }

  return(
    <DragItem id={branchId} onDragStart={onDragStartCb} onDragOver={onDraggableDragOverCb} onDragEnd={onDragEnd}>
      <>
      <tr
      className={classes}
      onClick={() => onClick(branchId, "content", tableIndex)}
      onDoubleClick={() => onDoubleClick(branchId)}
      data-cy={branchId}>
        <td className="browserItemName">
          <div style={{"position":"relative"}}>
            {isPinned && <FontAwesomeIcon icon={faThumbtack} style={{"fontSize":"15px", "color":"#8e8e8e", "position":"aboslute", "left":"-6px", "top":"3px"}}/> }
            {isShared && isPublic ? 
              <FontAwesomeIcon icon={faFileAlt} style={{"fontSize":"18px", "color":"#3aac90", "margin": "0px 15px"}}/> :
              <FontAwesomeIcon icon={faFileAlt} style={{"fontSize":"18px", "color":"#3D6EC9", "margin": "0px 15px"}}/>}
            <span>{title}</span>
          </div>          
        </td>
        <td className="draftDate">
          <span>{draftDate}</span>
        </td>
        <td className="publishDate">
          <div style={{"position":"relative"}}>
            <span>{publishDate}</span>
          </div>          
        </td>
      </tr>
      </>
    </DragItem>
  );
}

File.propTypes = {
  branchId: PropTypes.string,
  classes: PropTypes.string,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  title: PropTypes.string,
  publishDate: PropTypes.string,
  draftDate: PropTypes.string,
  isShared: PropTypes.bool,
  isPublic: PropTypes.bool,
  isPinned: PropTypes.bool,
  tableIndex: PropTypes.number,
  onDragStart: PropTypes.func,
  onDragOver: PropTypes.func,
  onDragEnd: PropTypes.func
}

export default File;