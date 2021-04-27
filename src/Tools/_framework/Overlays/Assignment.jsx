/**
 * External dependencies
 */
import React, { useEffect, useState, useRef } from "react";
import {
  atom,
  useSetRecoilState,
  useRecoilValue,
  selector,
  useRecoilState,
  selectorFamily,
  useRecoilValueLoadable,
  useRecoilStateLoadable,
  useRecoilCallback,
  atomFamily
} from "recoil";
import axios from "axios";


/**
 * Internal dependencies
 */
import Tool from "../Tool";
import DoenetViewer from '../../../Viewer/DoenetViewer';
import { fileByContentId } from "./Editor";
import { 
  useAssignmentCallbacks
} from "../../../_reactComponents/Drive/DriveActions";
import {
  useAssignment
} from "../../course/CourseActions";
import { assignmentDictionary } from '../../_framework/Overlays/Content';
import ToggleButton from '../../../_reactComponents/PanelHeaderComponents/ToggleButton'

export const assignmentDoenetMLAtom = atom({
  key:"assignmentDoenetMLAtom",
  default:{updateNumber:0,doenetML:"",attemptnumber:0}
})


export default function Assignment({ branchId = '',contentId ='',title,courseId = '',driveId='' ,folderId='',itemId='',assignmentId='' }) {
  let initDoenetML = useRecoilCallback(({snapshot,set})=> async (contentId)=>{
    const response = await snapshot.getPromise(fileByContentId(contentId));
    const doenetML = response.data;
    const assignmentObj = await snapshot.getPromise(assignmentDoenetMLAtom);
    const updateNumber = assignmentObj.updateNumber+1;
    set(assignmentDoenetMLAtom,{updateNumber,doenetML})
  })

  const {assignmentToContent, onAddAssignmentError } = useAssignment();
  const { publishAssignment, 
    onPublishAssignmentError,
    publishContent,
    onPublishContentError,
    updateAssignmentTitle,
    onUpdateAssignmentTitleError,
    convertAssignmentToContent,
    onConvertAssignmentToContentError } = useAssignmentCallbacks();

  const [updateAssignmentInfo,setAssignmentForm] = useRecoilState(assignmentDictionary({itemId: itemId,
    courseId: courseId,
    driveId: driveId,
    folderId: folderId,
    contentId:contentId,
    branchId:branchId
  }));

console.log(">>>>>>>>>updateAssignmentInfo",updateAssignmentInfo);
  useEffect(() => {
    initDoenetML(assignmentId ? assignmentId : branchId)
}, []);


  function DoenetViewerPanel(props){
    const assignmentDoenetML = useRecoilValue(assignmentDoenetMLAtom);
    // console.log("assignmentDoenetML",assignmentDoenetML);
    let attemptNumber = 1;
    let requestedVariant = { index: attemptNumber }
    let solutionDisplayMode = "button";
  
  
    return <DoenetViewer
        key={"doenetviewer" + assignmentDoenetML?.updateNumber}
        doenetML={assignmentDoenetML?.doenetML}
        flags={{
          showCorrectness: true,
          readOnly: true,
          solutionDisplayMode: solutionDisplayMode,
          showFeedback: true,
          showHints: true,
        }}
        attemptNumber={attemptNumber}
        assignmentId={assignmentId}
        ignoreDatabase={false}
        requestedVariant={requestedVariant}
        /> 
  }


  const handleMakeContent = (e) => {
    let payload = {
      itemId: itemId,
    };
    axios.post(`/api/handleMakeContent.php`, payload).then((response) => {
      console.log(response.data);
    });
    assignmentToContent();
    // setAssignmentForm((old)=>{
    //   return  {...old, [isAssignment]: 0}  
    // })
    convertAssignmentToContent({
      driveIdFolderId:{
        driveId: driveId,
        folderId: folderId,
      },
      itemId: itemId,
      assignedDataSavenew: payload,
    })
  };



  
  return (
    <Tool>
      <headerPanel></headerPanel>

      <mainPanel>
      <div
         style={{overflowY:"scroll", height:"calc(100vh - 84px)" }}>
           <DoenetViewerPanel />
         </div>
      </mainPanel>

      <supportPanel></supportPanel>

      <menuPanel title={"Assignment Info"} isInitOpen>
        
        { (
        <ToggleButton value="Make Content" callback={handleMakeContent} />
      )}
      </menuPanel>
    </Tool>
  );
}
