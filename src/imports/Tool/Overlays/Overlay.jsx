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


export default function Overlay({ branchId, title }) {



  return (
    <Tool>
      <headerPanel title={title}>
      </headerPanel>

      <mainPanel>
        <DoenetViewer />
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

