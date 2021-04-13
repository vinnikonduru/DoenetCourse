/**
 * External dependencies
 */
import React, { useEffect, useState, Suspense } from "react";

import {
  useHistory
} from "react-router-dom";
import {
  atom,
  useSetRecoilState,
  useRecoilValue,
  selector,
  selectorFamily,
  useRecoilValueLoadable,
  useRecoilStateLoadable,
  useRecoilCallback
} from "recoil";
import axios from "axios";
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

/**
 * Internal dependencies
 */
import Drive, { 
  folderDictionarySelector, 
  globalSelectedNodesAtom, 
  folderDictionary, 
  clearDriveAndItemSelections,
  fetchDrivesSelector,
  encodeParams,
  fetchDriveUsers,
  fetchDrivesQuery,
} from "../../_reactComponents/Drive/Drive";
import { 
  useAddItem,
  useDeleteItem,
  useRenameItem
} from "../../_reactComponents/Drive/DriveActions";
import { BreadcrumbContainer } from "../../_reactComponents/Breadcrumb";
import Button from "../../_reactComponents/PanelHeaderComponents/Button";
import DriveCards from "../../_reactComponents/Drive/DriveCards";
import "../../_reactComponents/Drive/drivecard.css";
import DoenetDriveCardMenu from "../../_reactComponents/Drive/DoenetDriveCardMenu";
import '../../_utils/util.css';
import GlobalFont from "../../Media/fonts/GlobalFont.js";
import { driveColors, driveImages } from '../../_reactComponents/Drive/util';
import Tool from '../_framework/Tool';
import { useToolControlHelper } from '../_framework/ToolRoot';
import Toast, { useToast } from '../_framework/Toast';
import {drivecardSelectedNodesAtom} from '../library/Library';
import Enrollment from "./Enrollment";

function Container(props){
  return <div
  style={{
      maxWidth: "850px",
      // border: "1px red solid",
      margin: "20px",
  }
  }
  >
      {props.children}
  </div>
}
export default function  Course(props) {
  // console.log(">> course props",props);

  const { openOverlay, activateMenuPanel } = useToolControlHelper();
  const [toast, toastType] = useToast();
  let routePathDriveId = "";
  let urlParamsObj = Object.fromEntries(
    new URLSearchParams(props.route.location.search)
  );
  if (urlParamsObj?.path !== undefined) {
    [
      routePathDriveId
    ] = urlParamsObj.path.split(":");
  }
  let courseId = "";
  if (urlParamsObj?.courseId !== undefined) {
    courseId = urlParamsObj?.courseId;
  }

  useEffect(() => {
    activateMenuPanel(1);
  }, [activateMenuPanel]);
  const history = useHistory();

  const driveCardSelection = ({item}) => {
    let newParams = {};
    newParams["path"] = `${item.driveId}:${item.driveId}:${item.driveId}:Drive`;
    newParams["courseId"] = `${item.courseId}`;
    history.push("?" + encodeParams(newParams));
  }
  const setDrivecardSelection = useSetRecoilState(drivecardSelectedNodesAtom)
  const clearSelections = useSetRecoilState(clearDriveAndItemSelections);
  const [openEnrollment, setEnrollmentView] = useState(false);

  const profile = useContext(ProfileContext)
  console.log(">>>profile",profile)
  
    if (profile.signedIn === "0"){
      return (<>
       <GlobalFont/>
      <Tool>
  
        <headerPanel title="Course">
        </headerPanel>
  
        <mainPanel>
          <div style={{border:"1px solid grey",borderRadius:"20px",margin:"auto",marginTop:"10%",padding:"10px",width:"50%"}}>
            <div style={{textAlign:"center",alignItems:"center",marginBottom:"20px"}}>
            <h2>You are not signed in</h2>
            <h2>Course currently requires sign in for use</h2> 
            <button style={{background:"#1a5a99",borderRadius:"5px"}}><a href='/signin' style={{color:"white",textDecoration:"none"}}>Sign in with this link</a></button>
            </div>
            </div>
        </mainPanel>
      
       
      </Tool>
      </>
      )
    }
  function cleardrivecardSelection(){
    setDrivecardSelection([]);
    // let newParams = {};
    // newParams["path"] = `:::`;
    // history.push("?" + encodeParams(newParams));
  }
  function useOutsideDriveSelector() {

    let newParams = {};
    newParams["path"] = `:::`;
    history.push("?" + encodeParams(newParams));
  }
  let breadcrumbContainer = null;
  if (routePathDriveId) {
    breadcrumbContainer = <BreadcrumbContainer />;
  }

  const setEnrollment = (e) =>{
    e.preventDefault()
    setEnrollmentView(!openEnrollment);
  }

  const enrollCourseId = { courseId: courseId };

  return (
    <Tool>
     <headerPanel title="Course" />
     <navPanel>
      <GlobalFont/>
      <div style={{marginBottom:"40px",height:"100vh"}} 
       onClick={useOutsideDriveSelector} 
       >
      <Drive driveId={routePathDriveId}  foldersOnly={true} />
      </div>
      </navPanel>

      <mainPanel 
      responsiveControls={routePathDriveId ? <Button value={openEnrollment ? "Close Enrollment" : "Open Enrollment"} callback={(e)=>setEnrollment(e)}></Button>: ''}
      >
        {openEnrollment ? <Enrollment selectedCourse={enrollCourseId} />  
        :
        
        <>{breadcrumbContainer}
        <div 
        onClick={()=>{
          clearSelections()
        }}
        className={routePathDriveId ? 'mainPanelStyle' : ''}
        >
          <Container>
          <Drive types={['content','course']}  urlClickBehavior="select" 
         doenetMLDoubleClickCallback={(info)=>{
           openOverlay({type:"content",branchId: info.item.branchId,contentId:"",title: info.item.label});
          }}
          />
          </Container>
        

        </div>
       
        <div 
        onClick={
          cleardrivecardSelection
        }
        tabIndex={0}
        className={routePathDriveId ? '' : 'mainPanelStyle' }
        >
       <DriveCards
       types={['course']}
       subTypes={['Administrator']}
       routePathDriveId={routePathDriveId}
       driveDoubleClickCallback={({item})=>{driveCardSelection({item})}}
       />
        </div>     
        </>
}
         </mainPanel>
    </Tool>
  );
}
