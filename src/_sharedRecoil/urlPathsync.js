/**
 * External dependencies
 */
import React, { useEffect, useRef } from "react";
import {
  useHistory
} from "react-router-dom";
import {
  useRecoilState,
 
} from "recoil";
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

/**
 * Internal dependencies
 */
import  {
  encodeParams,
  drivePathSyncFamily
} from "../_reactComponents/Drive/Drive";


export function URLPathSync(props){

  const [drivePath,setDrivePath] = useRecoilState(drivePathSyncFamily("main"))
  const history = useHistory();
  const init = useRef(true);
  const sourceOfPathChange = useRef(false);

  useEffect(()=>{
    if (!sourceOfPathChange.current){
      let urlParamsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));
      if (urlParamsObj?.path){
        const  [routePathDriveId,routePathFolderId,pathItemId,type] = urlParamsObj.path.split(":");
        setDrivePath({driveId:routePathDriveId,parentFolderId:routePathFolderId,itemId:pathItemId,type})
      }
    }
    sourceOfPathChange.current = false;
    
  },[props.route, setDrivePath])


  useEffect(()=>{
    let urlParamsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));
    //Update the URL Parameter if drivePath changes
    let changed = false;
    if (urlParamsObj?.path){
      const  [routePathDriveId,routePathFolderId,pathItemId,type] = urlParamsObj.path.split(":");

      if (routePathDriveId !== drivePath.driveId ||
        routePathFolderId !== drivePath.parentFolderId ||
        pathItemId !== drivePath.itemId
        ){
          changed = true;
        }
    }else{
      //When first open and no path parameter
      changed = true;
    }

    if (changed && !init.current){
      let newParams = {...urlParamsObj} 
      newParams['path'] = `${drivePath.driveId}:${drivePath.parentFolderId}:${drivePath.itemId}:${drivePath.type}`
      history.push('?'+encodeParams(newParams))
      sourceOfPathChange.current = true;

    }
    init.current = false;
    
  },[drivePath])
  
  return null;
}