/**
 * External dependencies
 */
import React, { useEffect, useState, useContext } from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/xml/xml';
// import 'codemirror/theme/material.css';
import 'codemirror/theme/xq-light.css';
// import 'codemirror/theme/neo.css';
// import 'codemirror/theme/base16-light.css';
import { 
  useRecoilValue, 
  atom, 
  atomFamily,
  // selector,
  selectorFamily,
  useSetRecoilState,
  useRecoilState,
  useRecoilValueLoadable,
  // useRecoilStateLoadable, 
  useRecoilCallback
} from "recoil";
/**
 * Internal dependencies
 */
import Tool from '../_framework/Tool';
import GlobalFont from '../../_utils/GlobalFont';
import DoenetViewer from '../../Viewer/DoenetViewer';

 export default function Docs(props){
   console.log("props",props);
   const [selectedComponentDoenetML,setSelectedComponentDoenetML] = useState()
   
   const onSelectComponent = async (componentName) =>{
    const newComponent = await import(`./DocsDoenetML/Slider.txt`)
     setSelectedComponentDoenetML(newComponent.default)
   }

   const DoenetViewerPanel = () =>{
    let attemptNumber = 1;
    let requestedVariant = { index: attemptNumber }
    let solutionDisplayMode = "button";

     return <DoenetViewer
     key={"doenetviewer" + selectedComponentDoenetML }
     doenetML={selectedComponentDoenetML}
     flags={{
       showCorrectness: true,
       readOnly: false,
       solutionDisplayMode: solutionDisplayMode,
       showFeedback: true,
       showHints: true,
     }}
     attemptNumber={attemptNumber}
     ignoreDatabase={true}
     requestedVariant={requestedVariant}
     /> 
   }

   return(
     <>
    <GlobalFont />
    <Tool>
      <headerPanel title="Docs"></headerPanel>
       <navPanel isInitOpen>
       <ul>
          {['Slider','Answer'].map(componentName => {
            if (componentName === 'Slider') {
              return (<li key={componentName}>
                <button onClick={() => onSelectComponent(componentName)}>
                  {componentName}
                </button>
              </li>) 
            } else {
              return (<li key={componentName} >
                <button onClick={() => onSelectComponent(componentName)}>
                  {componentName}
                </button>
              </li>) 
            }
          })}
        </ul>
       </navPanel>
       <mainPanel>
         
       <CodeMirror
       className="CodeMirror"
       value={selectedComponentDoenetML}
  
      />
       </mainPanel>
       <supportPanel isInitOpen>
         <DoenetViewerPanel />

       </supportPanel>

     </Tool>
     </>
   )
 }