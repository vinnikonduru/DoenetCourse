
import React, { useState } from "react";
import ToolLayout from "./ToolLayout/ToolLayout";
import ToolLayoutPanel from "./ToolLayout/ToolLayoutPanel";
import styled from "styled-components";
import ControlGroup from "../imports/PanelHeaderComponents/ControlGroup";
import SearchBar from "../imports/PanelHeaderComponents/SearchBar.js";
import Textfield from "../imports/PanelHeaderComponents/Textfield.js";
import VerticalDivider from "../imports/PanelHeaderComponents/VerticalDivider.js";
import Button from "../imports/PanelHeaderComponents/Button.js";
import ActionButton from "../imports/PanelHeaderComponents/ActionButton.js";
import ToggleButton from "../imports/PanelHeaderComponents/ToggleButton.js";
const alphabet =
  "a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z ";

export default function DoenetExampleTool(props) {

  const mainControls = [ 
  <ControlGroup> <Button /> <ActionButton /><SearchBar/><ToggleButton/></ControlGroup> ,
  <VerticalDivider/>,
  <ControlGroup> <Button /> <ActionButton /><Textfield/><ToggleButton/></ControlGroup>
  
  ];


  return (
    <>     <ToolLayout toolName="my example"
      headingTitle="Example tool"


    >
      <ToolLayoutPanel
        panelName="Support"
        purpose="support">
        start support{alphabet}{alphabet}{alphabet}{alphabet}{alphabet}end

          </ToolLayoutPanel>

      <ToolLayoutPanel
        panelHeaderControls={mainControls}
        panelName="Main"
        // purpose="main"
      >
        start main{alphabet}{alphabet}{alphabet}{alphabet}{alphabet}{alphabet}end
        </ToolLayoutPanel>


      <ToolLayoutPanel
        isLeftPanel={true}
        purpose="navigation"
      >
        start navigation {alphabet} {alphabet} {alphabet}{alphabet} {alphabet}end
        </ToolLayoutPanel>
    </ToolLayout>
    </>
  );
}


// import React from 'react';
// import SearchBar from "../imports/PanelHeaderComponents/SearchBar.js";
// import Textfield from "../imports/PanelHeaderComponents/Textfield.js";
// import VerticalDivider from "../imports/PanelHeaderComponents/VerticalDivider.js";
// import Button from "../imports/PanelHeaderComponents/Button.js";
// import ActionButton from "../imports/PanelHeaderComponents/ActionButton.js";
// import ToggleButton from "../imports/PanelHeaderComponents/ToggleButton.js";

// export default function attempt() {
// return (
// <div>
//   <p>Button</p>
//   <Button/>
//   <p>ToggleButton</p>
//   <ToggleButton/>
//   <p>ActionButton</p>
//   <ActionButton/>
//   <p>textfield</p>
//   <Textfield/>
//   <p>searchbar</p>
//   <SearchBar/>
  
// </div>
// );
// };






  // import React from 'react';
// import VerticalDivider from "../Doenet/components/VerticalDivider.js";
// import ToolLayout from '../Tools/ToolLayout/ToolLayout.js';
// import ToolLayoutPanel from '../Tools/ToolLayout/ToolLayoutPanel.js';
// import { getCourses_CI, setSelected_CI, saveCourse_CI } from "../imports/courseInfo";

// export default function attempt() {
//      //Save new course in IndexedDB
//     //  getCourses_CI({courseId, courseName, courseCode, term, description, department, section})
//     let courseId = "mycourseid";
//     let courseName = "my test course";
//     let courseCode = "my101"
//     let term = "Spring 2020"
//     let description = "my description"
//     let department = "dep"
//     let section = "01"

//     // getCourses_CI({courseId, courseName, courseCode, term, description, department, section})
// return (
//   <>
//    <button onClick={()=>{
//      console.log('before')
//      saveCourse_CI({courseId, courseName, courseCode, term, description, department, section})

//    }
//      } >  test add</button>
//   </>
// );
// }
