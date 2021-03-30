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
                if("5559e51c42587e820d2c09f903429412760fa64a40159a3f0308640487accee5".length > 21){
                  openOverlay({type:"content",branchId:'info.item.branchId',contentId:"5559e51c42587e820d2c09f903429412760fa64a40159a3f0308640487accee5",title:info.item.label});
                }
                // openOverlay({type:"content",branchId:info.item.branchId,contentId:"",title:info.item.label});
                // openOverlay({type:"content",branchId:'',contentId:"77114962473d15cd31268efb9d94492f8df113ac60f5fe233777fd6f63f0a4e5",title:info.item.label});

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




