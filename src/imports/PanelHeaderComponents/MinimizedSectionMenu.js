import React from 'react';
import styled from 'styled-components';

const MinimizedSectionStyled = styled.div`
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

export default function MinimizedSectionMenu(props){
  return(
    <MinimizedSectionStyled>
      {props.minimizedChildren}
    </MinimizedSectionStyled>
  )


}