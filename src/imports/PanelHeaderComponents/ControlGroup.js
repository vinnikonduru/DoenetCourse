import React from 'react';
import styled from 'styled-components';


const ControlGroupParent =styled.div`
display:flex;
`;

export default function ControlGroup(props){
    return (
      <React.Fragment>
      <ControlGroupParent>
        {props.children}
        <p>Test Group Controls</p>
    
       
      </ControlGroupParent>
      </React.Fragment>
    );
  }



