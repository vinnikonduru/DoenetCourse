import React, { useEffect, useState, useRef } from "react";
import Tool from "../Tool";
import { useToolControlHelper } from "../ToolRoot";
import axios from "axios";
import sha256 from 'crypto-js/sha256';
import CryptoJS from 'crypto-js';
import  VisibilitySensor from 'react-visibility-sensor';
import Button from "../../PanelHeaderComponents/Button";
import { nanoid } from 'nanoid';

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
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/xml/xml';
// import 'codemirror/theme/material.css';
import 'codemirror/theme/xq-light.css';
// import 'codemirror/theme/neo.css';
// import 'codemirror/theme/base16-light.css';

import './editor.css';
import { fileByContentId , editorInitAtom,viewerDoenetMLAtom,editorDoenetMLAtom} from "./Editor";
// import {DoenetViewerPanel } from "./Editor";

export default function Overlay({ branchId = '',contentId ='',title }) {

  let initDoenetML = useRecoilCallback(({snapshot,set})=> async (contentId)=>{
    console.log("contentId" , contentId);
    const response = await snapshot.getPromise(fileByContentId(contentId));
    const doenetML = response.data;
    console.log("Doenet ml !!!!!!",doenetML);
    set(editorDoenetMLAtom,doenetML);
    const viewerObj = await snapshot.getPromise(viewerDoenetMLAtom);
    const updateNumber = viewerObj.updateNumber+1;
    set(viewerDoenetMLAtom,{updateNumber,doenetML})
   set(editorInitAtom,true);
  })

  const setEditorInit = useSetRecoilState(editorInitAtom);
  useEffect(() => {
    initDoenetML(branchId ? branchId : contentId )
    return () => {
      setEditorInit(false);
    }
}, []);

const viewerDoenetML = useRecoilValue(viewerDoenetMLAtom);
const editorInit = useRecoilValue(editorInitAtom);

if (!editorInit){ return null; }

let attemptNumber = 1;
let requestedVariant = { index: attemptNumber }
let assignmentId = "myassignmentid";
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
        readOnly: false,
        solutionDisplayMode: solutionDisplayMode,
        showFeedback: true,
        showHints: true,
      }}
      attemptNumber={attemptNumber}
      assignmentId={assignmentId}
      ignoreDatabase={false}
      requestedVariant={requestedVariant}
      /> 
        <p>Test content overlay</p>
        {/* <div><DoenetViewerUpdateButton  /></div>
        <div style={{overflowY:"scroll", height:"calc(100vh - 84px)" }}><DoenetViewerPanel1 /></div> */}
      </mainPanel>

      {/* <supportPanel isInitOpen>
      <TempEditorHeaderBar branchId={branchId} />
          <TextEditor  branchId={branchId}/>
      </supportPanel> */}

      <menuPanel>
        {/* <VersionHistoryPanel branchId={branchId} /> */}
      </menuPanel>
    </Tool>
  );
}

