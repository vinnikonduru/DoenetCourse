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
import { fileByContentId } from "./Editor";
// import {DoenetViewerPanel } from "./Editor";
export const viewerOverlayDoenetMLAtom = atom({
  key:"viewerOverlayDoenetMLAtom",
  default:{updateNumber:0,doenetML:""}
})

export default function Overlay({ branchId = '',contentId ='',title }) {

  let initDoenetML = useRecoilCallback(({snapshot,set})=> async (contentId)=>{
    console.log("contentId" , contentId);
    const response = await snapshot.getPromise(fileByContentId(contentId));
    const doenetML = response.data;
    const viewerObj = await snapshot.getPromise(viewerOverlayDoenetMLAtom);
    const updateNumber = viewerObj.updateNumber+1;
    set(viewerOverlayDoenetMLAtom,{updateNumber,doenetML})
  })

  useEffect(() => {
    initDoenetML(branchId ? branchId : contentId )
    
}, []);

const viewerDoenetML = useRecoilValue(viewerOverlayDoenetMLAtom);


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

