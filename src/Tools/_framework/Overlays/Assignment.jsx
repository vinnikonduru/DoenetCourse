import React, { useEffect, useState, useRef } from "react";
import Tool from "../Tool";

import { 
  useRecoilValue, 
  atom, 
  useRecoilCallback
} from "recoil";
import DoenetViewer from '../../../Viewer/DoenetViewer';
import { fileByContentId } from "./Editor";
export const assignmentDoenetMLAtom = atom({
  key:"assignmentDoenetMLAtom",
  default:{updateNumber:0,doenetML:"",attemptnumber:0}
})


export default function Assignment({ courseId, branchId, assignmentId }) {
  let initDoenetML = useRecoilCallback(({snapshot,set})=> async (contentId)=>{
    const response = await snapshot.getPromise(fileByContentId(contentId));
    const doenetML = response.data;
    const assignmentObj = await snapshot.getPromise(assignmentDoenetMLAtom);
    const updateNumber = assignmentObj.updateNumber+1;
    set(assignmentDoenetMLAtom,{updateNumber,doenetML})
  })

  useEffect(() => {
    initDoenetML(assignmentId ? assignmentId : branchId)
}, []);
  function DoenetViewerPanel(props){
    const assignmentDoenetML = useRecoilValue(assignmentDoenetMLAtom);
    console.log("assignmentDoenetML",assignmentDoenetML);
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

      <menuPanel title={"Assignment Info"}>assignment Info</menuPanel>
    </Tool>
  );
}
