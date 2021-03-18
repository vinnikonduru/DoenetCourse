import React, { useRef, useState } from "react";
import { useToolControlHelper } from "../imports/Tool/ToolRoot"
import Tool from "../imports/Tool/Tool"
import Button from "../imports/PanelHeaderComponents/Button";

// import { DateInput } from "@blueprintjs/datetime";

// import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
// import "@blueprintjs/core/lib/css/blueprint.css";
// import "./dateTime.css";

//Passes up the selected date through a onDateChange(selectedDate: Date) prop


export default function DoenetTemp(props){
    const { openOverlay } = useToolControlHelper();

    return (<>
      <Tool>
          <headerPanel title="Temp">

          </headerPanel>
          <navPanel>

          </navPanel>
          <mainPanel>
            <Button value="content Overlay" callback={()=>{
                openOverlay({type:"overlay",branchId:"branch213werfghbfdvcsd",title:"content overlay"}) }}></Button>
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


