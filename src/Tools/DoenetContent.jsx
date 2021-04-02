import React,{useEffect} from 'react';
import Tool from "../imports/Tool/Tool";
import DoenetViewer from './DoenetViewer';
import { 
  useRecoilValue, 
  useRecoilCallback,
  atom, 
} from "recoil";
import {fileByContentId} from '../imports/Tool/Overlays/Editor';

const contentDoenetMLAtom = atom({
  key:"contentDoenetMLAtom",
  default:{updateNumber:0,doenetML:""}
})

 const DoenetContent = (props) => {

// console.log("props",props);
  let urlParamsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));
  let newParams = {...urlParamsObj} 

  console.log("new params", newParams)

  let initDoenetML = useRecoilCallback(({snapshot,set})=> async (contentId)=>{
    const response = await snapshot.getPromise(fileByContentId(contentId));
    const doenetML = response.data;
    const viewerObj = await snapshot.getPromise(contentDoenetMLAtom);
    const updateNumber = viewerObj.updateNumber+1;
    set(contentDoenetMLAtom,{updateNumber,doenetML})
  })

  useEffect(() => {
    initDoenetML(newParams.contentId)
 }, []);

 const viewerDoenetML = useRecoilValue(contentDoenetMLAtom);

 let attemptNumber = 1;
 let requestedVariant = { index: attemptNumber }
   return(
     <>
     {newParams.contentId ? <Tool>
       <headerPanel title="Content"></headerPanel>
       <mainPanel>
         <DoenetViewer
      key={"doenetviewer" + viewerDoenetML?.updateNumber}
      doenetML={viewerDoenetML?.doenetML}
      flags={{
        showCorrectness: true,
        readOnly: true,
        showFeedback: true,
        showHints: true,
      }}
      ignoreDatabase={false}
      requestedVariant={requestedVariant}    
       /> 
       </mainPanel>
     </Tool>
     : <p>Need a contentId to display content...!</p>}
     
     </>
   )

}

export default DoenetContent