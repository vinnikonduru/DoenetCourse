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
                openOverlay({type:"content",branchId:"branch213werfghbfdvcsd",title:"content overlay"}) }}></Button> */}
        <Container>
        <Drive types={['content','course']}  urlClickBehavior="select" 
              doenetMLDoubleClickCallback={(info)=>{
                console.log(">>>info temp" ,info.item );
                openOverlay({type:"content",branchId:info.item.branchId,contentId:"",title:info.item.label});
                // openOverlay({type:"content",branchId:'',contentId:"ce25342ebb41c5792b17332855cbda9ba694fc8e2aaefe2a8d2d1b305e305778",title:info.item.label});
                // openOverlay({type:"content",branchId:info.item.branchId,title:info.item.label});

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




