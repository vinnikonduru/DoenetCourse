import React from 'react';
// import { useLocation } from 'react-router';
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil';
import { toolViewAtom, searchParamAtomFamily, pageToolViewAtom } from '../NewToolRoot';
import { globalSelectedNodesAtom } from '../../../_reactComponents/Drive/NewDrive';
import { selectedMenuPanelAtom } from '../Panels/NewMenuPanel';

// let encodeParams = p => Object.entries(p).map(kv => 
//   kv.map(encodeURIComponent).join("=")).join("&");

export default function DrivePanel(props){
  console.log(">>>===DrivePanel")
  const path = useRecoilValue(searchParamAtomFamily('path'))
const setPageToolView = useSetRecoilState(pageToolViewAtom);


  // let location = useLocation();

  // const setPath = useRecoilCallback(({set})=>(path)=>{
  //   let urlParamsObj = Object.fromEntries(new URLSearchParams(location.search));
  //   urlParamsObj['path'] = path;
  //   const url = location.pathname + '?' + encodeParams(urlParamsObj);

  //   window.history.pushState('','',`/new#${url}`)
  //   set(searchParamAtomFamily('path'),path)
  // })

  const setSelections = useRecoilCallback(({set})=>(selections)=>{
    console.log(">>>selections",selections)
    set(selectedMenuPanelAtom,"SelectedDoenetId");
    set(globalSelectedNodesAtom,selections);
  })


  //Keep this to speed up hiding 
  if (props.style?.display === "none"){
    return <div style={props.style}></div>
  }



  
  return <div style={props.style}><h1>drive</h1>
  <p>put drive here</p>
  <div>path: {path}</div>
  <div><button onClick={(e)=>{e.stopPropagation();setPageToolView((was)=>({...was,params:{path:'f1'}}))}}>path to f1</button></div>
  <div><button onClick={(e)=>{e.stopPropagation();setPageToolView((was)=>({...was,params:{path:'f2'}}))}}>path to f2</button></div>
  <div><button onClick={(e)=>{e.stopPropagation();setPageToolView((was)=>({...was,params:{path:'f3'}}))}}>path to f3</button></div>
  <hr />
  {/* set(selectedMenuPanelAtom,"SelectedDoenetId"); //replace selection */}

  <div><button onClick={(e)=>{e.stopPropagation();setSelections([{doenetId:'0mgbplfx_5d8n40WgRh0e',driveId:'0gcWRwzWL-gAlgFkF6oxW',itemId:'0R-MRr8K-o7ubTkJEIoui',parentFolderId:'0gcWRwzWL-gAlgFkF6oxW',contentId:'6039092f70864b935e614eaf0ff41bcb91357e8e746997f9af55f5b9f7f8f684',versionId:'UWowjL0MMTLZPzL4NWJN4',isAssigned:'0'}])}}>select f1</button></div>
  <div><button onClick={(e)=>{e.stopPropagation();setSelections(['f1','f2'])}}>select f1 and f2</button></div>
  <hr />
  <div><button onClick={(e)=>{e.stopPropagation();setPageToolView((was)=>{ let newObj = {...was};newObj['tool'] = 'editor'; newObj['params']={doenetId:'JRP26MJwT93KkydNtBQpO'}; return newObj; })}}>Edit c1</button></div>


  </div>
}