import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import MinimizedSectionMenu from "./MinimizedSectionMenu";

const wrappedCtrlGrp = styled.div`
  position: 'relative'
`;

const MinimizedSection = styled.div`
height:'100px',
opacity: 1;
display: block;
background-color: white;
width: max-content;
border: 1px solid #E2E2E2;
z-index: 9999;
color: black;
position: absolute;
left: unset;
right: 0;
top:50px;
`;

export default function ControlGroupWrapper(props){
  var getControlGroupsWidth = (width) =>{
    setControlGrpWidthArray(ctrlGrpWidthsArray=> [...ctrlGrpWidthsArray, width]);
  }
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [minimized, setMinimized] = useState(-1);
  const [minimizedProps, setMinimizedProps] = useState({});
  const [ctrlGrpWidthsArray, setControlGrpWidthArray] = useState([]);
  const [tobeRenderedChildren, setToBeRenderedChildren] = useState(React.Children.map(props.children, obj=> React.cloneElement(obj,{getControlGroupsWidth: getControlGroupsWidth })));
  const [defaultChildrens,setDefaultChildrens] = useState(React.Children.map(props.children, obj=> React.cloneElement(obj,{getControlGroupsWidth: getControlGroupsWidth })));
  const [wrappedCtrlGrpChildren, setWrappedCtrlGroupChildren] = useState([]);
  const [unWrapGroupChildren, setUnWrapGroupChildren] = useState([]);
  const WRAPPED_CONTROL_GROUP_WIDTH = 50;
  const [windowMaximizeFlag,setWindowMaximizeFlag] = useState(false);
  const [windowMinimizeFlag, setWindowMinimizeFlag] = useState(false);
  
  var showMinimizedVersion = (index) => {
    console.log("Index", tobeRenderedChildren[index]);
    setMinimized(index);
    setMinimizedProps(tobeRenderedChildren[index]);
  }
//////// render collapse/expand
  useEffect(()=> {
    // on render detects width of main panel and checks,which control groups should collapse
    //while change in ctrlGrpWidthsArray
    if(ctrlGrpWidthsArray.length > 0) {
      let totalInitialWidth = ctrlGrpWidthsArray.reduce((a,b)=> a+b,0); // total widths of all control groups
      if(totalInitialWidth > props.mainPanelWidth) {
        //checks if initial width of all control groups is more than main panel width
        let toBeCheckedWidth = 0;// toBeCheckedWidth (comparing changed width while render to main panel width)
        let expandChildIndexArr = [];
        ctrlGrpWidthsArray.forEach((width,index)=> { //finding the indexes of ctrl groups which will fit with in the main panel width;
          if(toBeCheckedWidth === 0) {
            toBeCheckedWidth = width + ((ctrlGrpWidthsArray.length-1)-index) * WRAPPED_CONTROL_GROUP_WIDTH ;
            if(toBeCheckedWidth > props.mainPanelWidth) {
              return;
            }
            else {
              expandChildIndexArr.push(index);
            }
          }
          else {
            toBeCheckedWidth = toBeCheckedWidth + width;
            // console.log("to be checked width before", toBeCheckedWidth); 
            toBeCheckedWidth = toBeCheckedWidth + ((ctrlGrpWidthsArray.length-1)-index) * WRAPPED_CONTROL_GROUP_WIDTH ;
            // console.log("to be checked width after", toBeCheckedWidth); 
            if(toBeCheckedWidth > props.mainPanelWidth) {
              return;
            }
            else {
              expandChildIndexArr.push(index);
            }
          }
        })//finding the indexes how many control groups will fit with in the main panel width;
        let childrenArray = [...tobeRenderedChildren];
        ctrlGrpWidthsArray.forEach((obj,index)=> {
          if(expandChildIndexArr.indexOf(index) === -1){
            var propsEl =createWrappedEl(childrenArray,index);
            childrenArray[index] = propsEl;
          }
        })
        setToBeRenderedChildren(childrenArray);
      }
    }
  }, [ctrlGrpWidthsArray])

  const windowResizeHandlerInCGW = () => {
    setInnerWidth(window.innerWidth);
  };

  window.addEventListener("resize", windowResizeHandlerInCGW);

  useEffect(()=> {
    let wrappedChildrens = tobeRenderedChildren.filter(obj=> (obj && obj.type && obj.type==="wrappedCtrlGrp"));
    let unWrappedChildrens = tobeRenderedChildren.filter(obj=> (obj && obj.type && obj.type && typeof(obj.type)==="function"));
    let wrappedChildrenIndexes = [];
    let unwrappedChildrenIndexes = [];
    tobeRenderedChildren.map((obj,index)=> {
      if(obj && obj.type && obj.type==="wrappedCtrlGrp") {
        wrappedChildrenIndexes.push(index);
      }
    });
    tobeRenderedChildren.map((obj,index)=> {
      if(obj && obj.type && typeof(obj.type) ==="function") {
        unwrappedChildrenIndexes.push(index);
      }
    });
    let unwrappedChildrenWidth = 0;
    ctrlGrpWidthsArray.forEach((width,index)=> {
      if(unwrappedChildrenIndexes.indexOf(index) !== -1) {
        if(unwrappedChildrenWidth === 0) {
          unwrappedChildrenWidth = width;
        }
        else {
          unwrappedChildrenWidth = unwrappedChildrenWidth + width;
        }
      }
    });
    if(window.innerWidth > innerWidth && wrappedChildrens.length !== 0) {
      if(props.mainPanelWidth > unwrappedChildrenWidth + ctrlGrpWidthsArray[wrappedChildrenIndexes[0]] + (wrappedChildrenIndexes.length * WRAPPED_CONTROL_GROUP_WIDTH)) {
          let children = [...tobeRenderedChildren];
          children[wrappedChildrenIndexes[0]] = React.cloneElement(defaultChildrens[wrappedChildrenIndexes[0]], {fromMaximize: true});
          setToBeRenderedChildren(children);
       }
    }
    else if(window.innerWidth < innerWidth && unWrappedChildrens.length !== 0) {
      if(props.mainPanelWidth < unwrappedChildrenWidth + (wrappedChildrenIndexes.length * WRAPPED_CONTROL_GROUP_WIDTH
        )) {
        let toBeUpdatedChildrenArray = [...tobeRenderedChildren];
        toBeUpdatedChildrenArray[unwrappedChildrenIndexes[unwrappedChildrenIndexes.length-1]] = <wrappedCtrlGrp onClick={()=>{showMinimizedVersion(unwrappedChildrenIndexes.length-1)}}>{toBeUpdatedChildrenArray[unwrappedChildrenIndexes.length-1]["props"].icon}</wrappedCtrlGrp>;
        setToBeRenderedChildren(toBeUpdatedChildrenArray);
      }
    }
  }, [props.mainPanelWidth])

  function createWrappedEl(propArray,index) {
    if(propArray[index] && propArray[index]["props"] && propArray[index]["props"].icon){
      return (
        <wrappedCtrlGrp onClick={()=> {showMinimizedVersion(index)}}>{propArray[index]["props"].icon}</wrappedCtrlGrp>
      )
    }
  }

  const expandedGroupWidth = (arr) => {
    let width = 0;
    arr.forEach(index=>{
      if(width === 0) {
        width = ctrlGrpWidthsArray[index];
      }
      else {
        width = width + ctrlGrpWidthsArray[index];
      }
    })
    return width;
  }



  return (
    <React.Fragment>
      {tobeRenderedChildren}
    </React.Fragment>
  );
}

