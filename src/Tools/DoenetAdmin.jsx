import React, { Component } from 'react';
import DoenetViewer from './DoenetViewer';
import DoenetBox from '../Tools/DoenetBox';
import axios from 'axios';
import MersenneTwister from 'mersenne-twister';
import './admin.css';
import { nanoid } from 'nanoid';
import DoenetHeader from './DoenetHeader';
import { faWindowClose, faEdit, faArrowUp,faArrowDown,faArrowLeft,faArrowRight,faPlus,faFolderPlus} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

function hashStringToInteger(s) {
  var hash = 0, i, chr;
  if (s.length === 0) return hash;
  for (i = 0; i < s.length; i++) {
    chr   = s.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

let assignmentID = null;

class DoenetAdmin extends Component {
  constructor(props){
    super(props);
     console.log("===RESTART===")
    this.assignmentIndex = 0;
    this.loadingScreen = (<React.Fragment><p>Loading...</p></React.Fragment>);
    this.doenetML="";
    this.listOfOptions=["None","Gateway","Problem Sets","Projects","Exams","Participation"]
      const envurl='/api/env.php';
      axios.get(envurl)
        .then(resp=>{
            this.userId = resp.data.userId;
            this.access = resp.data.access;
            this.adminAccess=resp.data.adminAccess;
            this.forceUpdate();
        });
     
      
    let url_string = window.location.href;
    var url = new URL(url_string);
    
    this.userId = "";
    this.courseId = "aI8sK4vmEhC5sdeSP3vNW"; //Temporary TODO: Choose courses
    this.courseName = "Calculus and Dynamical Systems in Biology";
    this.gradeCategories = ['Gateway','Problem Sets','Projects','Exams','Participation'];
    this.assignmentId = url.searchParams.get("assignmentId");
    this.activeSection = url.searchParams.get("active");
    this.assignment_state_1 = url.searchParams.get("assignment"); // get false
    this.months = {
    "Jan":"01",
    "Feb":"02",
    "Mar":"03",
    "Apr":"04",
    "May":"05",
    "June":"06",
    "Jul":"07",
    "Aug":"08",
    "Sep":"09",
    "Oct":"10",
    "Nov":"11",
    "Dec":"12"
  }
    this.enableThese=[]
    // this.calendar=null
    this.rightSideInfoColumn = null
    this.AssignmentInfoPackageReady = false
    this.AssignmentInfoChanged=false;
    this.overview_branchId=""
    this.syllabus_branchId=""
    this.selectedAssignmentId=""
    this.state = {
      courseId: "",
      error: null,
      errorInfo: null,
      outlineType:"outline",
      overview:null,
      grade:null,
      assignment:null,
      syllabus:null,
      newChange:false,
      loadingTree:false,
      changeToTree:false,
      enableMode:"position",
      showTree:false,
      selectedAssignmentId:"",
    };
    if (this.assignment_state_1===undefined || this.assignment_state_1===null){
      this.assignment_state_1=true
    } else {
      this.assignment_state_1=false
    }


    this.assignmentsData = null;
    this.DoneLoading=false;
    /**
         * to construct a tree:
         * construct an array that contains objects 
         * (key is id with no pId, value is level, which is 0)
         * secondly,
         *  place pointer at first Id and find what id that it is a pId.
         *  level is value of first id +1. if found
         *  then add that right after the first Id with the current level
         *  when reach the end of this.arr_return, place pointer at second.
         * thirdly, we level is value of second id +1, it will find its children
         */

    // getting info for creating tree from DB
     this.result_arr=[];
    console.log("CREATING SOME ID");
    console.log(nanoid())
    const url_header_assignment = "/api/getHeaderAndAssignmentInfo.php";
     this.arr_return=[];
     this.id_arr=[];
     this.thisAssignmentInfo=""
     this.assignmentName=null;
     this.individualize=false;
     this.multipleAttempts=false;
     this.showSolution=false;
     this.showFeedback=false;
     this.showHints=false;
     this.showCorrectness=false;
     this.proctorMakesAvailable=false;
     this.assignment_branchId = null;
     this.dueDate="";
     this.gradeCategory=""
     this.totalPointsOrPercent=""
     this.assignedDate="";
     this.timeLimit=null;
     this.numberOfAttemptsAllowed=0;

     this.AddedAssignmentObjArray = [ 
       // this contains contentIds NOT assignmentId,
      // assignmentId created 
       'T0XvjDItzSs_GXBixY8fa',
       'z3rOQm9o6XXjInAZrz6tV',
       'nwrAL9TIEup9ItRdqYhfR'       
      ]
     this.makeTreeArray=[]; // filled in buildTreeArray
     this.tree=[] // made in buildTree
     this.headerId_arr = []
     this.assignmentId_arr=[]
     console.log("inside CONSTRUCTOR")
      // this.buildTreeArray()
      // this.buildTree()
      this.obj_return={};
      this.heading_obj={};
      this.assignment_obj={};
      this.listOfAssignmentIdNeedDeletingFromDB = []
      this.enableMode='position'
    axios (url_header_assignment)
      .then (resp=>{
        console.log("RUNNING PHP")
        this.obj_return = resp.data;
        //let lengthOfReturnArray = (this.obj_return.length)
        console.log("obj is")
        console.log(resp.data )
        let iterator=0;      
        let keys = (Object.keys(this.obj_return));
        let length = keys.length;
        while (iterator<length){
          let currentId = keys[iterator];
          let title = this.obj_return[currentId]['title'];
          let parent = this.obj_return[currentId]['parentId']
          if (parent==null || parent=="null" || parent==""){
            parent=null;
          }
          console.log("checking..")
          let currentIdAttribute = this.obj_return[currentId]['type']
          console.log(currentIdAttribute)
          if (currentIdAttribute==='header'){
            let childAssignments = this.obj_return[currentId]['childAssignments']
            let childHeadings = this.obj_return[currentId]['childHeadings']
            let childrenArray = this.obj_return[currentId]['childrenId'];
            
              childrenArray.forEach(element=>{
                if (element!=null && element!=""){
                  let childAttribute = this.obj_return[element]['type']
                  console.log("still checking..")
                  console.log(childAttribute)
                  if (childAttribute==="header"){
                    childHeadings.push(element)
                  } else {
                    childAssignments.push(element)
                  }
                }               
              })
                                   
            this.heading_obj [currentId]={title:title,type:"header",parentId:parent,childHeadings:childHeadings,childAssignments:childAssignments}
          } 
          else {
            let contentId = this.obj_return[currentId]['contentId']
            let branchId = this.obj_return[currentId]['branchId']
            // let assignedDate = this.obj_return[currentId]['assignedDate']
            // let dueDate = this.obj_return[currentId]['dueDate']
            // let numberOfAttemptsAllowed = this.obj_return[currentId]['numberOfAttemptsAllowed']
            this.assignment_obj [currentId]={title:title,type:"assignment",
            parent:parent,branchId:branchId,contentId:contentId,
            // assignedDate:assignedDate,dueDate:dueDate,numberOfAttemptsAllowed:numberOfAttemptsAllowed
          }
          }
          iterator++;
        }
        console.log("DONE LOOPING YES")
        console.log(this.assignment_obj)
          this.buildTreeArray()
          this.buildTree()
          this.forceUpdate();
        
      }).catch(error=>{this.setState({error:error})});
      



    

      const loadUrl = '/api/loadEnable.php'
      this.payLoad = {
        overview:0,
        syllabus:0,
        grade:0,
        assignment:0
      }
      
      axios.get(loadUrl,this.payLoad)
        .then (resp=>{
         
               //!!+ is to convert string to boolean
          this.payLoad.overview=+(resp.data["overview"])
          this.payLoad.grade=+(resp.data["grade"])
          this.payLoad.syllabus=+(resp.data["syllabus"])
          this.payLoad.assignment=+(resp.data["assignment"])
          this.overview_branchId=resp.data["overview_branchId"]
          this.syllabus_branchId=resp.data["syllabus_branchId"]
          // assignment_state =+(resp.data["assignment"])
          // this.enabledDisabledArray = {
          //   overview:!!+payLoad.overview,
          //   syllabus:!!+payLoad.grade,
          //   grade:!!+payLoad.syllabus,
          //   assignment:!!+payLoad.assignment,
          // }


          this.setState({overview:+(resp.data["overview"])})
          this.setState({syllabus:+(resp.data["syllabus"])})
          this.setState({grade:+(resp.data["grade"])})
          this.setState({assignment:+(resp.data["assignment"])})

          // this.state.grade=+(resp.data["grade"])
          // this.state.syllabus=+(resp.data["syllabus"])
          // this.state.assignment=+(resp.data["assignment"])

          // if (!this.assignment_state_1){
          //   this.state.assignment=false;
          // }

          // let foundit=false
          Object.keys(this.payLoad).map((e)=>{
                console.log("looping payload here")
                if (this.payLoad[e]===1 && this.activeSection===null ){
                    console.log("finding")
                    console.log(e)
                    this.activeSection=e
                    this.updateLocationBar()
                    // foundit=true
                    //window.location.href="/admin/?active="+e
                    }
                })
          console.log("ACTIVE is..."+this.activeSection)
          console.log(`The courseId id is ${this.courseId}`);
          if (this.assignment_state_1===false){
            this.state.newChange=true;
          }
          this.DoneLoading=true;
          if(this.activeSection==='overview'){
            this.loadOverview();
          }else if(this.activeSection==='syllabus'){
            this.loadSyllabus();
          } else if (this.activeSection==='grade'){
            this.loadGrades()
          } else if (this.activeSection==="assignment"){
            this.LoadAssignmentFromTheBeginning({location:location})            
          }
          // console.log("done")
          // this.forceUpdate()

        });
         
    this.courseInfo = {};
    this.finishedContructor = false;
 


    
      //Get code and mode from the database
    const loadOutlineUrl='/api/loadOutline.php';
    const data={
      courseId: this.courseId,
    }
    const payload = {
      params: data
    }

    


    this.updateNumber = 0;
    this.updateLocationBar = this.updateLocationBar.bind(this);
    this.buildAssignmentGrades = this.buildAssignmentGrades.bind(this);
    this.buildItemGrade = this.buildItemGrade.bind(this);
    this.buildAttemptItemGradesHelper = this.buildAttemptItemGradesHelper.bind(this);
    this.assignmentDataToCourseInfo = this.assignmentDataToCourseInfo.bind(this);
    this.generateNewAttempt = this.generateNewAttempt.bind(this);
    this.creditUpdate = this.creditUpdate.bind(this);
    this.ToggleList = this.ToggleList.bind(this);
    this.loadGrades = this.loadGrades.bind(this);
    this.EnableThese = this.EnableThese.bind(this);
    this.loadOverview = this.loadOverview.bind(this);
    this.buildTree = this.buildTree.bind(this);
    this.deleteHeader = this.deleteHeader.bind(this);
    this.deleteAssignment = this.deleteAssignment.bind(this);
    this.moveHeaderDown = this.moveHeaderDown.bind(this);
    this.moveHeaderUp = this.moveHeaderUp.bind(this);
    this.addAssignmentIdsUnderHeader = this.addAssignmentIdsUnderHeader.bind(this)
    this.axiosDeleteAssignmentFromDB = this.axiosDeleteAssignmentFromDB.bind(this)
  }

  buildTreeArray(){
    //console.log(this.arr_return[this.id_arr.indexOf(this.id_arr[0])][this.id_arr[0]])
    // first get pId that is null
    // this.result_arr.splice(index,0,obj);=
    this.makeTreeArray=[]
    if (this.heading_obj.length!=1){

    // let assignmentObjectLength = this.assignmentId_arr.length;
    let iterator = 0;
    this.headerId_arr=[]
    let already_built_header_id = {}
    this.assignmentId_arr=[]
    this.makeTreeArray=[]
    // create a header_id_arr to access header_obj

    this.headerId_arr = Object.keys(this.heading_obj)
    let headerObjectLength = this.headerId_arr.length;

    iterator=0;
    this.assignmentId_arr = Object.keys(this.assignment_obj)

    iterator = 0;
    // establish level 0
    this.heading_obj["root"]["childHeadings"].forEach(element=>{
      element= element.toString()
      console.log("loop 1")
      console.log(this.heading_obj[element])
      let title = this.heading_obj[element]["title"]
      let object = {id:element,title:title,type:"header",level:0}
      this.makeTreeArray.unshift(object)
    })

    // add header first, level = level's parent + 1
    iterator = 0;
    
    // .splice(index,0,obj)
     while (iterator < this.makeTreeArray.length){

      //let indexOfHeader = this.headerId_arr.indexOf(this.makeTreeArray[iterator]["id"])
      let currentHeaderObject = 
      this.heading_obj[this.makeTreeArray[iterator]["id"]];

      if (currentHeaderObject["childHeadings"]!=undefined){
        (currentHeaderObject["childHeadings"]).forEach(header=>{
          header = header.toString();
          console.log("loop 2")
          console.log(this.heading_obj[header])
            let title = this.heading_obj[header]["title"];
            let type = "header"
            let newLevel = this.makeTreeArray[iterator]["level"]+1;
            let object = {id:header,title:title,type:type,level:newLevel}
            this.makeTreeArray.splice(iterator+1,0,object)
            already_built_header_id[header]=true;
          //}
        })
      }
      
      iterator++;
    }
   //add assignments
   // add arrow when this.enableMode==='assignment'
    iterator = 0;
    while (iterator < this.makeTreeArray.length){
      if (this.makeTreeArray[iterator]["type"]==="header"){
        let indexOfHeader = this.headerId_arr.indexOf(this.makeTreeArray[iterator]["id"])
        let currentHeaderObject = 
        this.heading_obj[this.makeTreeArray[iterator]["id"]];
      let assignment_list = currentHeaderObject["childAssignments"]
      console.log("assignment list..")
      console.log(assignment_list)
      if (assignment_list!=[]) {
      (assignment_list).forEach(e=>{
        // assume unique assignment has unique headers
        console.log("loop 3")
        console.log(e)
        console.log(this.assignment_obj[e.toString()])
          let title = this.assignment_obj[e.toString()]["title"];
          let newLevel = this.makeTreeArray[iterator]["level"]+1;
          let type = "assignment"
          let object1 = {id:e.toString(),title:title,type:type,level:newLevel}
          this.makeTreeArray.splice(iterator+1,0,object1)
      })
    }
      }
      iterator++;
    }
    }
    
  }
  LoadAssignmentFromTheBeginning ({location}){
    console.log("LoadAssignmentFromTheBeginning")
    console.log(window.location)
    // let path ="/admin/?active=assignment&assignmentId="
    // let index = path.length
    // if (location.length == (path.length+21)){
    // // console.log(location.substring(index))
    // let currentAssignmentId = location.substring(index)
    // console.log("currentAssignmentId")
    // console.log(currentAssignmentId)
    // this.LoadAssignmentFromTheBeginningFlag = true
    // // TODO(me): add IF ASSIGNMENT CAN BE LOADED
    // this.makeTreeVisible({loadSpecificId:currentAssignmentId})
    // // this.loadAssignmentContent({contentId:null,branchId:null,assignmentId:currentAssignmentId})
    // // this.forceUpdate()
    // }
    // else {
    //   this.forceUpdate()
    // }
  }
buildTree(){
  let ClassName = "headerSelection"
  let countChildrenOfUltimate=0
  let lengthChildrenOfUltimate=0
  // making space
  this.tree = [];
  let addHeaderToTheEndOfRoot=(<span className="Section-Icon-Box">         
      <FontAwesomeIcon className="Section-Icon" 
       onClick ={()=>{this.addNewHeaderAtTheEndRoot()}} icon={faPlus}/></span>);
  let addingAssignmentArray = this.AddedAssignmentObjArray 
  if (this.makeTreeArray.length>0) {
    this.makeTreeArray.forEach((element,index)=>{
      let title = element["title"]
      let level = element["level"];
      let id = element["id"]; // id of either header or assignment
      let type = element ["type"]
      let headerParentId=null;
      if (type==='header'){
        headerParentId=this.heading_obj[id]['parentId']
      }
      let leftMargin = `${level*20}px`;
      let leftArrow = null;
      let rightArrow=null;
      let upArrow=null;
      let downArrow=null;
      let addHeaderPlus = null;
      let addAssignmentPlus=null;
      let remove = null;
      let addingArrowAfterAssignment = null;
      let addingArrowUnderHeader=null;
      let contentID=null;
      let branchID=null;
      let addHeaderPlusUnderRoot=null;
      if (level==0) { // only header can have level 0
        if (this.enableMode==='header'){
          addHeaderPlusUnderRoot=(<span className="Section-Icon-Box">         
        <FontAwesomeIcon className="Section-Icon" data-cy ="plus"
         onClick ={()=>{this.addNewHeaderUnderRoot({headerObj:element})}} icon={faPlus}/></span>)
      }}
      // making up, down Arrow
      if (type==='header'){
        let id1 = element["id"];
        //console.log("id1 is "+id1)
        if (this.enableMode==='position'){
          let myParent = this.heading_obj[id1]['parentId']
        let myParentHeadingIdArray = this.heading_obj[myParent]['childHeadings']
        if (myParentHeadingIdArray.indexOf(id1)!=(myParentHeadingIdArray.length-1)){
          upArrow=(<span className="Section-Icon-Box">         
        <FontAwesomeIcon className="Section-Icon" data-cy={"arrowUp"+index}
         onClick ={()=>{this.moveHeaderUp({headerObj:element})}} icon={faArrowUp}/></span>)
        }
        if (myParentHeadingIdArray.indexOf(id)!=0){
          downArrow=(<span className="Section-Icon-Box">         
        <FontAwesomeIcon className="Section-Icon" data-cy={"arrowDown"+index}
         onClick ={()=>{this.moveHeaderDown({headerObj:element})}} icon={faArrowDown}/></span>)
        }
        if (myParentHeadingIdArray.length>=2
          && myParentHeadingIdArray.indexOf(id)!=(myParentHeadingIdArray.length-1)){
            rightArrow = (<span className="Section-Icon-Box">         
        <FontAwesomeIcon className="Section-Icon" data-cy={"arrowRight"+index}
         onClick ={()=>{this.moveHeaderRight({headerObj:element})}} icon={faArrowRight}/></span>)
          }
          console.log(this.heading_obj[id])
        if (this.heading_obj[id]['parentId']!="root"){
            leftArrow = (<span className="Section-Icon-Box">         
            <FontAwesomeIcon className="Section-Icon" data-cy={"arrowLeft"+index}
             onClick ={()=>{this.moveHeaderLeft({headerObj:element})}} icon={faArrowLeft}/></span>)
          }  
      } else if (this.enableMode==='remove'){
        remove=(<span className="Section-Icon-Box">         
      <FontAwesomeIcon className="Section-Icon" data-cy={"close"+index}
       onClick ={()=>{this.deleteHeader({headerObj:element});this.buildTreeArray();
       this.buildTree();
       this.forceUpdate();}} icon={faWindowClose}/></span>)
      } else if (this.enableMode==='header'){
          addHeaderPlus=(<span className="Section-Icon-Box">         
        <FontAwesomeIcon className="Section-Icon" data-cy={"plus"+index}
         onClick ={()=>{this.addNewHeaderToHeader({headerObj:element})}} icon={faPlus}/></span>)
        } 
        else if (this.enableMode==='assignment'){
          id = element["id"];
          let parentId = this.heading_obj[id]['parentId']
          addingArrowUnderHeader=(<div style={{marginLeft:leftMargin}}><span className="Section-Icon-Box">         
          <FontAwesomeIcon className="Section-Icon" data-cy={"arrowLeft"+index}
           onClick ={
             ()=>{this.addAssignmentIdsUnderHeader({currentHeaderId:id,arrayOfIncomingAssignments:this.AddedAssignmentObjArray})}}
           icon={faArrowLeft}/></span></div>)
        }
      }else {
        let myParent = this.assignment_obj[id]['parentId']
        ClassName = "AssignmentSelection"
        contentID = this.assignment_obj[id]['contentId']
        branchID = this.assignment_obj[id]['branchId']
        // branchID = this.assignment_obj[id]['branchId']
        let myParentHeadingIdArray = this.heading_obj[myParent]['childAssignments']
        if (this.enableMode==='position'){
          if (myParentHeadingIdArray.indexOf(id)!=((myParentHeadingIdArray.length)-1)){
            upArrow=(<span className="Section-Icon-Box">         
            <FontAwesomeIcon className="Section-Icon" data-cy={"arrowUp"+index}
             onClick ={()=>{this.moveAssignmentUp({assignmentObj:element})}} icon={faArrowUp}/></span>)
          }
          if (myParentHeadingIdArray.indexOf(id)!=0){
            downArrow=(<span className="Section-Icon-Box">         
          <FontAwesomeIcon className="Section-Icon" data-cy={"arrowDown"+index}
           onClick ={()=>{this.moveAssignmentDown({assignmentObj:element})}} icon={faArrowDown}/></span>)
          }
        } else if (this.enableMode==='remove'){
          remove=(<span className="Section-Icon-Box">         
        <FontAwesomeIcon className="Section-Icon" data-cy={"close"+index}
         onClick ={()=>{this.deleteAssignment({assignmentObj:element})}} icon={faWindowClose}/></span>)
        } else if (this.enableMode==='assignment'){
          id = element["id"];
          addingArrowAfterAssignment=(<div style={{marginLeft:leftMargin}}><span className="Section-Icon-Box">         
        <FontAwesomeIcon className="Section-Icon" data-cy={"arrowLeft"+index}
         onClick =
         {()=>{this.addAssignmentIdsAfterAnAssignment({currentAssignmentId:id,arrayOfIncomingAssignments:this.AddedAssignmentObjArray})}}
         icon={faArrowLeft}/></span></div>)
        }       
      }
      let data_cy=type+index
      let styleAssignment={marginLeft:leftMargin,display:"flex"}
      if (this.selectedAssignmentId===id) {
        styleAssignment={marginLeft:leftMargin,display:"flex",backgroundColor: "#979B97"}
      }
      let tree_branch = 
      (
        <div key={"tree_branch"+index} data-cy={data_cy} className={ClassName} style={styleAssignment}>
        <span className="Section-Text" 
        // onClick={()=>{this.loadAssignmentContent({contentId:contentID,branchId:branchID,assignmentId:id})}}
        onClick={()=>{this.thisAssignmentInfo = id;this.loadThisAssignmentInfo()}}
        
        >
            {title}
            </span>
            {leftArrow}
            {rightArrow}
            {upArrow}
            {downArrow}
            {addHeaderPlus}
            {remove}
             </div>
      
      )
      if (addHeaderPlusUnderRoot!=null && type==='header'){
        this.tree.push(addHeaderPlusUnderRoot)
      }
      this.tree.push(tree_branch)
      if (addingArrowAfterAssignment!=null && type==='assignment'){
        this.tree.push(addingArrowAfterAssignment)
      } 
      
      if (addingArrowUnderHeader!=null && type==='header'
      && headerParentId!=null){
        this.tree.push(addingArrowUnderHeader);
      }
      
      // if (addingArrow!=null && type==='assignment'){
      //   this.tree.push(addingArrow)
      // }
      })
  } else {
    console.log("EMPTY TREE")
  }
  if (this.enableMode==='header'){
    this.tree.push(addHeaderToTheEndOfRoot)
  }
}

  saveTree(){
    console.log("saving the tree")
    /**
     * here passing in a payload of
     * for UPDATE:
     *  a assignment set where all row in assignment match the id will be updated in parent
     * for DELETE:
     *  a header set where all row in course's heading match the id will be deleted
     * for INSERT:
     *  for inserting into assignment
     *   a set of assignment id
     *   a list of parent id as 1 header Id can have multiple assignment id
     *   index of children id associated with index of assignment id
     *  for inserting into heading
     *    a list of header id where duplicate may occur as a header may contain several different children id
     *    a set of children id as no children Id can be owned by 2 different parents
     * 
     * delete multiple rows: DELETE FROM table WHERE col1 IN (1,2,3,4,5)
        insert multiple rows:
        INSERT INTO 
              projects(name, start_date, end_date)
        VALUES
              ('AI for Marketing','2019-08-01','2019-12-31'),
              ('ML for Sales','2019-05-15','2019-11-20');
     */
    let assignmentId_parentID_array = [];
    let assignmentId_array = Object.keys(this.assignment_obj)
    assignmentId_array.forEach(id=>{
      assignmentId_parentID_array.push(this.assignment_obj[id]['parentId']);
    })
    let headerID_array = Object.keys(this.heading_obj);
    let headerID_array_to_payload = []
    let headerID_childrenId_array_to_payload=[]
    let headerID_parentId_array_to_payload = []
    let headerID_name = []
    headerID_array.forEach(currentHeaderId=>{
      let currentHeaderObj=this.heading_obj[currentHeaderId]
      let title = currentHeaderObj['title']
      if (title==null){
        title="NULL"
      }
      let currentHeaderObjHeadingIdArray = currentHeaderObj['childHeadings']
      let lengthOfHeadingId = currentHeaderObjHeadingIdArray.length
      let currentHeaderObjAssignmentIdArray = currentHeaderObj['childAssignments']
      let currentHeaderObjParentId = currentHeaderObj['parentId']
      let lengthOfAssigmentId = currentHeaderObjAssignmentIdArray.length
      let iterator = 0
      if (lengthOfHeadingId==0 && lengthOfAssigmentId==0){
        headerID_array_to_payload.push(currentHeaderId)
        if (currentHeaderObjParentId==null){
          headerID_parentId_array_to_payload.push("NULL")
        } else {
        headerID_parentId_array_to_payload.push(currentHeaderObjParentId)
        }
        headerID_childrenId_array_to_payload.push("NULL")
        headerID_name.push(title);
      }
      while (iterator < lengthOfHeadingId){
        headerID_array_to_payload.push(currentHeaderId)
        headerID_childrenId_array_to_payload.push(currentHeaderObjHeadingIdArray[iterator])
        headerID_name.push(title);
        if (currentHeaderObjParentId==null){
          headerID_parentId_array_to_payload.push("NULL")
        } else {
        headerID_parentId_array_to_payload.push(currentHeaderObjParentId)
        }
        iterator+=1
      }
      iterator = 0
      while (iterator < lengthOfAssigmentId){
        headerID_array_to_payload.push(currentHeaderId)
        headerID_childrenId_array_to_payload.push(currentHeaderObjAssignmentIdArray[iterator])
        headerID_name.push(title);
        if (currentHeaderObjParentId==null){
          headerID_parentId_array_to_payload.push("NULL")
        } else {
        headerID_parentId_array_to_payload.push(currentHeaderObjParentId)
        }
        iterator+=1
      }
    })
    //JSON.stringify()
    // assignmentId_array =JSON.stringify(assignmentId_array) 
    // assignmentId_parentID_array = JSON.stringify(assignmentId_parentID_array) 
    // headerID_array_to_payload = JSON.stringify(headerID_array_to_payload) 
    // headerID_childrenId_array_to_payload = JSON.stringify(headerID_childrenId_array_to_payload) 
    // console.log(headerID_name)
    //   console.log("headerID_array_to_payload..")
    //   console.log(headerID_array_to_payload)
    //   console.log("headerID_childrenId_array_to_payload..")
    //   console.log(headerID_childrenId_array_to_payload)
    //   console.log("headerID_parentId_array_to_payload")
    //   console.log(headerID_parentId_array_to_payload)
      const urlGetCode = '/api/saveTree.php';
      const data = {
        assignmentId_array: assignmentId_array,
        assignmentId_parentID_array: assignmentId_parentID_array,
        headerID_array_to_payload:headerID_array_to_payload,
        headerID_name:headerID_name,
        headerID_parentId_array_to_payload:headerID_parentId_array_to_payload,
        headerID_childrenId_array_to_payload:headerID_childrenId_array_to_payload,
        courseId:"aI8sK4vmEhC5sdeSP3vNW"
      }
  
      axios.post(urlGetCode,data)
      .then(resp=>{
        console.log(resp.data)
      })
      .catch(error=>{this.setState({error:error})});
  
}
moveHeaderUp({headerObj}){
/**
 * posses up arrow iff your id not first appear inside your parentId's headerId array
 * get the id of the current header
 * find current header parentId in this.header_obj
 * find current header parent obj in this.header_obj base on parentId
 * get current header index inside current header parent obj headerId
 * swap it with the element whose index before
 */

let currentHeaderId = headerObj["id"]

let myParentId = this.heading_obj[currentHeaderId]["parentId"]
let parentObj = this.heading_obj[myParentId];

let currentHeaderIndexInParentHeaderIdArray = parentObj["childHeadings"].indexOf(currentHeaderId)
let previousIndex = currentHeaderIndexInParentHeaderIdArray+1;

let previousId = parentObj["childHeadings"][previousIndex]
let temp = previousId;
// swapping
parentObj["childHeadings"][previousIndex]=currentHeaderId;
parentObj["childHeadings"][currentHeaderIndexInParentHeaderIdArray] = temp;

this.buildTreeArray();
this.buildTree();
this.forceUpdate();
this.saveTree();
}
moveAssignmentUp({assignmentObj}){
  /**
 * posses up arrow iff your id not first appear inside your parentId's assignment array
 * get the id of the current assignment
 * find current assignment parentId in this.header_obj
 * find current assignment's parent obj in this.header_obj base on parentId
 * get current assignment index inside current header's parent obj assignmentId
 * swap it with the element whose index before
 */
let currentAssignmentId = assignmentObj["id"]
let myParentId = this.assignment_obj[currentAssignmentId]["parentId"]
let parentObj = this.heading_obj[myParentId];
let currentHeaderIndexInParentHeaderIdArray = parentObj["childAssignments"].indexOf(currentAssignmentId)
let previousIndex = currentHeaderIndexInParentHeaderIdArray+1;
let previousId = parentObj["childAssignments"][previousIndex]
let temp = previousId;
// swapping
parentObj["childAssignments"][previousIndex]=currentAssignmentId;
parentObj["childAssignments"][currentHeaderIndexInParentHeaderIdArray] = temp;
this.buildTreeArray();
this.buildTree();
this.forceUpdate();
this.saveTree();
}
moveHeaderDown({headerObj}){
  /**
   * posses down arrow iff your id not last appear inside your parentId's headerId array
   * get the id of the current header
   * find current header parentId in this.header_obj
   * find current header parent obj in this.header_obj base on parentId
   * get current header index inside current header parent obj headerId
   * swap it with the element whose index after
   */
let currentHeaderId = headerObj["id"]
let myParentId = this.heading_obj[currentHeaderId]["parentId"]
let parentObj = this.heading_obj[myParentId];
let currentHeaderIndexInParentHeaderIdArray = parentObj["childHeadings"].indexOf(currentHeaderId)
let previousIndex = currentHeaderIndexInParentHeaderIdArray-1;
let previousId = parentObj["childHeadings"][previousIndex]
let temp = previousId;
// swapping
parentObj["childHeadings"][previousIndex]=currentHeaderId;
parentObj["childHeadings"][currentHeaderIndexInParentHeaderIdArray] = temp;
this.buildTreeArray();
this.buildTree();
this.forceUpdate();
this.saveTree();
}
moveAssignmentDown({assignmentObj}){
    /**
   * posses down arrow iff your id not lasr appear inside your parentId's assignment array
   * get the id of the current assignment
   * find current assignment parentId in this.header_obj
   * find current assignment's parent obj in this.header_obj base on parentId
   * get current assignment index inside current header's parent obj assignmentId
   * swap it with the element whose index after
   */
  let currentAssignmentId = assignmentObj["id"]
  let myParentId = this.assignment_obj[currentAssignmentId]["parentId"]
  let parentObj = this.heading_obj[myParentId];
  let currentHeaderIndexInParentHeaderIdArray = parentObj["childAssignments"].indexOf(currentAssignmentId)
  let previousIndex = currentHeaderIndexInParentHeaderIdArray-1;
  let previousId = parentObj["childAssignments"][previousIndex]
  let temp = previousId;
  // swapping
  parentObj["childAssignments"][previousIndex]=currentAssignmentId;
  parentObj["childAssignments"][currentHeaderIndexInParentHeaderIdArray] = temp;
  this.buildTreeArray();
  this.buildTree();
  this.forceUpdate();
  this.saveTree();

}
moveHeaderLeft({headerObj}){
  /**
   * possess a left arrow when exists parent that not "root"
   * get the id of the current header as currentHeaderId
   * find currentHeaderId's parentId in this.header_obj
   * splice currentHeaderId out of currentHeaderId's parentId childHeadings array
   * store parentId of currentHeaderId's parentId as newParentId
   * change currentHeaderId's parentId type value to newParentId
   */
  let currentHeaderId = headerObj["id"]
  let myparentId = this.heading_obj[currentHeaderId]["parentId"]
  let myNewParentId = this.heading_obj[myparentId]["parentId"]
  let myParentHeaderIdArray = this.heading_obj[myparentId]["childHeadings"]
  let currentHeaderIdIndexInsidemyParentHeaderIdArray = myParentHeaderIdArray.indexOf(currentHeaderId)
  this.heading_obj[myparentId]["childHeadings"].splice(currentHeaderIdIndexInsidemyParentHeaderIdArray,1)
  this.heading_obj[currentHeaderId]["parentId"] = myNewParentId;
  if (currentHeaderIdIndexInsidemyParentHeaderIdArray===(myParentHeaderIdArray-1)){
    this.heading_obj[myNewParentId]["childHeadings"].push(currentHeaderId)   // when u last
  }else {
    this.heading_obj[myNewParentId]["childHeadings"].unshift(currentHeaderId)
  }
  console.log("moveHeaderLeft")
  console.log(this.heading_obj)
  this.buildTreeArray();
  this.buildTree();
  this.forceUpdate();
  this.saveTree();

}
moveHeaderRight({headerObj}){
  /**
   * possess right arrow when my id not the only in my parentID's headerId
   * get the id of the current header as id
   * find the next header inside the current header's parent childHeadings
   * find the index of the previous header inside headerId_arr
   * continue to seek previous header by decreasing the index
   * when found a header where its level is at least current header
   *    then store the header Id as newParentID. Then look parentID up in header_obj
   *    then access its headerId array and append id to the array
   * change id's parent to newParentID
   */
  let currentHeaderId = headerObj['id']
  let myParentId = this.heading_obj[currentHeaderId]['parentId']
  let myParentHeadingIdArray = this.heading_obj[myParentId]["childHeadings"]
  let prevHeaderIndexInsidemyParentHeadingIdArray = myParentHeadingIdArray.indexOf(currentHeaderId)+1
  if (prevHeaderIndexInsidemyParentHeadingIdArray===myParentHeadingIdArray.length){
    prevHeaderIndexInsidemyParentHeadingIdArray=myParentHeadingIdArray.indexOf(currentHeaderId)-1
  }
  let prevHeaderId = myParentHeadingIdArray[prevHeaderIndexInsidemyParentHeadingIdArray]
  let prevHeaderObj = this.heading_obj[prevHeaderId]
  let currentHeaderIdIndexInsideParentObjHeadingIdArray = this.heading_obj[myParentId]['childHeadings'].indexOf(currentHeaderId)
  if (currentHeaderIdIndexInsideParentObjHeadingIdArray==this.heading_obj[myParentId]['childHeadings'].length-1){
  prevHeaderObj['childHeadings'].push(currentHeaderId)  // when u last
  } else {
    prevHeaderObj['childHeadings'].unshift(currentHeaderId)  // when u not last
  }
  this.heading_obj[currentHeaderId]['parentId']=prevHeaderId
  this.heading_obj[myParentId]['childHeadings'].splice(currentHeaderIdIndexInsideParentObjHeadingIdArray,1)
  this.buildTreeArray();
  this.buildTree();
  this.forceUpdate();
this.saveTree();

}
addAssignmentIdsAfterAnAssignment({currentAssignmentId,arrayOfIncomingAssignments}){
  /**
   * create a fake assignment array of assignment obj
   * get the parentId of the current assignment
   * look up parentId obj in header_obj
   * iterate thru the each element and add the key id to parentId obj's assignmentId array
   */

let arr = arrayOfIncomingAssignments
let myParentID = this.assignment_obj[currentAssignmentId]['parentId'];
let myParentObj = this.heading_obj[myParentID];
let assignmentIdArray = myParentObj['childAssignments']
let length = arr.length;
let currentAssignmentIdIndexInsideParentAssignmentIdArray = 
            myParentObj['childAssignments'].indexOf(currentAssignmentId)
let addAtIndex=currentAssignmentIdIndexInsideParentAssignmentIdArray
let iterator =0;
while (iterator<length){
  let addedAssignmentId = arr[iterator];
  let ID = nanoid();
  this.heading_obj[myParentID]['childAssignments'].splice(addAtIndex,0,ID)
  console.log("NEW ID is.."+ID)
  let title = "untitle assignment "+iterator;
  this.assignment_obj [ID]={title:title,parent:myParentID,contentId:addedAssignmentId}
iterator+=1;
}
// change enableMode to "position" .Adding duplicate assignmentId will break the rule of adding arrow
// as one ID can both a middle and first element at the same time
this.buildTreeArray();
this.buildTree();
this.forceUpdate();
this.saveTree();

}
addAssignmentIdsUnderHeader({currentHeaderId,arrayOfIncomingAssignments}){
/**
 * get headerId as id
 * look up id to get the id obj in header_obj
 * iterate thru the each element and add the key id to id obj's assignmentId array
 */
/*Assume AddedAssignmentIdsArray is fully filled and 
stores only {IdOfAssignment:<someID>,name:<someName>} */
let arr = arrayOfIncomingAssignments
let currentHeaderObj = this.heading_obj[currentHeaderId];
let iterator=arr.length-1; // last index of Adding AssignmentID
while (iterator>=0){
  let ID = nanoid();
  console.log("NEW ID is.."+ID)
  let title = "untitle assignment "+iterator;
  this.assignment_obj [ID]={title:title,parent:currentHeaderId,contentId:arr[iterator]}
  // adding ID to currentHeaderId's assignmentId array
  this.heading_obj[currentHeaderId]['childAssignments'].push(ID);
  iterator--;
}
this.buildTreeArray();
this.buildTree();
this.forceUpdate();
this.saveTree();

}
addNewHeaderUnderRoot ({headerObj}){
let currentHeaderId = headerObj['id']
let myParentObj = this.heading_obj["root"];
let length = myParentObj['childHeadings'].length
let currentHeaderIdIndexInsideParentHeadingIdArray = 
            myParentObj['childHeadings'].indexOf(currentHeaderId)
let addAtIndex=currentHeaderIdIndexInsideParentHeadingIdArray
let ID = nanoid();

  if (addAtIndex===0){
    console.log("case 1")
    this.heading_obj["root"]['childHeadings'].unshift(ID)
  } else if (addAtIndex===(length-1)){
    console.log("case 2")
    this.heading_obj["root"]['childHeadings'].push(ID)
  } else {
    console.log("case 3")
    this.heading_obj["root"]['childHeadings'].splice(addAtIndex+1,0,ID)
  }
  this.heading_obj [ID]={title:"untitled header",parentId:"root",childAssignments:[],childHeadings:[]}

// change enableMode to "position" .Adding duplicate assignmentId will break the rule of adding arrow
// as one ID can both a middle and first element at the same time
this.buildTreeArray();
this.buildTree();
this.forceUpdate();
this.saveTree();

}
addNewHeaderAtTheEndRoot(){
let ID = nanoid();
  this.heading_obj["root"]['childHeadings'].unshift(ID)
  this.heading_obj [ID]={title:"untitled header",parentId:"root",childAssignments:[],childHeadings:[]}
  this.buildTreeArray();
this.buildTree();
this.forceUpdate();
this.saveTree();

}
addNewHeaderToHeader({headerObj}){
  /**
   * create a new id from nanoid as newId
   * add a new header object to header_obj with newId empty headerId and assignmentId
   * get the current header id as id
   * add newId to id's headerId array
   */
  /*Assume addedHeader is fully filled and 
  stores only {IdOfAssignment:<someID>,name:<someName>} */
  // TODO: header can't be added under Root
  console.log("running addNewHeaderToHeader")
  let currentHeaderId = headerObj['id']
  let newHeaderId = nanoid();
  let newHeaderName = "untitled header";
  this.heading_obj [newHeaderId] = {title:newHeaderName,childAssignments:[],childHeadings:[],parentId:currentHeaderId}
  this.heading_obj[currentHeaderId]['childHeadings'].unshift(newHeaderId)
  this.buildTreeArray();
  this.buildTree();
  this.forceUpdate();
this.saveTree();

}
deleteHeader ({headerObj}){
  /**
   * delete header will delete its children including header and assignment
   */
  console.log("deleting obj")
  console.log(headerObj)
let id = headerObj['id']
// delete it as heading, get parent
// let indexOfHeader = this.headerId_arr.indexOf(id)
let currentHeaderObject = 
      this.heading_obj[id];
let parentId;
//if (currentHeaderObject["parentId"]!="root"){
parentId = currentHeaderObject["parentId"]
  
//}
let listOfMyAssignment = currentHeaderObject["childAssignments"]
let listOfDeletingAssignment = []
listOfMyAssignment.forEach (element=>{
  listOfDeletingAssignment.push(element.toString())
})
// before deleting myself, delete all my assignment object
this.deleteChildrenAssignment({list:listOfDeletingAssignment})
// before deleting myself, delete all my header object
let listOfMyHeaders = currentHeaderObject["childHeadings"]
console.log("listOfMyHeaders")
console.log(listOfMyHeaders)
let listOfDeletingHeader = []
listOfMyHeaders.forEach (element=>{
  let currentChildHeaderObjID = element
  let title = this.heading_obj[element]['title']
  let type = "header"
  let parent = this.heading_obj[element]['parentId']
  let currentChildHeaderObjHeadingId = this.heading_obj[element]["childHeadings"]
  let currentChildHeaderObjAssignmentId = this.heading_obj[element]["childAssignments"]

  let currentChildHeaderObj = {id:currentChildHeaderObjID,title:title,type:type,parent:parent,childHeadings:currentChildHeaderObjHeadingId,assignmentId:currentChildHeaderObjAssignmentId}
  this.deleteHeader({headerObj:currentChildHeaderObj})
})
//delete myself
//this.heading_obj.splice(indexOfHeader,1)
delete this.heading_obj[id]
//if (currentHeaderObject["parentId"]!="root"){
// let indexOfHeaderParent = this.headerId_arr.indexOf(parentId)  
let currentHeaderObjectParentHeadingId = 
      this.heading_obj[parentId]["childHeadings"];
let indexOfCurrentHeaderInsideItsParentHeadingId = currentHeaderObjectParentHeadingId.indexOf(id)
  this.heading_obj[parentId]["childHeadings"].splice(indexOfCurrentHeaderInsideItsParentHeadingId,1)

//}
// deleting it inside the parent childHeadings

console.log("delete header")
console.log(this.heading_obj)
console.log(this.assignment_obj)
this.axiosDeleteAssignmentFromDB({listOfAssignment:this.listOfAssignmentIdNeedDeletingFromDB})

// this.buildTreeArray();
// this.buildTree();
// this.forceUpdate();
// this.saveTree();

}
deleteChildrenAssignment({list}){
  // let listOfAssignmentIdNeedDeletingFromDB = []
list.forEach(element=>{
  this.listOfAssignmentIdNeedDeletingFromDB.push(element);
  delete this.assignment_obj[element]
})
}
deleteAssignment ({assignmentObj}){
  let id = assignmentObj['id']
  let indexOfAssignment = this.assignmentId_arr.indexOf(id)
  let myParentId = this.assignment_obj[id]["parentId"]
  //delete me from parent
  let indexOfHeaderParent = this.headerId_arr.indexOf(myParentId)
  let currentHeaderObjectParentAssignmentId = 
  this.heading_obj[myParentId]["childAssignments"]
  delete this.assignment_obj[id]
  //this.assignment_obj.splice(indexOfAssignment,1)

  this.heading_obj[myParentId]["childAssignments"].splice(currentHeaderObjectParentAssignmentId.indexOf(id),1)
  this.listOfAssignmentIdNeedDeletingFromDB = [id]
  this.axiosDeleteAssignmentFromDB({listOfAssignment:this.listOfAssignmentIdNeedDeletingFromDB})
  // here write axios called to delete one selected assignment
  // const urlGetCode = '/api/deleteAssignment.php';
  // const data = {
  //   branchId: ["b2branchid"],
  //   contentId: ["268edfaf6999ea0182e6ac360854c7d739e35eccbb6384dd193b301de845b707"],
  // }
  // const payload = {
  //   params: data
  // }
  // axios.get(urlGetCode,payload)
  // .then(resp=>{
  //   let doenetML = resp.data.doenetML;
  //   console.log("doenetML !")
  //   console.log(resp.data)
  //   this.updateNumber++;
  //   this.doenetML=doenetML;
  //   this.forceUpdate();
  // })

  // this.buildTreeArray();
  // this.buildTree();
  // this.saveTree();
  //this.forceUpdate();

  

}
axiosDeleteAssignmentFromDB ({listOfAssignment}) {
  // listOfAssignment.forEach(element=>{
  console.log("axios here")
  //   console.log(element)
  // })
    // here write axios called to delete one selected assignment
  let list = listOfAssignment
  const urlGetCode1 = '/api/deleteAssignment.php';
  const data = {
    list : list
  }

  axios.post(urlGetCode1,data)
  .then(resp=>{
    console.log(resp.data)
    this.buildTreeArray();
    this.buildTree();
    this.forceUpdate();
    this.saveTree();
  })
  .catch(error=>{this.setState({error:error})});
}
EnableThese(e){
  let name = e.target.value
  if (name==="overview"){
    this.state.overview = true
  } else if (name==="syllabus") {
    this.state.syllabus = true
  }else if (name==="grade") {
    this.state.grade = true
  }else if (name==="assignment") {
    this.state.assignment = true
  }
  e.target.value="adding back"
  // if (this.assignment_state_1===false){
  //   window.location.href="/admin"
  // }
  this.setState({newChange:true})
  this.forceUpdate()
}
loadAssignmentContent({contentId,branchId,assignmentId}) {
  console.log("trying to load content")
  console.log(contentId)
  console.log(branchId)
  console.log(assignmentId)
  // given contentId, get me doenetML
  if (contentId!=null && branchId!=null){
    this.selectedAssignmentId = assignmentId
    this.assignmentName = this.assignment_obj[assignmentId]['title']
    this.assignment_branchId = this.assignment_obj[assignmentId]['branchId']
    this.dueDate = this.assignment_obj[assignmentId]['dueDate']
    this.assignedDate = this.assignment_obj[assignmentId]['assignedDate']
    this.numberOfAttemptsAllowed = this.assignment_obj[assignmentId]['numberOfAttemptsAllowed']

    console.log("exists both")
    const urlGetCode2 = '/api/getDoenetML.php';
    const data = {
      branchId:branchId,
      contentId:contentId
      // branchId: "9gBr0dW6tFqqA1UyLEBVD",
      // contentId: "268edfaf6999ea0182e6ac360854c7d739e35eccbb6384dd193b301de845b707",
    }
    const payload = {
      params: data
    }
    axios.get(urlGetCode2,payload)
    .then(resp=>{
      let doenetML = resp.data.doenetML;
      console.log("doenetML !")
      console.log(resp.data)
      this.updateNumber++;
      //this.doenetML=doenetML
      this.doenetML=(doenetML?doenetML:"<p>Empty</p>");
      this.mainSection=(<DoenetViewer 
              key={"loadAssignment"+this.updateNumber} //each component has their own key, change the key will trick Reach to look for new component
              // key={"doenetviewer"}              
              free={{doenetCode: this.doenetML}} 
              mode={{
                solutionType:this.state.solutionType,
                allowViewSolutionWithoutRoundTrip:this.state.allowViewSolutionWithoutRoundTrip,
                showHints:this.state.showHints,
                showFeedback:this.state.showFeedback,
                showCorrectness:this.state.showCorrectness,
              }}           
            />)
            this.activeSection="assignment"
            console.log("here in loading assignment content")
            this.updateLocationBar({assignmentId:assignmentId,activeSection:this.activeSection})
            this.forceUpdate();
    })
    .catch(error=>{this.setState({error:error})});
  } else {
    this.mainSection=(<DoenetViewer 
      // key={"doenetviewer"}      
      key={"loadassignmentContent"+this.updateNumber} //each component has their own key, change the key will trick Reach to look for new component
      free={{doenetCode: "<p>Empty</p>"}} 
      mode={{
        solutionType:this.state.solutionType,
        allowViewSolutionWithoutRoundTrip:this.state.allowViewSolutionWithoutRoundTrip,
        showHints:this.state.showHints,
        showFeedback:this.state.showFeedback,
        showCorrectness:this.state.showCorrectness,
      }}           
    />)
  }
  
}
  ToggleList(){
    const url = '/api/save_enable_disable_category.php'
    console.log(this.state.overview)
    console.log(this.state.grade)
    console.log(this.state.syllabus)
    console.log(this.state.assignment)

    const data = {
      overview:Number(this.state.overview),
      grade:Number(this.state.grade),
      syllabus:Number(this.state.syllabus),
      assignment:Number(this.state.assignment)
    }
    console.log(data)
    axios.post(url, data)
    .then(function (response) {
      // console.log(response);
      // console.log("-------DATA is---------")
      // console.log(response.data);
      
    })
    .catch(function (error) {
      this.setState({error:error});

    })
    // adding list
    this.setState({newChange:false})

    //this.forceUpdate()
    if (data[this.activeSection]===0){
      if (data.overview===1){
        this.loadOverview();
        this.buildOverview()
        // (!this.overview?this.buildOverview():null);
        this.updateLocationBar({});
      }else if (data.syllabus===1){
        this.loadSyllabus();
        this.buildSyllabus();
        this.updateLocationBar({});
      }else if (data.grade===1){
        this.loadGrades();
        this.buildGrades();
        this.updateLocationBar({});
      }else if (data.assignment===1){
        this.mainSection=(<p>Pick an Assignment</p>);
        this.updateLocationBar({});
      }else {
        this.updateLocationBar({activeSection:null})
      }
    }

  }

  updateLocationBar(assignmentId=this.assignmentId, activeSection=this.activeSection){
    console.log("inside updateLocationBar")
    history.replaceState({},"title","?active="+activeSection);
    if (assignmentId!=undefined && assignmentId!=null){
      assignmentId=assignmentId['childAssignments']
    }
    console.log(this.activeSection)
    if (this.activeSection === "assignment") {
      console.log("assignmentId in")
      console.log(assignmentId)
      history.replaceState({},"title","?active="+activeSection+"&assignmentId="+assignmentId);
    }
    this.buildTree()
  }

  loadOverview(){
    this.doenetML="";
    const phpUrl='/api/getDoenetML.php';
    const data={        
      branchId: this.overview_branchId,
      contentId:"",
      ListOfContentId:"", //this is to store all contentID of one branchID for publish indication 
      List_Of_Recent_doenetML:[], // this is to store list of (date:doenetML) 
    }
    const payload = {
      params: data
    }
    axios.get(phpUrl,payload)
      .then(resp=>{
        let doenetML = resp.data.doenetML;
        this.updateNumber++;
        this.doenetML=doenetML;
        this.forceUpdate();
      })
      .catch(error=>{this.setState({error:error})});
  }

  buildOverview(){
    this.mainSection = this.loadingScreen;
    //talk to database to load fresh info
    this.overview = (<div className="assignmentContent">
      {/* <h2 data-cy="sectionTitle">Overview</h2>  */}
      {this.doenetML!=""?
      
      <DoenetViewer 
        // key={"doenetviewer"}              
              key={"buildOverview"+(this.updateNumber+=1)} //each component has their own key, change the key will trick Reach to look for new component
              free={{doenetCode: this.doenetML}} 
              mode={{
                solutionType:this.state.solutionType,
                allowViewSolutionWithoutRoundTrip:this.state.allowViewSolutionWithoutRoundTrip,
                showHints:this.state.showHints,
                showFeedback:this.state.showFeedback,
                showCorrectness:this.state.showCorrectness,
              }}           
            />:null}
    </div>)
    this.mainSection = this.overview;
  }

  loadSyllabus(){
    console.log("LOAD Syllabus")
    this.doenetML="";
    console.log("branch id...")
    console.log(this.syllabus_branchId)
    const phpUrl='/api/getDoenetML.php';
    const data={        
      branchId: this.syllabus_branchId,
      contentId:"",
      ListOfContentId:"", //this is to store all contentID of one branchID for publish indication 
      List_Of_Recent_doenetML:[], // this is to store list of (date:doenetML) 
    }
    const payload = {
      params: data
    }
    axios.get(phpUrl,payload)
      .then(resp=>{
        let doenetML = resp.data.doenetML;
        console.log("doenetML!!!!!!!!!!!!");
        console.log(doenetML);
        this.updateNumber++;
        this.doenetML=doenetML;
        this.forceUpdate();
      })
      .catch(error=>{this.setState({error:error})});
  }

  buildSyllabus(){
    this.mainSection = this.loadingScreen;

    //talk to database to load fresh info
    this.syllabus = (<React.Fragment>
      {/* <h2 data-cy="sectionTitle">Syllabus</h2>  */}
      {this.doenetML!=""?
      <div><DoenetViewer 
              // key={"doenetviewer"}
              //key={"buildSyllabus"+(this.updateNumber+=1)} //each component has their own key, change the key will trick Reach to look for new component
              free={{doenetCode: this.doenetML}} 
              mode={{
                solutionType:this.state.solutionType,
                allowViewSolutionWithoutRoundTrip:this.state.allowViewSolutionWithoutRoundTrip,
                showHints:this.state.showHints,
                showFeedback:this.state.showFeedback,
                showCorrectness:this.state.showCorrectness,
              }}           
            /></div>:null}   
    </React.Fragment>)

    this.mainSection = this.syllabus;
  }

  buildAssignment() {
    this.mainSection = this.loadingScreen;
    this.activeSection="assignment"; // this is kept
    this.selectedAssignmentId=""
    if (this.finishedContructor === false) {return null;}

    let disablePrev = false;
    if (this.assignmentIndex === 0){disablePrev = true;}
    let disableNext = false;
    if (this.assignmentIndex === (this.assignmentIdList.length - 1)){disableNext = true;}

    console.log("-----------this.assignmentObj-------------");
    
    console.log(this.assignmentObj);

    let solutionType = "button";
    if (Number(this.assignmentObj.showSolution) === 0){
      solutionType = "none";
    }
    let showHints = true;
    if (Number(this.assignmentObj.showHints) === 0){
      showHints = false;
    }
    let showFeedback = true;
    if (Number(this.assignmentObj.showFeedback) === 0){
      showFeedback = false;
    }
    let showCorrectness = true;
    if (Number(this.assignmentObj.showCorrectness) === 0){
      showCorrectness = false;
    }
    // TODO: what assignment get un-publish ?
    console.log("assignment ID OVER HERE !!!!")
    assignmentID = this.assignmentObj.assignmentId;
    this.assignmentFragment = <React.Fragment>
      <div className="assignmentContainer">     
        <div className="assignmentActivity">
              {this.assignmentObj.assignmentId?
              <DoenetViewer 
              // key={"doenetviewer"}
              key={"buildAssignment"+this.updateNumber} 
              free={{
                doenetCode: this.assignmentObj.code,
                doenetState: this.assignmentObj.latestDocumentState,
                requestedVariant:{index:this.assignmentObj.assignedVariant},
              }} 
              assignmentId={this.assignmentObj.assignmentId}
              creditUpdate={this.creditUpdate}
              attemptNumber={this.assignmentObj.attemptNumber}
              mode={{
                solutionType:solutionType,
                allowViewSolutionWithoutRoundTrip:false,
                showHints,
                showFeedback,
                showCorrectness,
              }}
              course={true}
              />:<p>Loading...</p>}
        </div>
      </div>
    </React.Fragment>;

    this.mainSection = this.assignmentFragment;
    console.log("from build assignment")
    this.updateLocationBar(this.assignmentObj.assignmentId);
    this.forceUpdate();
  }

  loadGrades(){
    this.scores = {};
    this.subTotals = {};
      
      const loadGradsUrl='/api/loadGradsLearner.php';
      
      // this.courseId
      const data={
        courseId: this.courseId,
      }
      const payload = {
        params: data
      }
      
      
      axios.get(loadGradsUrl,payload)
        .then(resp=>{
          this.assignmentsData = resp.data.grades;
          this.student = resp.data.student;
          this.course = resp.data.course;
          this.section = resp.data.section;
          this.group = resp.data.group;
          this.forceUpdate();
          
        })
        .catch(error=>{this.setState({error:error})});
  }
  
  buildGrades(){
    
    if (this.assignmentsData === null){
      this.mainSection = this.loadingScreen;
    }else{
      this.buildGradesHelper();
    }

    
  }

  buildGradesHelper(){
    
    this.total = {possible:0,score:0,percentage:'0%'}

    for (let gcat of this.gradeCategories){
      this.scores[gcat] = [];
      this.subTotals[gcat] = {possible:0,score:0,percentage:'0%'};

      for (let dObj of this.assignmentsData){
        if (dObj.gradeCategory === gcat){
          let possible = dObj.totalPointsOrPercent;
          let percentFLAG = false;
          if (possible === null){
            possible = '--';
            percentFLAG = true;
          }else{
            possible = Number(possible);
            this.subTotals[gcat].possible += possible;
          }
          let score = dObj.credit;
          if (score === null || possible === null){
            score = '--';
            percentFLAG = true;
          }else{
            score = Number(score)*possible;
            if (!isNaN(score)){
              this.subTotals[gcat].score += score;
            }
          }
          let percentage;
          if (percentFLAG){
            percentage = '--';
          }else{
            percentage = Math.round(score/possible*1000)/10 + '%';
          }

          if (isNaN(score)){
            score = "--";
          }

          this.scores[gcat].push({gradeItem:dObj.assignmentName,
            assignmentId:dObj.assignmentId,
            possible:possible,
            score:score,
            percentage:percentage
          });
        }
      }

      if (this.subTotals[gcat].score > 0 && this.subTotals[gcat].possible > 0){
        this.subTotals[gcat].percentage = Math.round(this.subTotals[gcat].score / this.subTotals[gcat].possible*1000)/10 + '%';
        this.total.score += Number(this.subTotals[gcat].score);
        this.total.possible += Number(this.subTotals[gcat].possible);
      }
      
    }
    this.total.percentage = '0%';
    if(!isNaN(this.total.score / this.total.possible*1000)/10){
      this.total.percentage = Math.round(this.total.score / this.total.possible*1000)/10 + '%';
    }
 
    //talk to database to load fresh info
    this.Grade = (<React.Fragment>
      <h2 data-cy="sectionTitle">Grades</h2>
      <div style={{marginLeft:"10px"}}>
        <div>Student: {this.student}</div>
        {/* <div>Course: {this.course}</div> */}
        <div>Section: {this.section}</div>
        {this.group !== '' ? <div>Group: {this.group}</div> : null}
      </div>
      
      

      <table id="grades">
      <tbody>
        <tr className="colHeadingsRow">
          <th width="581">Grade item</th>
          <th width="75">Possible points</th>
          <th width="56">Score</th>
          <th width="95">Percentage</th>
        </tr>

      { this.gradeCategories.map( cat => <React.Fragment key={'option'+cat}>
      
        <tr>
          <td className="typeHeadingRow" colSpan="4">{cat}</td>
        </tr>
     

        {this.scores[cat].map(
          (score)=><React.Fragment key={'score_row'+score.assignmentId}>
          <tr className="typeDataRow"> 
            <td><span className="assignmentLink" onClick={()=>{
              this.buildAssignmentGrades({assignment:score});
              
            }}>{score.gradeItem}</span></td>
            <td>{score.possible}</td>
            <td>{score.score}</td>
            <td>{score.percentage}</td>
          </tr>
          </React.Fragment>
        )}

        <tr className="typeSubTotalDataRow"> 
          <td><span>Subtotal for {cat}</span></td>
          <td>{this.subTotals[cat].possible}</td>
          <td>{this.subTotals[cat].score}</td>
          <td>{this.subTotals[cat].percentage}</td>
        </tr>
        

      </React.Fragment>)}

        
        <tr className="colTotalRow">
          <td>Total</td>
          <td>{this.total.possible}</td>
          <td>{this.total.score}</td>
          <td>{this.total.percentage}</td>
        </tr>
       
        </tbody>
      </table>
    </React.Fragment>)
    this.mainSection = this.Grade;
  }

  buildAssignmentGrades({assignment}){
    this.mainSection = this.loadingScreen;
    this.assignment = assignment;
    this.assignmentId = assignment.assignmentId;

      const url='/api/loadItemGrades.php';
      
      const data={
        courseId: this.courseId,
        assignmentId: assignment.assignmentId,
      }
      const payload = {
        params: data
      }
      
      
      axios.get(url,payload)
        .then(resp=>{
          this.assignmentItems = resp.data.assignmentItems;

          this.latestAttemptNumber = resp.data.attemptNumber;
          this.latestAttemptCredit = resp.data.attemptCredit;

          this.buildAssignmentGradesHelper();
        })
        .catch(error=>{this.setState({error:error})});
  }

  buildAssignmentGradesHelper(){
    let latestAttemptPercentage = Math.round(Number(this.latestAttemptCredit)*10000,2)/100;
    latestAttemptPercentage = `${latestAttemptPercentage}%`;
    for (var item of this.assignmentItems){
      let percentage = Math.round(Number(item.credit)*10000,2)/100;
      item.percentage = `${percentage}%`;
      
    }


    this.mainSection = (<React.Fragment>
      <button onClick={()=>{
        this.buildGradesHelper({data:this.assignmentsData});
      }}>Back to grades</button>
      <h2 style={{marginLeft:"10px"}}>{this.assignment.gradeItem}</h2>
      {this.latestAttemptNumber > 1 ? <p style={{marginLeft:"10px",fontSize:"16px"}}>Attempt Number: {this.latestAttemptNumber} </p>: null }

      <table id="grades" style={{width:"400px"}}>
      <tbody>
        <tr className="colHeadingsRow">
          <th width="581">Grade item</th>
          <th width="95">Percentage</th>
        </tr>

        {this.assignmentItems.map(
          (item)=><React.Fragment key={'assignmentItem'+item.title}>
          <tr className="typeDataRow"> 
            <td><span className="assignmentLink" onClick={()=>{
              // this.buildAssignmentGrades({assignment:score});
              this.buildItemGrade({item});
              
            }}>{item.title}</span></td>
            <td>{item.percentage}</td>
          </tr>
          </React.Fragment>
        )}

        
        {this.latestAttemptNumber > 1 ? 
          <tr className="colTotalRow">
            <td>Total for attempt {this.latestAttemptNumber}</td>
          <td>{latestAttemptPercentage}</td>
          </tr>
          : null }
          
        <tr className="colTotalRow">
          <td>Total</td>
          <td>{this.assignment.percentage}</td>
        </tr>
        </tbody>
        </table>
      </React.Fragment>);

    this.forceUpdate();

  }

  buildItemGrade({item}){


    const url='/api/loadItemAttemptGrades.php';
      
      // this.courseId
      const data={
        assignmentId: this.assignmentId,
        itemNumber: item.itemNumber,
        attemptNumber: this.latestAttemptNumber,
      }
      const payload = {
        params: data
      }
      
      
      axios.get(url,payload)
        .then(resp=>{
          
          this.buildAttemptItemGradesHelper({
            itemTitle:item.title,
            itemState:resp.data.itemState,
            submissionNumber:resp.data.submissionNumber,
            submittedDate:resp.data.submittedDate,
            valid:resp.data.valid,
            });
        })
        .catch(error=>{this.setState({error:error})});
    
  }

  buildAttemptItemGradesHelper({itemTitle, itemState, submissionNumber, submittedDate, valid, }){
    console.log('itemState');
    console.log(itemState);
    
    this.mainSection = (<React.Fragment>
      <button onClick={()=>{
        this.buildGradesHelper({data:this.assignmentsData});
      }}>Back to grades</button>
      <button onClick={()=>{
        this.buildAssignmentGradesHelper();
      }}>Back to {this.assignment.gradeItem}</button>
    <h2 style={{marginLeft:"10px"}}>{this.assignment.gradeItem}: {itemTitle}</h2>
      {this.latestAttemptNumber > 1 ? <p style={{marginLeft:"10px",fontSize:"16px"}}>Attempt Number: {this.latestAttemptNumber} </p>: null }

            {/* <DoenetViewer 
              // key={"doenetviewer"}
              key={"buildGrade"+this.updateNumber}             
            free={{
            doenetState: itemState,
          }} 
          course={true}
            attemptNumber={this.latestAttemptNumber}
              mode={{
                solutionType:"displayed",
                allowViewSolutionWithoutRoundTrip:false,
                showHints:false,
                showFeedback:true,
                showCorrectness:true,
                interactive:false,
              }}
            /> */}

    </React.Fragment>);
    this.forceUpdate();
  }

  setAssignmentObj({outlineType}){
    if (outlineType === "outline"){
      this.assignmentObj = this.assignmentIdList[this.assignmentIndex];
    } else if (outlineType === "assignment"){
      this.assignmentObj = this.assignmentAssignedList[this.assignmentIndex];
    } else if (outlineType === "due"){
      this.assignmentObj = this.assignmentDueList[this.assignmentIndex];
    } 
  }



  updateAssignmentList({outlineType}) {
    if (outlineType === "outline"){
      this.buildOutline({courseId:this.courseId});
    }else if (outlineType === "assignment"){
      this.buildAssignmentList({courseId:this.courseId});
    }else{
      this.buildDueList();
    } 
  }

  resolveVariant({outlineType}){
    
    if (this.assignmentObj.assignedVariant === undefined || this.assignmentObj.assignedVariant === null){
      this.assignmentObj.attemptNumber = 1;

      if (Number(this.assignmentObj.multipleAttempts) === 1){

        //VariantIndex is the same offline and online
        this.assignmentObj.assignedVariant = this.variantNumberFromAttemptNumber();
      }else{
        this.assignmentObj.assignedVariant = 0;
      }

     
      //Save assignedVariant to DB
      // no saveVariant.php
    //   const url='/api/saveVariant.php';
    // const data={
    //   assignmentId: this.assignmentObj.assignmentId,
    //   assignedVariant:this.assignmentObj.assignedVariant,
    //   attemptNumber:this.assignmentObj.attemptNumber,
    //   contentId:this.assignmentObj.contentId,
    // }
    // const payload = {
    //   params: data
    // }
    // console.log("saveVariant data");
    // console.log(data);
    
    
    // axios.get(url,payload)
    //   .then(resp=>{
    //     console.log(resp.data);
    //   });
      
    }
    

  }

  variantNumberFromAttemptNumber(){
    let preseed = this.assignmentObj.attemptNumber+this.assignmentObj.assignmentId
    if(Number(this.assignmentObj.individualize) === 1){
      preseed += this.userId;
    }
    let seed = hashStringToInteger(preseed);

    let rng = new MersenneTwister(seed);
    let randomNumber = rng.random();
    return Math.floor(randomNumber * 1000000000);
  }

  assignmentDataToCourseInfo({courseId,data}){
        
    this.courseInfo[courseId] = {};
    this.courseInfo[courseId].heading = {};
    let parentHeadingIds = [];
    
    let prevLoopLevel = 1;
    let potentialParentHeadingId = "";
    for(let i = 0; i < data.headingText.length; i++){

        let headingText = data.headingText[i];
        let headingLevel = data.headingLevel[i];
        let headingId = data.headingId[i];
        if (prevLoopLevel < headingLevel){
            if (potentialParentHeadingId !== ""){
                parentHeadingIds.push(potentialParentHeadingId);
            }
        }else if (prevLoopLevel > headingLevel){
            for (var x = 0; x < (prevLoopLevel - headingLevel); x++){
                parentHeadingIds.pop();
            }
        }
        

        let baseObj = this.courseInfo[courseId];
        for (let headingId of parentHeadingIds){
            baseObj = baseObj.heading[headingId];
        }
        
        if (baseObj.headingsOrder === undefined){
            baseObj.headingsOrder = [];
            baseObj.heading = {};
        }
        
        // Add the heading information to the base object
        baseObj.headingsOrder.push({
                courseHeadingId:headingId,
                headingText:headingText,
            });
        baseObj.heading[headingId] = {};
        if (data.assignments[headingId] !== undefined){
                baseObj.heading[headingId].assignmentOrder = [];
                baseObj.heading[headingId].assignments = {};
                for (let assignmentInfo of data.assignments[headingId]){
                baseObj.heading[headingId].assignmentOrder.push(assignmentInfo.assignmentId);  
                
                  
                  baseObj.heading[headingId].assignments[assignmentInfo.assignmentId] = {
                    documentName:assignmentInfo.assignmentName,
                    code:assignmentInfo.doenetML,
                    latestDocumentState: assignmentInfo.latestDocumentState,
                    docTags:[],
                    contentId:assignmentInfo.contentId,
                    sourceBranchId:assignmentInfo.sourceBranchId,
                    dueDate:assignmentInfo.dueDate,
                    assignedDate:assignmentInfo.assignedDate,
                    individualize:assignmentInfo.individualize,
                    multipleAttempts:assignmentInfo.multipleAttempts,
                    showSolution:assignmentInfo.showSolution,
                    showFeedback:assignmentInfo.showFeedback,
                    showHints:assignmentInfo.showHints,
                    showCorrectness:assignmentInfo.showCorrectness,
                    proctorMakesAvailable:assignmentInfo.proctorMakesAvailable,
                    dueDateOverride:assignmentInfo.dueDateOverride,
                    timeLimitOverride:assignmentInfo.timeLimitOverride,
                    numberOfAttemptsAllowedOverride:assignmentInfo.numberOfAttemptsAllowedOverride,
                    attemptNumber:assignmentInfo.attemptNumber,
                    assignedVariant:assignmentInfo.assignedVariant,
                    generatedVariant:assignmentInfo.generatedVariant,
                    totalPointsOrPercent:assignmentInfo.totalPointsOrPercent,
                    credit:assignmentInfo.credit,
                    proctorMakesAvailable:assignmentInfo.proctorMakesAvailable,


                };
              
                
            }
            
        }


        prevLoopLevel = headingLevel;
        potentialParentHeadingId = headingId;
    }

  }

  componentDidCatch(error, info){
    this.setState({error:error,errorInfo:info});
  }


  generateNewAttempt(){
      this.assignmentObj.attemptNumber++;
      this.assignmentObj.assignedVariant = this.variantNumberFromAttemptNumber();
      this.assignmentObj.latestDocumentState = null;
      this.updateNumber++;
      //Save attempt number to database
        //Save assignedVariant to DB
        const url='/api/saveVariant.php';
      const data={
        assignmentId: this.assignmentObj.assignmentId,
        assignedVariant:this.assignmentObj.assignedVariant,
        attemptNumber:this.assignmentObj.attemptNumber,
        contentId:this.assignmentObj.contentId,
      }
      const payload = {
        params: data
      }
      console.log("saveVariant on Generate New Attempt data");
      console.log(data);
      
      
      axios.get(url,payload)
        .then(resp=>{
          console.log(resp.data);
        });
        
      this.forceUpdate();
  }
  loadAssignment({assignmentId,outlineType=this.state.outlineType}){
    this.updateAssignmentIndex({outlineType:outlineType,assignmentId:assignmentId});
    this.courseOutlineList = [];
    this.updateNumber++;
    this.assignmentId = assignmentId;
    this.setAssignmentObj({outlineType:this.state.outlineType});
    this.resolveVariant({outlineType:this.state.outlineType});
    this.updateAssignmentList({outlineType:this.state.outlineType});
    console.log("from loadAssignment")
    this.updateLocationBar();
    this.forceUpdate();
  }

  handlePrev(){
    if (this.assignmentIndex > 0) this.assignmentIndex = this.assignmentIndex-1;
    this.courseOutlineList = [];
    this.updateNumber++;
    this.setAssignmentObj({outlineType:this.state.outlineType});
    this.resolveVariant({outlineType:this.state.outlineType});
    this.updateAssignmentList({outlineType:this.state.outlineType});
    console.log("from handlePrev")
    this.updateLocationBar();
    this.forceUpdate();
  }

  handleNext(){
    if (this.assignmentIndex < this.assignmentIdList.length - 1) this.assignmentIndex = this.assignmentIndex+1;
    console.log(this.assignmentIndex);
    console.log(this.assignmentIdList.length);
    this.courseOutlineList = [];
    this.updateNumber++;
    this.setAssignmentObj({outlineType:this.state.outlineType});
    this.resolveVariant({outlineType:this.state.outlineType});
    this.updateAssignmentList({outlineType:this.state.outlineType});
    console.log("from handleNext")
    this.updateLocationBar();
    this.forceUpdate();
  }

  updateAssignmentIndex({outlineType,assignmentId=this.assignmentObj.assignmentId}){
    this.assignmentIndex = 0;
    console.log(assignmentId)

    if (outlineType === "outline"){
      for (let [index,assignmentObj] of this.assignmentIdList.entries()){
        if (assignmentObj.assignmentId === assignmentId){
          this.assignmentIndex = index;
          break;
        }
      }

    }else if (outlineType === "assignment"){
      for (let [index,assignmentObj] of this.assignmentAssignedList.entries()){
        if (assignmentObj.assignmentId === assignmentId){
          this.assignmentIndex = index;
          break;
        }
      }
    }else if (outlineType === "due"){
      for (let [index,assignmentObj] of this.assignmentDueList.entries()){
        if (assignmentObj.assignmentId === assignmentId){
          this.assignmentIndex = index;
          break;
        }
      }
    }


  }

  creditUpdate({credit}){

    if (credit > this.assignmentObj.credit || !this.assignmentObj.credit){
      this.assignmentObj.credit = credit;
    }
    this.forceUpdate();
  }

  loadThisAssignmentInfo(){
    this.rightSideInfoColumn=null
    const urlDownload="/api/loadAssignmentInfo.php";
    const data={assignmentId:this.thisAssignmentInfo}
    const payload = {
      params: data
    }
    console.log("this.thisAssignmentInfo: "+this.thisAssignmentInfo)
    this.assignment_branchId = this.assignment_obj[this.thisAssignmentInfo]['branchId']
    axios.get(urlDownload,payload)
        .then(resp=>{
            console.log("FROM loadAssignmentInfo.php")
            console.log(resp.data)
            this.assignmentName=resp.data['assignmentName']
            this.assignedDate=resp.data['assignedDate']
            this.dueDate=resp.data['dueDate']
            this.numberOfAttemptsAllowed=resp.data['numberOfAttemptsAllowed']
            this.timeLimit=resp.data['timeLimit']
            this.gradeCategory=resp.data['gradeCategory']
            this.totalPointsOrPercent=resp.data['totalPointsOrPercent']

            this.individualize=resp.data['individualize']==="1"?true:false
            this.multipleAttempts=resp.data['multipleAttempts']==="1"?true:false
            this.showSolution=resp.data['showSolution']==="1"?true:false
            this.showFeedback=resp.data['showFeedback']==="1"?true:false
            this.showHints=resp.data['showHints']==="1"?true:false
            this.showCorrectness=resp.data['showCorrectness']==="1"?true:false
            this.proctorMakesAvailable=resp.data['proctorMakesAvailable']==="1"?true:false
            // this.buildRightSideInfoColumn()
            this.AssignmentInfoPackageReady=true
            this.forceUpdate();
        });
  }
  buildRightSideInfoColumn(){

    console.log("BUILDING ightSideInfoColumn")
    console.log(this.assignmentName)
    let evenOrOdd = 0
    const SettingContainer = styled.button`
    display:flex;
    justify-content:space-between;
    flex-direction: column;
    `
    this.rightSideInfoColumn = (          
    <div className="info">

    <span className="Section-Icon-Box">         
    <FontAwesomeIcon className="Section-Icon" onClick={()=>window.location.href="/editor/?branchId="+this.assignment_branchId} icon={faEdit}/>
    </span>
      <SettingContainer>
        
      <DoenetBox key={"title"+(this.updateNumber++)} 
      evenOrOdd = {evenOrOdd+=1}
      parentFunction={(e)=>{
        this.updateNumber+=1
        this.assignmentName = e;
        this.AssignmentInfoChanged=true;
         this.forceUpdate()}} 
         type="text" 
         title="Assignment Name: "
         value={this.assignmentName?this.assignmentName:""}/>

         <DoenetBox key={"duedate"+(this.updateNumber++)}
         evenOrOdd = {evenOrOdd+=1}
         parentFunction={(e)=>{
          this.updateNumber+=1
            let date = e.split(" ")
            let result = date[3]+"-"+this.months[date[1]]+"-"+date[2]+" "+date[4]
            this.dueDate = result;
            this.AssignmentInfoChanged=true;
             this.forceUpdate()}} 
        type="Calendar" 
        title="Due Date: "
        value={this.dueDate?this.dueDate:""}
        />

    <DoenetBox key={"assignedDate"+(this.updateNumber++)} 
      evenOrOdd = {evenOrOdd+=1}    
    parentFunction={(e)=>{
      this.updateNumber+=1
        let date = e.split(" ")
        let result = date[3]+"-"+this.months[date[1]]+"-"+date[2]+" "+date[4]
        this.assignedDate = result;

        this.AssignmentInfoChanged=true;
         this.forceUpdate()}} 
         type="Calendar" 
         title="Assigned Date: " 
         value={this.assignedDate?this.assignedDate:""}/>

      <DoenetBox key={"TimeLimit"+(this.updateNumber++)} 
      evenOrOdd = {evenOrOdd+=1}      
      parentFunction={(e)=>{
        this.updateNumber+=1
        this.timeLimit = e;
        this.AssignmentInfoChanged=true;
         this.forceUpdate()}} 
         type="text" 
         title="Time Limit: " 
         value={this.timeLimit?this.timeLimit:""}/>

    <DoenetBox key={"attempts"+(this.updateNumber++)}
      evenOrOdd = {evenOrOdd+=1}    
    parentFunction={(e)=>{
      this.updateNumber+=1
        this.numberOfAttemptsAllowed = e;
        if (!this.multipleAttempts){
          this.numberOfAttemptsAllowed = 0
        }
        this.AssignmentInfoChanged=true;
         this.forceUpdate()}} 
         type="number" 
         title="Number Of Attempts: " 
         value={this.numberOfAttemptsAllowed?this.numberOfAttemptsAllowed:""}/>

      {/* <p>number Of Attempts Allowed: <input onChange={(e)=>{this.numberOfAttemptsAllowed=e.target.value;this.AssignmentInfoChanged=true;this.forceUpdate()}} type="number" value={this.numberOfAttemptsAllowed?this.numberOfAttemptsAllowed:""}></input></p> */}
      <DoenetBox key={"points"+(this.updateNumber++)}
      evenOrOdd = {evenOrOdd+=1}      
      parentFunction={(e)=>{
        this.updateNumber+=1
        this.totalPointsOrPercent = e;
        this.AssignmentInfoChanged=true;
         this.forceUpdate()}} 
         type="number" 
         title="Total Points Or Percent: " 
         value={this.totalPointsOrPercent?this.totalPointsOrPercent:""}/>
      {/* <p>total Points Or Percent: <input onChange={(e)=>{this.totalPointsOrPercent=e.target.value;this.AssignmentInfoChanged=true;this.forceUpdate()}} type="number" value={this.totalPointsOrPercent===null?"":this.totalPointsOrPercent}></input></p> */}

      <DoenetBox key={"category"+(this.updateNumber++)}
      evenOrOdd = {evenOrOdd+=1}      
      parentFunction={(e)=>{
        this.updateNumber+=1
        this.gradeCategory = e;
        this.AssignmentInfoChanged=true;
         this.forceUpdate()}} 
         type="select" 
         options={this.listOfOptions}
         title="Grade Category: " 
         value={this.gradeCategory}/>
      {/* <p>grade Category: 
        <select onChange={(e)=>{this.gradeCategory=e.target.value
        this.AssignmentInfoChanged=true;this.forceUpdate()}}>
          <option value="None" selected={this.gradeCategory==="None"?true:false}>None</option>
          <option value="Gateway" selected={this.gradeCategory==="Gateway"?true:false}>Gateway</option>
          <option value="Problem Sets" selected={this.gradeCategory==="Problem Sets"?true:false}>Problem Sets</option>
          <option value="Projects" selected={this.gradeCategory==="Projects"?true:false}>Projects</option>
          <option value="Exams" selected={this.gradeCategory==="Exams"?true:false}>Exams</option>
          <option value="Participation" selected={this.gradeCategory==="Participation"?true:false}>Participation</option>
        </select>
        </p>  */}
      {/*IMPLEMENTED <p>Due Date:  <input onChange={(e)=>{this.dueDate=e.target.value;this.AssignmentInfoChanged=true;this.forceUpdate()}} type="text" value={this.dueDate?this.dueDate:""}></input></p> */}
      {/*IMPLEMENTED <p>assigned Date: <input onChange={(e)=>{this.assignedDate=e.target.value;this.AssignmentInfoChanged=true;this.forceUpdate()}} type="text" value={this.assignedDate?this.assignedDate:""}></input></p>
                 
         NOT YET <p>Time Limit: <input onChange={(e)=>{this.timeLimit=e.target.value;this.AssignmentInfoChanged=true;this.forceUpdate()}} type="text" value={this.timeLimit===null?"":this.timeLimit}></input></p>
       */}
      <DoenetBox key={"indiv"+(this.updateNumber++)}
      evenOrOdd = {evenOrOdd+=1}      
      parentFunction={(e)=>{
        this.updateNumber+=1
        this.individualize = e;
        this.AssignmentInfoChanged=true;
         this.forceUpdate()}} 
         type="checkbox" 
         title="Individualize: " 
         value={this.individualize}/>
      {/* <p>Individualize: <input onChange={()=>{this.individualize= !this.individualize;this.AssignmentInfoChanged=true;this.forceUpdate()}} type="checkbox" checked={this.individualize}></input></p> */}
      <DoenetBox key={"multiple att"+(this.updateNumber++)}
      evenOrOdd = {evenOrOdd+=1}      
      parentFunction={(e)=>{
        this.updateNumber+=1
        this.multipleAttempts = e;
        if (!this.multipleAttempts){
          this.numberOfAttemptsAllowed = 0
        }
        this.AssignmentInfoChanged=true;
         this.forceUpdate()}} 
         type="checkbox" 
         title="Multiple Attempts: " 
         value={this.multipleAttempts}/>
      {/* <p>multiple Attempts: <input onChange={()=>{this.multipleAttempts= !this.multipleAttempts;this.AssignmentInfoChanged=true;this.forceUpdate()}} type="checkbox" checked={this.multipleAttempts}></input></p> */}
      <DoenetBox key={"show sol"+(this.updateNumber++)}
      evenOrOdd = {evenOrOdd+=1}      
      parentFunction={(e)=>{
        this.updateNumber+=1
        this.showSolution = e;
        this.AssignmentInfoChanged=true;
         this.forceUpdate()}} 
         type="checkbox" 
         title="Show solution: " 
         value={this.showSolution}/>
      {/* <p>show solution: <input onChange={()=>{this.showSolution= !this.showSolution;this.AssignmentInfoChanged=true;this.forceUpdate()}} type="checkbox" checked={this.showSolution}></input></p> */}
      <DoenetBox key={"show fback"+(this.updateNumber++)}
      evenOrOdd = {evenOrOdd+=1}      
      parentFunction={(e)=>{
        this.updateNumber+=1
        this.showFeedback = e;
        this.AssignmentInfoChanged=true;
         this.forceUpdate()}} 
         type="checkbox" 
         title="Show feedback: " 
         value={this.showFeedback}/>
      {/* <p>show feedback: <input onChange={()=>{this.showFeedback= !this.showFeedback;this.AssignmentInfoChanged=true;this.forceUpdate()}} type="checkbox" checked={this.showFeedback}></input></p> */}
      <DoenetBox key={"show hints"+(this.updateNumber++)}
      evenOrOdd = {evenOrOdd+=1}      
      parentFunction={(e)=>{
        this.updateNumber+=1
        this.showHints = e;
        this.AssignmentInfoChanged=true;
         this.forceUpdate()}} 
         type="checkbox" 
         title="Show hints: " 
         value={this.showHints}/>
      {/* <p>show hints: <input onChange={()=>{this.showHints= !this.showHints;this.AssignmentInfoChanged=true;this.forceUpdate()}} type="checkbox" checked={this.showHints}></input></p> */}
      <DoenetBox key={"show corr"+(this.updateNumber++)}
      evenOrOdd = {evenOrOdd+=1}      
      parentFunction={(e)=>{
        this.updateNumber+=1
        this.showCorrectness = e;
        this.AssignmentInfoChanged=true;
         this.forceUpdate()}} 
         type="checkbox" 
         title="Show correctness: " 
         value={this.showCorrectness}/>
      {/* <p>Show correctness: <input onChange={()=>{this.showCorrectness= !this.showCorrectness;this.AssignmentInfoChanged=true;this.forceUpdate()}} type="checkbox" checked={this.showCorrectness}></input></p> */}
      <DoenetBox key={"proctor"+(this.updateNumber++)}
      evenOrOdd = {evenOrOdd+=1}
      lastComponet = {true}     
      parentFunction={(e)=>{
        this.updateNumber+=1
        this.proctorMakesAvailable = e;
        this.AssignmentInfoChanged=true;
         this.forceUpdate()}} 
         type="checkbox" 
         title="Proctor make available: " 
         value={this.proctorMakesAvailable}/>
      {/* <p>Proctor make available: <input onChange={()=>{this.proctorMakesAvailable= !this.proctorMakesAvailable;this.AssignmentInfoChanged=true;this.forceUpdate()}} type="checkbox" checked={this.proctorMakesAvailable}></input></p> */}
      </SettingContainer>
</div>)
this.AssignmentInfoPackageReady = false
this.forceUpdate()
  }
  saveAssignmentInfo(){
    const urlDownload="/api/saveAssignmentInfo.php";
    console.log("saveAssignmentInfo")
    console.log(this.totalPointsOrPercent)
    const data={
      assignmentId:this.thisAssignmentInfo,
      assignmentName:this.assignmentName,
      assignedDate:this.assignedDate,

      gradeCategory:this.gradeCategory,
      totalPointsOrPercent:(this.totalPointsOrPercent===null?0:this.totalPointsOrPercent),
      individualize:(this.individualize===true?1:0),
      multipleAttempts:(this.multipleAttempts===true?1:0),
      showSolution:(this.showSolution===true?1:0),
      showFeedback:(this.showFeedback===true?1:0),
      showHints:(this.showHints===true?1:0),
      showCorrectness:(this.showCorrectness===true?1:0),
      proctorMakesAvailable:(this.proctorMakesAvailable===true?1:0),

      dueDate:this.dueDate,
      numberOfAttemptsAllowed:(this.numberOfAttemptsAllowed===""?0:this.numberOfAttemptsAllowed),
      timeLimit:(this.timeLimit===""?"00:00:00":this.timeLimit)
    }
    console.log("DATA IS")
    console.log(data)

    axios.post(urlDownload,data)
      .then(resp=>{
        console.log(resp.data)
      })
      .catch(error=>{this.setState({error:error})});
  }
  // openCalendar(){
  // //  const [startDate, setStartDate] = useState(new Date());
  //   this.calendar=(<DatePicker
  //     selected={new Date()}
  //     onChange={date => {new Date()}}
  //     showTimeSelect
  //     timeFormat="HH:mm:00"
  //     timeIntervals={15}
  //     timeCaption="time"
  //     dateFormat="yyyy-MM-d HH:mm:00"
  //   />)
  // }
  // componentWillUnmount(){
  //   <DoenetViewer componentWillUnmount />
  // }
  render() {
    console.log("====RENDER====");
    console.log(this.dueDate)
    if (this.AssignmentInfoPackageReady){
      this.buildRightSideInfoColumn()
    }
    if (this.AssignmentInfoChanged){
      this.AssignmentInfoChanged=false;
      this.saveAssignmentInfo()
    }
    if (this.state.newChange===true){
    this.ToggleList();
    }

    this.enableThese=[]
    this.enabledDisabledArray = {
      "overview":!!+this.state.overview,
      "syllabus":!!+this.state.syllabus,
      "grade":!!+this.state.grade,
      "assignment":!!+this.state.assignment,
    }
    Object.keys(this.enabledDisabledArray).map(e=>{
      if (this.enabledDisabledArray[e]===false){
        this.enableThese.push(<option value={e}>{e}</option>)
      }
    });
        this.TrueList = []
    Object.keys(this.enabledDisabledArray).map(e=>{
      if (this.enabledDisabledArray[e]===true){
        this.TrueList.push(e)
      }
    });
    let temp = false
    this.TrueList.forEach(e=>{
      if (e===this.activeSection && temp===false){
        temp=true
      }
    });
    if ( this.DoneLoading===true && temp===false && this.activeSection!=null){
      this.activeSection=this.TrueList[0]
      console.log("this might")
      this.updateLocationBar() // this make sure it has the correct URL
    }

    //We have an error so doen't show the viewer
    if (this.state.error){

      return (<React.Fragment>
        <p style={{color: "red"}}>{this.state.error && this.state.error.toString()}</p>
        </React.Fragment>);
    }

    if (this.activeSection === "overview"){
       this.buildOverview();
    } else if (this.activeSection === "syllabus"){
      this.buildSyllabus();
    } else if (this.activeSection === "grade"){
      this.buildGrades();
    }
    // let overview_component=null;
    // let syllabus_component=null;
    // let grade_component=null;
    // let assignment_component=null;
    let overview_class = "SectionContainer";
    let syllabus_class = "SectionContainer";
    let grade_class = "SectionContainer";
    let assignment_class = "SectionContainer";
    if (!this.state.overview){
      overview_class+=" disabled"
    }
    if (!this.state.syllabus){
      syllabus_class+=" disabled"
    }
    if (!this.state.grade){
      grade_class+=" disabled"
    }
    if (!this.state.assignment){
      assignment_class+=" disabled"
    }
    // let assignment03=(<div onClick={()=>{this.thisAssignmentInfo="VffOCH1I0h_ymB9KQHR24";
    // this.loadThisAssignmentInfo()}}>
    //   <span>Assignment03</span></div>)
    //   let assignment04=(<div onClick={()=>{this.thisAssignmentInfo="zxVi-pXiUtf3PodIXm45n";
    //   this.loadThisAssignmentInfo()}}>
    //     <span>Assignment04</span></div>)
    /**
     * how can we tell that the current tree is saved ?
     * answer: maybe we need a flag to indicate you have saved the current tree
     * for now: we havent have such flag yet
     */
    if (this.activeSection==="overview"){
      overview_class = "SectionContainer-Active";
    } else if (this.activeSection === "syllabus"){
      syllabus_class = "SectionContainer-Active";
    } else if (this.activeSection === "grade"){
      grade_class = "SectionContainer-Active";
    } else if (this.activeSection === "assignment"){
      assignment_class = "SectionContainer-Active";
    }
    let ModifyTreeInsertAssignmentHeadingModeComponent=
    (<div>
      <div className={assignment_class} data-cy="assignmentsNavItem" onClick={()=>{
      this.activeSection = "assignment";
      this.thisAssignmentInfo=""
      this.updateLocationBar({});
      this.forceUpdate()
      this.mainSection=(<div><h4>Assignments</h4><p>Select an assignment</p></div>);
    }}>
      <span className="Section-Text">Assignments</span>
      <span className="Section-Icon-Box">         
        <FontAwesomeIcon className="Section-Icon" onClick={()=>window.location.href="/editor/?branchId="+this.overview_branchId} icon={faEdit}/></span>
        <label className="switch">
          <input checked={this.state.assignment} onChange={(e)=>{this.setState({assignment:e.target.checked,newChange:true})}} type="checkbox"/>
        <span className="slider round"></span>
      </label>
        </div>

      <button className={this.enableMode==="position"?"selectedEnableButton":"button"} data-cy="modifyTree"
      onClick={()=>{this.enableMode='position';this.activeSection="assignment";this.buildTree();this.forceUpdate()}}>Modify position</button>

      <button className={this.enableMode==="remove"?"selectedEnableButton":"button"} data-cy="removeTree"
      onClick={()=>{this.enableMode='remove';this.activeSection="assignment";this.buildTree();this.forceUpdate()}}>Remove tree</button>

      <button className={this.enableMode==='header'?"selectedEnableButton":"button"} data-cy="addHeader"
      onClick={()=>{this.enableMode='header';this.activeSection="assignment";this.buildTree();this.forceUpdate()}}>Add Header</button>

      <button className={this.enableMode==='assignment'?"selectedEnableButton":"button"} data-cy="addAssignment"
      onClick={()=>{this.enableMode='assignment';this.activeSection="assignment";this.buildTree();this.forceUpdate()}}>Add Assignment</button>

    </div>);
      let tree_component = (<div >{this.tree}</div>)

    // if (this.state.overview){
       let overview_component = (<div className={overview_class} data-cy="overviewNavItem" 
       onClick={() => {
        this.activeSection = "overview";
        this.thisAssignmentInfo=""
        this.loadOverview();
        this.updateLocationBar({});
        this.forceUpdate();
      }}><span className="Section-Text">Overview</span>
      <span className="Section-Icon-Box">         
        <FontAwesomeIcon className="Section-Icon" onClick={()=>window.location.href="/editor/?branchId="+this.overview_branchId} icon={faEdit}/></span>
        <label class="switch">
          <input checked={this.state.overview} onChange={(e)=>{this.setState({overview:e.target.checked,newChange:true})}} type="checkbox"/>
        <span class="slider round"></span>
      </label>

      </div>)
    // }
    // if (this.state.syllabus){
       let syllabus_component =(
        <div className={syllabus_class} data-cy="syllabusNavItem" onClick={() => {
          this.activeSection = "syllabus";
          this.loadSyllabus();
          this.updateLocationBar({});
          this.thisAssignmentInfo=""
          this.buildTree()
          this.forceUpdate();
        }}><span className="Section-Text">Syllabus</span>
          <span className="Section-Icon-Box">         
        <FontAwesomeIcon className="Section-Icon"
         onClick={()=>window.location.href="/editor/?branchId="+this.syllabus_branchId} 
         icon={faEdit}/></span>
      
        <label className="switch">
          <input checked={this.state.syllabus} onChange={(e)=>{this.setState({syllabus:e.target.checked,newChange:true})}} type="checkbox"/>
        <span className="slider round"></span>
      </label>
        </div>)
    // }
    // if (this.state.grade){
       let grade_component = (<div className={grade_class} data-cy="gradesNavItem" onClick={() => {
        this.activeSection="grade";
        this.thisAssignmentInfo=""
        this.loadGrades();
        this.updateLocationBar({});
         this.forceUpdate();
        // className="GradeDisableButton" onClick={()=>{this.setState({grade:false,newChange:true});}}
      }}><span className="Section-Text">Grade</span>
      <span className="Section-Icon-Box">         
    <FontAwesomeIcon className="Section-Icon" icon={faEdit}/></span>
  {/* <span className="Section-Icon-Box"> */}
    {/* <FontAwesomeIcon className="Section-Icon" onClick={()=>{this.setState({grade:false,newChange:true});}} icon={faWindowClose}/></span> */}
    <label className="switch">
          <input checked={this.state.grade} onChange={(e)=>{this.setState({grade:e.target.checked,newChange:true})}} type="checkbox"/>
        <span className="slider round"></span>
      </label>
      </div>)
    // }
    if (this.adminAccess!=0){
      return (<React.Fragment>
        <div className="courseContainer">
          
          <DoenetHeader toolName="Admin" headingTitle={this.courseName} />
          <div className="homeLeftNav">
            {overview_component}
            {syllabus_component}
            {grade_component}
            
            {/* {assignment_component} */}
            {/* {assignment03} */}
            {/* {assignment04} */}
            {ModifyTreeInsertAssignmentHeadingModeComponent}
            {/* {this.state.assignment?tree_component:null} */}
            
          {/* <select style={{marginTop:"10px"}} onChange={this.EnableThese}>
            <option>Enable Section</option>
            {this.enableThese }
          </select> */}
          </div>
          <div className="homeActiveSection">
            {this.activeSection==="assignment"?tree_component:null}
            {this.activeSection!="assignment"?this.mainSection:null}
            {/* {this.state.loading ? (<div>Loading...</div>): this.mainSection} */}
          </div>
          {this.thisAssignmentInfo!=""?

  this.rightSideInfoColumn:null}
          
            

          </div>

        
      </React.Fragment>);
    } else {
      return (<React.Fragment>
        <DoenetHeader toolName="Admin" headingTitle={this.courseName} />
        <div>PERMISSION DENIED</div>
      </React.Fragment>)
    }
    

    let disablePrev = false;
    if (this.assignmentIndex === 0){disablePrev = true;}
    let disableNext = false;
    if (this.assignmentIndex === (this.assignmentIdList.length - 1)){disableNext = true;}
  }
}
/**
 * () => {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <DatePicker
      selected={startDate}
      onChange={date => setStartDate(date)}
      showTimeSelect
      timeFormat="HH:mm:00"
      timeIntervals={15}
      timeCaption="time"
      dateFormat="yyyy-MM-d HH:mm:00"
    />
  );
};
 */

export default DoenetAdmin;