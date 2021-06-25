import React, { useContext, useState, useEffect, lazy, useRef, Suspense } from 'react';
import { atom, atomFamily, useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Profile from '../Profile';


const MenuPanelsWrapper = styled.div`
  grid-area: menuPanel;
  display: flex;
  flex-direction: column;
 // overflow: auto;
  justify-content: flex-start;
  background: #e3e3e3;
  height: 100%;
  overflow: hidden;
  width: ${({hide})=>hide ? '0px' : '240px'};
`;

const MenuPanelsCap = styled.div`
width: 240px;
height: 35px;
background: white;
display: flex;
justify-content: space-between;
align-items: center;
position: ${(props) => props.fix ? 'sticky' : 'static'};
border-bottom: 2px solid #e2e2e2;
margin-bottom: -2px;
top: 0;
`;

const MenuHeaderButton = styled.button`
  border: none;
  border-top: ${({ linkedPanel, activePanel }) =>
    linkedPanel === activePanel ? '8px solid #1A5A99' : 'none'};
  background-color: hsl(0, 0%, 99%);
  border-bottom: 2px solid
    ${({ linkedPanel, activePanel }) =>
      linkedPanel === activePanel ? '#white' : 'black'};
  width: 100%;
  height: 100%;

`;

export const activeMenuPanel = atomFamily({
  key: 'activeMenuPanelAtom',
  default: 0,
});

export const useMenuPanelController = () => {
  const stackId = useStackId();
  const menuAtomControl = useSetRecoilState(activeMenuPanel(stackId));
  return menuAtomControl;
};

const Logo = styled.div`
background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),
    url('/media/Doenet_Logo_cloud_only.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 50px 25px;
  transition: 300ms;
  // background-color: pink;
  width: 50px;
  height: 25px;
  display: inline-block;
  justify-content: center;
  align-items: center;
  border-style: none;
  margin-top: 5px;
  margin-left: 2px
`

const CloseButton = styled.button`
background-color: #1A5A99;
height: 35px;
width: 20px;
color: white;
border: none;
display: inline-block;
`;

const EditMenuPanels = styled.button`
background-color: #1A5A99;
height: 35px;
width: 35px;
border: none;
color: white;
border-radius: 17.5px;
font-size: 24px
`;

const MenuPanelTitle = styled.button`
width: 240px;
height: 35px;
background: white;
display: flex;
justify-content: center;
align-items: center;
border: 0px solid white;
// border-top: 1px solid black;
border-bottom: ${props => props.isOpen ? '2px solid black' : '0px solid black'} ;
margin-top: 2px;
`

export const selectedMenuPanelAtom = atom({
  key:"selectedMenuPanelAtom",
  default:null
}) 

function SelectionMenuPanel(props){

  return <>
    <div style={{
      // paddingTop: "0px", 
      marginTop: "2px",
      paddingBottom: "4px", 
      paddingLeft: "4px",
      paddingRight: "4px",
      // backgroundColor:"hsl(209,54%,90%)"
      backgroundColor: 'white',
      borderLeft:"8px solid #1A5A99"
      }}>
        <h3 style={{textAlign: "center", width: "240px", height: "35px",
 fontSize: "16px", marginTop: "5px", marginLeft: "-8px"}}>Current Selection</h3>
        {props.children}
        </div>
  </>
}

function MenuPanel(props){
  let isInitOpen = props.isInitOpen;
  if (!isInitOpen){isInitOpen = false;}
  let [isOpen,setIsOpen] = useState(isInitOpen);

  let hideShowStyle = null;
  if (!isOpen){
    hideShowStyle = 'none'
  }

  return <>
    <MenuPanelTitle isOpen={isOpen} onClick={()=>setIsOpen(was=>!was)}><h3>{props.title}</h3></MenuPanelTitle>
    <div style={{
      display: hideShowStyle,
      // paddingTop: "0px", 
      paddingBottom: "4px", 
      paddingLeft: "4px",
      paddingRight: "4px",
      backgroundColor:"white"}}>{props.children}</div>
  </>
}

const LoadingFallback = styled.div`
  background-color: hsl(0, 0%, 99%);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
  width: 100vw;
  height: 100vh;
`;

export default function MenuPanels({ hide, panelTitles=[], currentPanels=[], initOpen=[], setMenuPanelsOpen, menuPanelsOpen }) {

  //These maintain the panels' state
  const viewPanels = useRef([])
  const currentSelectedPanel = useRecoilValue(selectedMenuPanelAtom);
  // const [userPanels,setUserPanels] = useState(null)

  // const profilePicName = profile.profilePicture;

  const LazyObj = useRef({
    TestControl:lazy(() => import('../MenuPanels/TestControl')),
    ToastTest:lazy(() => import('../MenuPanels/ToastTest')),
    SelectPanel:lazy(() => import('../MenuPanels/SelectPanel')),
  }).current;

  let selectionPanel = null;
  if (currentSelectedPanel){
    const panelToUse = LazyObj[currentSelectedPanel];
    //protect from typos
    if (panelToUse){
      const key = `SelectionMenuPanel${currentSelectedPanel}`
      selectionPanel = <SelectionMenuPanel key={key}><Suspense fallback={<LoadingFallback>loading...</LoadingFallback>}>
      {React.createElement(panelToUse,{key})}
      </Suspense></SelectionMenuPanel>
    }
  }

  function buildMenuPanel({key,type,title,visible,initOpen}){
    // console.log(">>>build",{key,type,visible})
    let hideStyle = null;
    if (!visible){
      hideStyle = 'none';
    }
    
    // {React.createElement(LazyObj[type],{key,style:{color: "red", backgroundColor: "blue"}})}
    return <MenuPanel key={key} title={title} isInitOpen={initOpen}><Suspense fallback={<LoadingFallback>loading...</LoadingFallback>}>
    {React.createElement(LazyObj[type],{key,style:{display:hideStyle}})}
    </Suspense></MenuPanel>
  } 

 
  if (viewPanels.current.length === 0 && currentPanels.length > 0){
    for (let [i,panelName] of Object.entries(currentPanels)){
        const mpKey = `${panelName}`;
        const isOpen = initOpen[i]
        const title = panelTitles[i]

    viewPanels.current.push(buildMenuPanel({key:mpKey,type:panelName,title,visible:true,initOpen:isOpen}))
    }
  }

  
  return (
    <MenuPanelsWrapper hide={hide}>
     <MenuPanelsCap fix={menuPanelsOpen}>
        <span >
          <Logo/>
          {/* <img style={{height:"45px", width:"70px", objectFit: "scale-down"}} href="https://www.doenet.org/media/Doenet_Logo_cloud_only.png"/> */}
        </span>
        <span style={{marginBottom: '1px'}}>Doenet</span>
        <span >
          <Profile 
          margin={menuPanelsOpen}
          />
        </span>
        <span >
          <CloseButton onClick={()=>setMenuPanelsOpen(false)}><FontAwesomeIcon icon={faChevronLeft}/></CloseButton>
        </span>
        
          {/* {anchor} */}
      </MenuPanelsCap>
    {selectionPanel}
    {viewPanels.current}
    {/* {userPanels} */}
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",width:"240px",paddingTop:"8px"}}>
      <EditMenuPanels onClick={()=>console.log('>>>edit menu panels')}>+</EditMenuPanels>
    </div>

    </MenuPanelsWrapper>
  );
}
