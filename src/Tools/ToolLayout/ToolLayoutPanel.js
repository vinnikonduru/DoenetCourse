import React, { Component } from "react";
import PlacementContext from './PlacementContext';
import SplitPanelContext from './SplitPanelContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faTimes, faBars
} from "@fortawesome/free-solid-svg-icons";
import './toollayout.css';
import styled from 'styled-components';
import SplitLayoutPanel from './SplitLayoutPanel';


const MainContent = styled.div`
  width: 100%;
  overflow:auto;
  height: calc(100vh - ${props => props.height});
  flex-direction: row;
  display: flex;
`;
const SplitPanelHeader = styled.div`
    min-height: 1vh;
    overflow: hidden;
    width: ${props => props.width || '50'}%;
    height: 100%;
    display: flex;
    padding:3px;
    justify-content: ${props => props.justifyContent || 'space-between'};
`;
const SplitDivider = styled.div`
    width:1px;
    background-color:#e2e2e2;
    height: 100%;
    position:absolute;
    z-index:10;
    left: calc(50% - 1px);
`;

const SplitPanelContent = styled.div`
    min-height: 1vh;
    overflow: ${props => props.disableScroll ? 'hidden' : 'scroll'};
    width: calc(50% - 1px);
    
`;

export default class ToolLayoutPanel extends Component {
  static contextType = PlacementContext;
  componentDidMount() {
    console.log("mounted");
  }
  render() {
  const userAgent = window.navigator.userAgent;

    const deviceType = this.context && this.context.panelHeadersControlVisible && this.context.panelHeadersControlVisible.deviceTypeToPanels ? this.context.panelHeadersControlVisible.deviceTypeToPanels : ""; 
// console.log("panel device type", this.context.panelHeadersControlVisible.deviceTypeToPanels);
// let mainHeight = this.context.panelHeadersControlVisible.sliderVisible ?
//  ((this.context.panelHeadersControlVisible.headerSectionCount + 1) * 50 + 95 + 30) + 'px' : '175px';
let mainHeight = this.context.panelHeadersControlVisible.sliderVisible ? 
((this.context.panelHeadersControlVisible.headingTitle 
  && this.context.panelHeadersControlVisible.headingTitle.length > 0  ? 3 : 2) * 50 + 95 + 30) + 'px' : '175px';

    if(!this.context.panelHeadersControlVisible.phoneButtonsDisplay) {
      let existingHeight = mainHeight.replace(/[a-z]/g , '');
      existingHeight = Number.parseInt(existingHeight);
      mainHeight = (existingHeight - 30) + 'px';
    }

    if(this.props.panelHeaderControls === undefined  && this.context.panelHeadersControlVisible.purpose  && this.context.panelHeadersControlVisible.purpose.length === 1){
      let existingHeight = mainHeight.replace(/[a-z]/g , '');
      existingHeight = Number.parseInt(existingHeight);
      mainHeight = (existingHeight - 95) + 'px';
    }
    // debugger;
    // if(this.context.panelHeadersControlVisible.headingTitle 
    //   && this.context.panelHeadersControlVisible.headingTitle.length > 0 
    //   && this.context.panelHeadersControlVisible.sliderVisible 
    //   && this.context.panelHeadersControlVisible.purpose.length > 1
    //   ) {
    //   let existingHeight = mainHeight.replace(/[a-z]/g , '');
    //   existingHeight = Number.parseInt(existingHeight);
    //   mainHeight = (existingHeight + 50) + 'px';
    // }

    if(this.props.isLeftPanel) {
      mainHeight = "0px";
    }
    
    let splitLayoutPanel = null;
    let filteredChildren = [];
    let panelHeader = null;
    // console.log("props" , this.props)
    // console.log("Refresh component", this.props.children)
    
    if (Array.isArray(this.props.children)) {
      for (let component of this.props.children) {
        if (component.type == SplitLayoutPanel) {
          splitLayoutPanel = component;
        }
        else {
          filteredChildren.push(component);
        }
      }
    } else {
      filteredChildren.push(this.props.children);
    }


    if (this.props.panelHeaderControls) {
      panelHeader = [...this.props.panelHeaderControls];
    }

    //Context collapse and open panels 
    const leftPanelCloseButton = () => {
      return (
        <>
          {this.context.leftCloseBtn && (
            <button onClick={this.context.leftPanelHideable} className="leftCloseButton circle">
              <FontAwesomeIcon
                style={{
                  alignSelf: "center",
                  fontSize: '16px'
                }}
                icon={faTimes}
              />
            </button>
          )}
        </>
      );
    };

    const defaultLeftClose = () => {
        middleOpenLeftRightButton();
    }

    const rightPanelCloseButton = () => {
      return (
        <>
          {this.context.rightCloseBtn && (
            <button onClick={this.context.rightPanelHideable} className="rightCloseButton custom" >
              <FontAwesomeIcon
                style={{
                  alignSelf: "center",
                  fontSize: '16px'
                }}
                icon={faChevronRight}
              />
            </button>
          )}
        </>
      );
    };

    const returnPanelLayout = () => {
      return (
        <div className="panels-header-content">
          <div className="panels-header-controls">
            {!this.context.panelHeadersControlVisible.hideCollapse ? this.context.position === 'left' ? leftPanelCloseButton() :
              this.context.position === 'middle' ? middleOpenLeftRightButton() :
              // this.context.position === 'right' ? rightPanelCloseButton() : '' : ''}

                 this.context.position === 'right' ? rightPanelCloseButton() : middleOpenLeftRightButton() : ''} 

            {!this.props.splitPanel ?
             
              <SplitPanelHeader width={100}>{panelHeader}</SplitPanelHeader>
              : <>
                {<SplitPanelHeader>
                  {panelHeader.map((p,i)=>{
                    return i < (panelHeader.length-1) ? [panelHeader[i]] : ''
                  })}
                </SplitPanelHeader>}
                <SplitDivider></SplitDivider>
                {<SplitPanelHeader justifyContent="flex-end">
                  {splitPanelProps.panelHeaderControls}
                </SplitPanelHeader>}</>
            }
          </div>
        </div> 
      )
    };

    const middleOpenLeftRightButton = () => {
      return (
        <>
          {(this.context.leftOpenBtn) && !this.context.guestUser && (
            <button onClick={this.context.leftPanelVisible} className="middleLeftButton circle"
            >
              <FontAwesomeIcon
                icon={faBars}
                style={{
                  display: "block",
                  alignSelf: "center",
                  fontSize: '16px'
                }} 
              />
            </button>
          )}
          {this.context.rightOpenBtn && (
            <button onClick={this.context.rightPanelVisible} className="middleRightButton custom" >
              <FontAwesomeIcon
                icon={faChevronLeft}
                style={{
                  alignSelf: "center",
                  fontSize: '16px'
                }}
              />
            </button>
          )}
        </>
      );
    };
    const splitPanelProps = splitLayoutPanel && splitLayoutPanel.props;
    return (
      <>
        {!this.context.panelHeadersControlVisible.hideMenu  
          && this.props.isLeftPanel === undefined && userAgent.indexOf("Mobile") === -1
        ? returnPanelLayout() : ''}

        {this.props.isLeftPanel ? <div className="panels-header-controls">
            { this.context.position === 'left'  && this.context.panelHeadersControlVisible.deviceTypeToPanels === "computer" ? leftPanelCloseButton() : defaultLeftClose() } </div> : null }
       
       
        <MainContent height={mainHeight} isResizing={this.context.isResizing}>
       
          {!this.props.splitPanel ?
            filteredChildren :

            (<><SplitPanelContent disableScroll={this.props.disableSplitPanelScroll[0]}>{filteredChildren}</SplitPanelContent>
              <SplitDivider></SplitDivider>
              <SplitPanelContent disableScroll={this.props.disableSplitPanelScroll[1]}>{splitLayoutPanel}</SplitPanelContent></>)}
          {this.context.panelHeadersControlVisible.showFooter }
        </MainContent>

        {!this.context.panelHeadersControlVisible.hideMenu  
          && this.props.isLeftPanel === undefined && userAgent.indexOf("Mobile") !== -1
        ? returnPanelLayout() : ''}

      </>
    );
  }
}
