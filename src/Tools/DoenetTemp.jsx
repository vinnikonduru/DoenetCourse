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
        <Container>
        <Drive types={['content','course']}  urlClickBehavior="select" 
              doenetMLDoubleClickCallback={(info)=>{
                openOverlay({type:"content",branchId:info.item.branchId,contentId:"",title:info.item.label});
                // openOverlay({type:"content",branchId:'info.item.branchId',contentId:"593d393a9bc17ff1d3359901d6305ef647651e2a36acc893cbda20b25b374970",title:info.item.label});
                }}/>
        </Container>

          </mainPanel>
          <supportPanel>
          <Button value="support Overlay" callback={()=>{
                openOverlay({type:"content",branchId:"branch213werfghbfdvcsd",title:"support overlay"}) }}></Button>
          </supportPanel>
          <menuPanel title="content Info">

          </menuPanel>
      </Tool>

        </>
       
    )
}




