import React, { useEffect, useState, useRef } from "react";
import Tool from "../Tool";

import { 
  useRecoilValue, 
  atom, 
  atomFamily,
  selector,
  selectorFamily,
  useSetRecoilState,
  useRecoilState,
  useRecoilValueLoadable,
  useRecoilStateLoadable, 
  useRecoilCallback
} from "recoil";
import DoenetViewer from '../../../Tools/DoenetViewer';
import { fileByContentId } from "./Editor";
export const viewerContentDoenetMLAtom = atom({
  key:"viewerContentDoenetMLAtom",
  default:{updateNumber:0,doenetML:""}
})

export default function Content({ branchId = '',contentId ='',title }) {

  let initDoenetML = useRecoilCallback(({snapshot,set})=> async (contentId)=>{
    const response = await snapshot.getPromise(fileByContentId(contentId));
    const doenetML = response.data;
    const viewerObj = await snapshot.getPromise(viewerContentDoenetMLAtom);
    const updateNumber = viewerObj.updateNumber+1;
    set(viewerContentDoenetMLAtom,{updateNumber,doenetML})
  })

  useEffect(() => {
    // let branchIdContentId=''
    // if(contentId){
    //   branchIdContentId=contentId
    // }else if(branchId && contentId){
    //   branchIdContentId = contentId
    // }else{
    //   branchIdContentId = 
    // }
    // initDoenetML(branchId ? branchId : contentId )
    initDoenetML(contentId ? contentId : branchId )
    
}, []);

const viewerDoenetML = useRecoilValue(viewerContentDoenetMLAtom);


let attemptNumber = 1;
let requestedVariant = { index: attemptNumber }
let solutionDisplayMode = "button";
  return (
    <Tool>
      <headerPanel title={title}>
      </headerPanel>

      <mainPanel>
      <DoenetViewer
      key={"doenetviewer" + viewerDoenetML?.updateNumber}
      doenetML={viewerDoenetML?.doenetML}
      flags={{
        showCorrectness: true,
        readOnly: true,
        solutionDisplayMode: solutionDisplayMode,
        showFeedback: true,
        showHints: true,
      }}
      attemptNumber={attemptNumber}
      ignoreDatabase={false}
      requestedVariant={requestedVariant}
      /> 
      </mainPanel>

    </Tool>
  );
}

