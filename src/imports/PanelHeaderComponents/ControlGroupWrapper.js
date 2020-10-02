import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
faFont
} from "@fortawesome/free-solid-svg-icons";
import ResizeObserver from 'resize-observer-polyfill';

const wrappedCtrlGrp = styled.button`
height: '24px',
width:'40px',
borderRadius: '5px',
border:'1px solid black',
position: 'relative'
`;
export default function ControlGroupWrapper(props){
  var getControlGroupsWidth = (width) =>{
    setControlGrpWidthArray(ctrlGrpWidthArray=> [...ctrlGrpWidthArray, width]);
  }
  const [minimized, setMinimized] = React.useState(false);
  const [initialMainPanelWidth, setInitialMainPanelWidth] = React.useState(props.mainPanelWidth);
  const [percentwidthReduced, setPercentWidthReduced] = React.useState(100);
  const [ctrlGrpWidthArray, setControlGrpWidthArray] = React.useState([]);
  const [tobeRenderedChildren, setToBeRenderedChildren] = React.useState(React.Children.map(props.children, obj=> React.cloneElement(obj,{getControlGroupsWidth: getControlGroupsWidth })));
  const [wrappedCtrlGrpChildren, setWrappedCtrlGroupChildren] = React.useState([]);
  const WRAPPED_CONTROL_GROUP_WIDTH = 50;
  //let children = React.Children.map(props.children, obj=> React.cloneElement(obj,{getControlGroupsWidth: getControlGroupsWidth }));
  // console.log("final width array", ctrlGrpWidthArray);

  React.useEffect(()=> {
    console.log("initial initialMainPanelWidth",initialMainPanelWidth)
    console.log("props.mainPanelWidth",props.mainPanelWidth)
    let totalGrpsWidth = ctrlGrpWidthArray.reduce((a,b)=> a+b,0);
    let wrappedChildren = wrappedCtrlGrpChildren.filter(obj=> (obj && obj.type && obj.type==="wrappedCtrlGrp"));
    //let unWrappedChildren = wrappedCtrlGrpChildren.filter(obj=> typeof(obj.type)==="function");
    let childrenArray = tobeRenderedChildren;
    let finalElement = (
        <wrappedCtrlGrp onClick = {minimizedbuttononclick}>
          <FontAwesomeIcon
            // icon={faFont}
            style={{
              width:"28px",
              margin:"10px",
              border:"1px solid black",
              alignSelf: "center",
              fontSize: '24px',
              color:'#288ae9'
            }}/>
      </wrappedCtrlGrp>);
    
    //console.log("percentage of width reduced",props.mainPanelWidth/initialMainPanelWidth * 100);
    //setPercentWidthReduced(props.mainPanelWidth/initialMainPanelWidth * 100);
    if(props.mainPanelWidth < totalGrpsWidth && wrappedCtrlGrpChildren.length === 0) {
      let indexLength = ctrlGrpWidthArray.length-1;
      let propsEl = <wrappedCtrlGrp>{childrenArray[indexLength]["props"].icon}</wrappedCtrlGrp>;
      childrenArray.splice(indexLength,1);
      childrenArray.push(propsEl);
      setWrappedCtrlGroupChildren(childrenArray);

    }
    else if(wrappedChildren.length > 0) {
      let indexArrray =[];
      let wrappedTotalGrpWidth = wrappedChildren.length * WRAPPED_CONTROL_GROUP_WIDTH;
      wrappedCtrlGrpChildren.map((obj,index)=> {
        if(typeof(obj.type)==="function") {
          indexArrray.push(index);
      }});
      let unWrappedGroupTotalWidth = 0;
      indexArrray.forEach(obj=>{
        if(unWrappedGroupTotalWidth === 0) {
          unWrappedGroupTotalWidth = ctrlGrpWidthArray[obj];
        }
        else {
          unWrappedGroupTotalWidth = unWrappedGroupTotalWidth + ctrlGrpWidthArray[obj];
        }
      });
      if(props.mainPanelWidth < (wrappedTotalGrpWidth + unWrappedGroupTotalWidth)){
        let toBeUpdatedChildrenArray = wrappedCtrlGrpChildren;
        console.log(toBeUpdatedChildrenArray[indexArrray[indexArrray.length-1]]);
        toBeUpdatedChildrenArray[indexArrray[indexArrray.length-1]] = <wrappedCtrlGrp>{toBeUpdatedChildrenArray[indexArrray[indexArrray.length-1]]["props"].icon}</wrappedCtrlGrp>;
        setWrappedCtrlGroupChildren(toBeUpdatedChildrenArray);
      }
    }
    // if(wrappedChildren.length === tobeRenderedChildren.length) {
    //   let wrappedTotalGrpWidth = wrappedChildren.length * WRAPPED_CONTROL_GROUP_WIDTH;
    //   if(props.mainPanelWidth > wrappedTotalGrpWidth){
    //   let toBeResetChildren = wrappedCtrlGrpChildren;
    //   toBeResetChildren.splice(0,1);
    //   toBeResetChildren[0] = tobeRenderedChildren[0];
    //   setWrappedCtrlGroupChildren(toBeResetChildren);
    //   }
    // }
  },[props.mainPanelWidth]);

  const minimizedbuttononclick = (event) =>{
    console.log(event);
    console.log("inside click minimized")
    setMinimized(true);
  }
  

  console.log(ctrlGrpWidthArray);
const ControlGroupWindowResizeHandler = () => {
    // console.log(document.hidden, document.visibilityState);

    
    //let wrappedChildren = wrappedCtrlGrpChildren.filter(obj=> obj.type==="wrappedCtrlGrp");
    if(props.deviceType === "computer"){
      if(percentwidthReduced >= 85 && percentwidthReduced <= 95) {
        childrenArray.splice(indexLength,1);
        childrenArray.push(finalElement);
        setWrappedCtrlGroupChildren(childrenArray);
      }
      else if(percentwidthReduced >= 75 && percentwidthReduced < 85 && wrappedChildren.length <=1) {
        if(wrappedChildren.length < ctrlGrpWidthArray.length) {
          let indexLength = ctrlGrpWidthArray.length-1;
          childrenArray.splice(indexLength-wrappedChildren.length, 1);
          childrenArray.push(finalElement);
          setWrappedCtrlGroupChildren(childrenArray);
        }
      }
      else if(percentwidthReduced >= 65 && percentwidthReduced < 75 && wrappedChildren.length <=2) {
        if(wrappedChildren.length < ctrlGrpWidthArray.length) {
          let indexLength = ctrlGrpWidthArray.length-1;
          childrenArray.splice(indexLength-wrappedChildren.length, 1);
          childrenArray.push(finalElement);
          setWrappedCtrlGroupChildren(childrenArray);
        }
      }
      else if( percentwidthReduced <= 50 ) {
        if(wrappedChildren.length < ctrlGrpWidthArray.length) {
          let indexLength = ctrlGrpWidthArray.length-1;
          childrenArray.splice(indexLength-wrappedChildren.length, 1);
          childrenArray.push(finalElement);
          setWrappedCtrlGroupChildren(childrenArray);
        }
      }
      // if(wrappedChildren.length === tobeRenderedChildren.length && percentwidthReduced > 40) {
      //   // console.log("entered");
      // }
    }
  }


  return (
    <React.Fragment>
      {wrappedCtrlGrpChildren.length > 0 ? wrappedCtrlGrpChildren : tobeRenderedChildren}
      {/* {minimized ? <section style={{border:'1px solid black', backgroundColor:'grey',position:'relative',color:'black'}}>
        hello
      </section> : ""} */}
    </React.Fragment>
  );
}

