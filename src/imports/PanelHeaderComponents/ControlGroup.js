import React , {useState, useEffect, useRef} from 'react';
import styled from 'styled-components';


const ControlGroupParent = styled.div`
display:flex;
justify-content: flex-start;
`;

const CtrlGroup = styled.div`
  display:flex;
  flex-direction:row;
`;

export default function ControlGroup(props){
  var elementsArray = [];
  var ctrlGrpRef = useRef();
  var minimizedIcon = props.icon;

  useEffect(()=> {
    if(ctrlGrpRef.current) {
      props.getControlGroupsWidth(ctrlGrpRef.current.getBoundingClientRect().width);
    }
  },[]);

  props.children.forEach(grpElement=> {
    elementsArray.push(<div style={{margin: "3.5px"}}>
      {grpElement}
    </div>)
  });
  
  return (
    <React.Fragment>
    <ControlGroupParent ref={ctrlGrpRef}>   
      <CtrlGroup>
        {elementsArray}   
      </CtrlGroup>
      </ControlGroupParent>
    </React.Fragment>
    );
  }



        {/* {props.type === "fontFunctions" ? <FontFunctionsCtrlGroup>{props.children}</FontFunctionsCtrlGroup> : ""}    */}
