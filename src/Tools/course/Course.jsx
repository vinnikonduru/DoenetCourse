/**
 * External dependencies
 */
import React, { useEffect, useState, Suspense ,useContext} from "react";

import {
  useHistory
} from "react-router-dom";
import {
  atom,
  atomFamily,
  selectorFamily,
  RecoilRoot,
  useSetRecoilState,
  useRecoilValueLoadable,
  useRecoilStateLoadable,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import axios from "axios";
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

/**
 * Internal dependencies
 */
import Drive, {  
  clearDriveAndItemSelections,
  encodeParams,
} from "../../_reactComponents/Drive/Drive";
import { BreadcrumbContainer } from "../../_reactComponents/Breadcrumb";
import Button from "../../_reactComponents/PanelHeaderComponents/Button";
import DriveCards from "../../_reactComponents/Drive/DriveCards";
import "../../_reactComponents/Drive/drivecard.css";
import '../../_utils/util.css';
import GlobalFont from "../../_utils/GlobalFont";
import Tool from '../_framework/Tool';
import { useToolControlHelper ,ProfileContext} from '../_framework/ToolRoot';
import Toast, { useToast } from '../_framework/Toast';
import {drivecardSelectedNodesAtom} from '../library/Library';
import Enrollment from "./Enrollment";
export const roleAtom = atom({
  key: "roleAtom",
  default: "Instructor",
});
function Container(props){
  return <div
  style={{
      maxWidth: "850px",
      // border: "1px red solid",
      padding: "20px",
      display:"grid"
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
  let routePathFolderId = "";
  let pathItemId = "";
  let itemType = "";
  let urlParamsObj = Object.fromEntries(
    new URLSearchParams(props.route.location.search)
  );
    if (urlParamsObj?.path !== undefined) {
    [
      routePathDriveId,
      routePathFolderId,
      pathItemId,
      itemType,
    ] = urlParamsObj.path.split(":");
  }
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

  const DriveCardCallBack = ({item}) => {
    let newParams = {};
    newParams["path"] = `${item.driveId}:${item.driveId}:${item.driveId}:Drive`;
    newParams["courseId"] = `${item.courseId}`;
    history.push("?" + encodeParams(newParams));
  }
  const setDrivecardSelection = useSetRecoilState(drivecardSelectedNodesAtom)
  const clearSelections = useSetRecoilState(clearDriveAndItemSelections);
  const [openEnrollment, setEnrollmentView] = useState(false);
  const role = useRecoilValue(roleAtom);

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
  let hideUnpublished = true;
  if (role === "Instructor") {
    hideUnpublished = false;
  }
  let urlClickBehavior = '';
  if(role === 'Instructor'){
    urlClickBehavior = 'select';
  }
  let responsiveControls = '';
  if(role === 'Instructor' && routePathDriveId){
    responsiveControls =<Button value={openEnrollment ? "Close Enrollment" : "Open Enrollment"} callback={(e)=>setEnrollment(e)}></Button> 
   }

   const profile = useContext(ProfileContext)

   if (profile.signedIn === "0"){
     return (<>
      <GlobalFont/>
     <Tool>
 
       <headerPanel title="Course">
       </headerPanel>
 
       <mainPanel>
         <div style={{margin:"10px"}}>
           <h1>You are not signed in</h1>
           <h2>Course currently requirers sign in for use</h2> 
           <h2><a href='/signin'>Sign in with this link</a></h2>
           </div>
       </mainPanel>
     
      
     </Tool>
     </>
     )
   }
  return (
    <Tool>
     <headerPanel title="Course" />
     <navPanel isInitOpen>
      <GlobalFont/>
      <div style={{marginBottom:"40px",height:"100vh"}} 
       onClick={useOutsideDriveSelector} 
       >
      <Drive driveId={routePathDriveId}  foldersOnly={true} />
      </div>
      </navPanel>

      <mainPanel responsiveControls={responsiveControls}
      // responsiveControls={routePathDriveId ? 
      // <Button value={openEnrollment ? "Close Enrollment" : "Open Enrollment"} callback={(e)=>setEnrollment(e)}></Button>: ''}
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
          <Drive 
          driveId={routePathDriveId}
          hideUnpublished={hideUnpublished}
          // types={['content','course']}  
          urlClickBehavior="select" 
         doenetMLDoubleClickCallback={(info)=>{
         let isAssignment = info.item.isAssignment === '0' ? "content" : "assignment";
          openOverlay({type:isAssignment,branchId: info.item.branchId,contentId:info.item.contentId,courseId:courseId,driveId:routePathDriveId,folderId:routePathFolderId,itemId:info.item.itemId,title: info.item.label});
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
            {!routePathDriveId &&<h2>Admin</h2>}
              <DriveCards
              routePathDriveId={routePathDriveId}
              isOneDriveSelect={true} 
              types={['course']}
              subTypes={['Administrator']}
              driveDoubleClickCallback={({item})=>{DriveCardCallBack({item})}}/>
              {!routePathDriveId &&<h2>Student</h2>}
              <DriveCards 
              routePathDriveId={routePathDriveId}
              isOneDriveSelect={true} 
              types={['course']}     
              subTypes={['Student']}
              driveDoubleClickCallback={({item})=>{DriveCardCallBack({item})}}/>
       
        </div>     
        </>
}
         </mainPanel>
    </Tool>
  );
}
