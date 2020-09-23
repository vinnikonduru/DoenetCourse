import React from 'react';
import styled from 'styled-components';
import VerticalDivider from "../../Doenet/components/VerticalDivider.js";


const ControlGroupParent =styled.div`
display:flex;
background-color:pink;
`;

export default function ControlGroup(){
    return (
      <React.Fragment>
      <ControlGroupParent>
        hello
        {/* <VerticalDivider /> */}
      </ControlGroupParent>
      </React.Fragment>
    );
  }



