import React, { useRef, useState } from "react";
import { useToolControlHelper } from "../imports/Tool/ToolRoot"
import Tool from "../imports/Tool/Tool"
import Button from "../imports/PanelHeaderComponents/Button";
import Drive, { 
  folderDictionarySelector, 
  folderInfoSelectorActions,
  globalSelectedNodesAtom, 
  folderDictionary, 
  clearDriveAndItemSelections,
  fetchDrivesSelector,
  encodeParams,
  fetchDriveUsers,
  fetchDrivesQuery
} from "../imports/Drive";// import { DateInput } from "@blueprintjs/datetime";

  function Container(props){
    return <div
    style={{
        maxWidth: "850px",
        // border: "1px red solid",
        margin: "20px",
    }
    }
    >
        {props.children}
    </div>
  }



export default function DoenetTemp(props){
    const { openOverlay } = useToolControlHelper();

    return (<>
      <Tool>
          <headerPanel title="Temp">

          </headerPanel>
          <navPanel>
          <Drive types={['content','course']}  foldersOnly={true} />

          </navPanel>
          <mainPanel>
            {/* <Button value="content Overlay" callback={()=>{
                openOverlay({type:"overlay",branchId:"branch213werfghbfdvcsd",title:"content overlay"}) }}></Button> */}

      <Drive types={['content','course']}  urlClickBehavior="select" 
        doenetMLDoubleClickCallback={(info)=>{
          console.log("contentId temp" ,info.item );
          openOverlay({type:"overlay",branchId:info.item.branchId,contentId:"8ccc4ce815c5c78421cfcbb3135311bcad2e7dc9e8f6905f0e7d615fea479c62",title:"content overlay"});
          }}/>
          </mainPanel>
          <supportPanel>
          <Button value="support Overlay" callback={()=>{
                openOverlay({type:"overlay",branchId:"branch213werfghbfdvcsd",title:"support overlay"}) }}></Button>
          </supportPanel>
          <menuPanel title="content Info">

          </menuPanel>
      </Tool>

        </>
       
    )
}




