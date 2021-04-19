import React, { useEffect, useState, useRef } from "react";
import Tool from "../Tool";
import { nanoid } from 'nanoid';

import {
  atom,
  useSetRecoilState,
  useRecoilValue,
  selector,
  useRecoilState,
  selectorFamily,
  useRecoilValueLoadable,
  useRecoilStateLoadable,
  useRecoilCallback,
  atomFamily
} from "recoil";
import axios from "axios";

import DoenetViewer from '../../../Viewer/DoenetViewer';
import { fileByContentId } from "./Editor";
import Drive, { 
  folderDictionarySelector, 
  globalSelectedNodesAtom, 
  folderDictionary, 
  clearDriveAndItemSelections,
  fetchDrivesSelector,
  encodeParams,
  fetchDriveUsers,
  fetchDrivesQuery,
} from "../../../_reactComponents/Drive/Drive";
import ToggleButton from '../../../_reactComponents/PanelHeaderComponents/ToggleButton'
export const viewerContentDoenetMLAtom = atom({
  key:"viewerContentDoenetMLAtom",
  default:{updateNumber:0,doenetML:""}
})
const roleAtom = atom({
  key: "roleAtom",
  default: "Instructor",
});
export const assignmentDictionary = atomFamily({
  key: "assignmentDictionary",
  default: selectorFamily({
    key: "assignmentDictionary/Default",
    get: (driveIdcourseIditemIdparentFolderId) => async (
      { get },
      instructions
    ) => {
      let folderInfoQueryKey = {
        driveId: driveIdcourseIditemIdparentFolderId.driveId,
        folderId: driveIdcourseIditemIdparentFolderId.folderId,
      };
      let folderInfo = get(folderDictionarySelector(folderInfoQueryKey));

      const itemObj =
        folderInfo?.contentsDictionary?.[
          driveIdcourseIditemIdparentFolderId.itemId
        ];
      let itemIdassignmentId = itemObj?.assignmentId
        ? itemObj.assignmentId
        : null;
      if (itemIdassignmentId) {
        const assignmentInfo = await get(
          loadAssignmentSelector(itemIdassignmentId)
        );
        if (assignmentInfo) {
          return assignmentInfo?.assignments[0];
        } else return null;
      } else return null;
    },
  }),
});
let assignmentDictionarySelector = selectorFamily({
  //recoilvalue(assignmentDictionarySelector(assignmentId))
  key: "assignmentDictionarySelector",
  get: (driveIdcourseIditemIdparentFolderId) => ({ get }) => {
    return get(assignmentDictionary(driveIdcourseIditemIdparentFolderId));
  },
  set: (driveIdcourseIditemIdparentFolderId) => (
    { set, get },
    instructions
  ) => {
    let { type, ...value } = instructions;
    switch (type) {
      case "change settings":
        set(
          assignmentDictionary(driveIdcourseIditemIdparentFolderId),
          (old) => {
            return { ...old, ...value };
          }
        );

        break;
      case "save assignment settings":
        const saveInfo = get(
          assignmentDictionary(driveIdcourseIditemIdparentFolderId)
        );
        set(
          assignmentDictionary(driveIdcourseIditemIdparentFolderId),
          (old) => {
            return { ...old, ...value };
          }
        );
        let saveAssignmentNew = { ...saveInfo, ...value };
        set(
          assignmentDictionary(driveIdcourseIditemIdparentFolderId),
          saveAssignmentNew
        );
        const payload = {
          ...saveInfo,
          assignmentId: saveAssignmentNew.assignmentId,
          assignment_isPublished: "0",
        };

        axios.post("/api/saveAssignmentToDraft.php", payload).then((resp) => {
          console.log(resp.data);
        });
        break;
      case "make new assignment":
        
        let newAssignmentObj = {
          ...value,
          title: "Untitled Assignment",
          assignedDate: '',
          attemptAggregation: '',
          dueDate: '',
          gradeCategory: '',
          individualize: "0",
          isAssignment: "1",
          isPublished: "0",
          itemId: driveIdcourseIditemIdparentFolderId.itemId,
          multipleAttempts: '',
          numberOfAttemptsAllowed: '',
          proctorMakesAvailable: "0",
          showCorrectness: "1",
          showFeedback: "1",
          showHints: "1",
          showSolution: "1",
          timeLimit: '',
          totalPointsOrPercent: '',
          assignment_isPublished: "0",
        };

        set(
          assignmentDictionary(driveIdcourseIditemIdparentFolderId),
          newAssignmentObj
        );
        break;
      case "assignment was published":
        // console.log(">>>> published value", value.assignedData.branchId);
        let publishAssignment = get(
          assignmentDictionary(driveIdcourseIditemIdparentFolderId)
        );

        set(
          assignmentDictionary(driveIdcourseIditemIdparentFolderId),
          publishAssignment
        );
        const payloadPublish = {
          ...publishAssignment,
          assignmentId: publishAssignment.assignmentId,
          assignment_isPublished: "1",
          branchId:value.assignedData.branchId,
          courseId: driveIdcourseIditemIdparentFolderId.courseId,
        };
        axios
          .post("/api/publishAssignment.php", payloadPublish)
          .then((resp) => {
            console.log(resp.data);
          });
        break;
      case "update new assignment":
        let editAssignment = get(
          assignmentDictionary(driveIdcourseIditemIdparentFolderId)
        );

        set(
          assignmentDictionary(driveIdcourseIditemIdparentFolderId),
          editAssignment
        );

        break;
      case "assignment to content":
        let handlebackContent = get(
          assignmentDictionary(driveIdcourseIditemIdparentFolderId)
        );

        const payloadContent = {
          ...handlebackContent,
          isAssignment: 0,
        };
        set(
          assignmentDictionary(driveIdcourseIditemIdparentFolderId),
          payloadContent
        );

        break;
      case "load available assignment":
        let handlebackAssignment = get(
          assignmentDictionary(driveIdcourseIditemIdparentFolderId)
        );

        const payloadAssignment = {
          ...handlebackAssignment,
          isAssignment: 1,
        };
        set(
          assignmentDictionary(driveIdcourseIditemIdparentFolderId),
          payloadAssignment
        );

        break;
    }
  },
});
const ContentInfoPanel = (props) => {
  // console.log(">>>content info  props", props);
  let courseId = props.courseId;
  let itemId = props.itemId;
  let itemType = props.itemType;
  let assignmentId = "";
  let driveId = props.routePathDriveId;
  let folderId = props.routePathFolderId;
  let branchId = props.branchId;

  const [role, setRole] = useRecoilState(roleAtom);
  const assignmentIdSettings = useRecoilValueLoadable(
    assignmentDictionarySelector({
      itemId: itemId,
      courseId: courseId,
      driveId: driveId,
      folderId: folderId,
    })
  );
  const setAssignmentSettings = useSetRecoilState(
    assignmentDictionarySelector({
      itemId: itemId,
      courseId: courseId,
      driveId: driveId,
      folderId: folderId,
    })
  );
  const [folderInfoObj, setFolderInfo] = useRecoilStateLoadable(
    folderDictionarySelector({ driveId: driveId, folderId: folderId })
  );
  
  // console.log(">>>> folderInfoObj",folderInfoObj);
  // if(folderInfoObj?.state === "hasValue"){
  //   console.log(">>>> folderInfoObj",folderInfoObj);

  // let itemInfo = folderInfoObj?.contents?.contentsDictionary[itemId];
  //   if (itemInfo?.itemType === "DoenetML"){
  //     branchId = itemInfo.branchId;
  //   }
  // }
  const [makeNewAssignment, setMakeNewAssignment] = useState(false);

  let assignmentInfo = "";

  if (assignmentIdSettings?.state === "hasValue") {
    assignmentInfo = assignmentIdSettings?.contents;
    if (assignmentInfo?.assignmentId) {
      assignmentId = assignmentInfo?.assignmentId;
      setAssignmentSettings({ type: "update new assignment", assignmentInfo });
    }
  }

  const handleMakeAssignment = () => {
    setMakeNewAssignment(true);
  };
  if (
    makeNewAssignment &&
    (assignmentId === "" || assignmentId === undefined)
  ) {
    assignmentId = nanoid(); // This is to generate a new one

    setAssignmentSettings({
      type: "make new assignment",
      assignmentId: assignmentId,
    });
    let payload = {
      assignmentId,
      itemId,
      courseId,
      branchId
    };
    setMakeNewAssignment(false);
    axios.post(`/api/makeNewAssignment.php`, payload).then((response) => {
      console.log(response.data);
    });
  }

  const handlePublishContent = () => {
    let payload = {
      itemId: itemId,
    };
    setFolderInfo({
      instructionType: "content was published",
      itemId: itemId,
      payload: payload,
    });

    axios.post(`/api/handlePublishContent.php`, payload).then((response) => {
      console.log(response.data);
    });
  };

  const [makecontent, setMakeContent] = useState(false);

  const handleMakeContent = (e) => {
    setMakeContent(true);
  };

  if (makecontent) {
    let payload = {
      itemId: itemId,
    };
    setMakeContent(false);
    axios.post(`/api/handleMakeContent.php`, payload).then((response) => {
      console.log(response.data);
    });
    setAssignmentSettings({ type: "assignment to content", assignmentInfo });
    setFolderInfo({
      instructionType: "assignment to content",
      itemId: itemId,
      assignedDataSavenew: payload,
    });
  }

  const loadBackAssignment = () => {
    let payload = {
      itemId: itemId,
    };
    axios.post(`/api/handleBackAssignment.php`, payload).then((response) => {
      console.log(response.data);
    });
    setAssignmentSettings({
      type: "load available assignment",
      assignmentInfo,
    });
    setFolderInfo({
      instructionType: "assignment title update",
      itemId: itemId,
      payloadAssignment: assignmentInfo,
    });
  };
  const AssignmentForm = (props) => {
    let courseId = props.courseId;
    let itemType = props.itemType;
    let assignmentId = props.assignmentId;
    let itemId = props.itemId;
    let driveId = props.driveId;
    let folderId = props.folderId;
    let assignmentInfo = props.assignmentInfo;
  
    const role = useRecoilValue(roleAtom);
  
    const setAssignmentSettings = useSetRecoilState(
      assignmentDictionarySelector({
        itemId: itemId,
        courseId: courseId,
        driveId: driveId,
        folderId: folderId,
      })
    );
    const [folderInfoObj, setFolderInfo] = useRecoilStateLoadable(
      folderDictionarySelector({ driveId: driveId, folderId: folderId })
    );
    let branchId = '';
      if(folderInfoObj?.state === "hasValue"){
   
      let itemInfo = folderInfoObj?.contents?.contentsDictionary[itemId];
        if (itemInfo?.itemType === "DoenetML"){
          branchId = itemInfo.branchId;
        }
      }
  
    const handleChange = (event) => {
      let name = event.target.name;
      let value =
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value;
      setAssignmentSettings({ type: "change settings", [name]: value });
    };
    const handleOnBlur = (e) => {
      let name = e.target.name;
      let value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
      setAssignmentSettings({ type: "save assignment settings", [name]: value });
    };
  
    const handleSubmit = (e) => {
      const payload = {
        ...assignmentInfo,
        assignmentId: assignmentId,
        assignment_isPublished: "1",
        courseId: courseId,
        branchId:branchId
      };
  
      setAssignmentSettings({
        type: "assignment was published",
        itemId: itemId,
        assignedData: payload,
      });
      setFolderInfo({
        instructionType: "assignment was published",
        itemId: itemId,
        payload: payload,
      });
    };
  
    return role === "Instructor" ? (
      <>
      {console.log(">>>> in form",assignmentInfo)}
        {assignmentId && (
          <>
            <div>
              <label>Assignment Name :</label>
              <input
                required
                type="text"
                name="title"
                value={assignmentInfo ? assignmentInfo?.title :''}
                placeholder="Title goes here"
                onBlur={handleOnBlur}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Assigned Date:</label>
              <input
                required
                type="text"
                name="assignedDate"
                value={assignmentInfo ? assignmentInfo?.assignedDate : ''  }
                placeholder="0001-01-01 01:01:01 "
                onBlur={handleOnBlur}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Due date: </label>
              <input
                required
                type="text"
                name="dueDate"
                value={ assignmentInfo ? assignmentInfo?.dueDate  : ''}
                placeholder="0001-01-01 01:01:01"
                onBlur={handleOnBlur}
                onChange={handleChange}
              />
            </div>
  
            <div>
              <label>Time Limit:</label>
              <input
                required
                type="time"
                name="timeLimit"
                value={ assignmentInfo ? assignmentInfo?.timeLimit  : ''}
                placeholder="01:01:01"
                onBlur={handleOnBlur}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Number Of Attempts:</label>
              <input
                required
                type="number"
                name="numberOfAttemptsAllowed"
                value={ assignmentInfo ? assignmentInfo?.numberOfAttemptsAllowed  : ''}
                onBlur={handleOnBlur}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Attempt Aggregation :</label>
              <input
                required
                type="text"
                name="attemptAggregation"
                value={ assignmentInfo ? assignmentInfo?.attemptAggregation  : ''}
                onBlur={handleOnBlur}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Total Points Or Percent: </label>
              <input
                required
                type="number"
                name="totalPointsOrPercent"
                value={ assignmentInfo ? assignmentInfo?.totalPointsOrPercent  : ''}
                onBlur={handleOnBlur}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Grade Category: </label>
              <input
                required
                type="select"
                name="gradeCategory"
                value={ assignmentInfo ? assignmentInfo?.gradeCategory  : ''}
                onBlur={handleOnBlur}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Individualize: </label>
              <input
                required
                type="checkbox"
                name="individualize"
                value={assignmentInfo ?  assignmentInfo?.individualize  : ''}
                onBlur={handleOnBlur}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Multiple Attempts: </label>
              <input
                required
                type="checkbox"
                name="multipleAttempts"
                value={ assignmentInfo ? assignmentInfo?.multipleAttempts  : ''}
                onBlur={handleOnBlur}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Show solution: </label>
              <input
                required
                type="checkbox"
                name="showSolution"
                value={ assignmentInfo ? assignmentInfo?.showSolution  : ''}
                onBlur={handleOnBlur}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Show feedback: </label>
              <input
                required
                type="checkbox"
                name="showFeedback"
                value={ assignmentInfo ? assignmentInfo?.showFeedback  : ''}
                onBlur={handleOnBlur}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Show hints: </label>
              <input
                required
                type="checkbox"
                name="showHints"
                value={ assignmentInfo ? assignmentInfo?.showHints  : ''}
                onBlur={handleOnBlur}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Show correctness: </label>
              <input
                required
                type="checkbox"
                name="showCorrectness"
                value={assignmentInfo ? assignmentInfo?.showCorrectness  : ''}
                onBlur={handleOnBlur}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Proctor make available: </label>
              <input
                required
                type="checkbox"
                name="proctorMakesAvailable"
                value={ assignmentInfo ? assignmentInfo?.proctorMakesAvailable : ''}
                onBlur={handleOnBlur}
                onChange={handleChange}
              />
            </div>
            <div>
              <ToggleButton
                value="Publish"
                switch_value="publish changes"
                callback={handleSubmit}
                type="submit"
              ></ToggleButton>
            </div>
            <div></div>
          </>
        )}
      </>
    ) : (
      <div>
        {assignmentId && (
          <div>
            <h1>{assignmentInfo?.title}</h1>
            <p>Due: {assignmentInfo?.dueDate}</p>
            <p>Time Limit: {assignmentInfo?.timeLimit}</p>
            <p>
              Number of Attempts Allowed:{" "}
              {assignmentInfo?.numberOfAttemptsAllowed}
            </p>
            <p>Points: {assignmentInfo?.totalPointsOrPercent}</p>
          </div>
        )}
      </div>
    );
  };
  return (
    <div>
      <br />

      {role === "Instructor" &&
        assignmentInfo?.assignment_isPublished !== "1" && (
          <ToggleButton
            value="Publish Content"
            switch_value="Published"
            callback={handlePublishContent}
          />
        )}

      {role === "Instructor" ? (
        <ToggleButton value="Make Assignment" callback={handleMakeAssignment} />
      ) 
      : null}
      <br />
      {assignmentId && assignmentInfo?.isAssignment == "1" && (
        <AssignmentForm
          itemType={itemType}
          courseId={courseId}
          driveId={driveId}
          folderId={folderId}
          assignmentId={assignmentId}
          assignmentInfo={assignmentInfo}
          itemId={itemId}
        />
      )}

      {/* {role === "Instructor" && assignmentInfo?.isAssignment == "1" && (
        <ToggleButton value="Make Content" callback={handleMakeContent} />
      )} */}

      {role === "Instructor" &&
      assignmentId &&
      assignmentInfo?.isAssignment == "0" ? (
        <ToggleButton value="Make Assignment" callback={loadBackAssignment} />
      ) : null}
    </div>
  );
};

export default function Content({ branchId = '',contentId ='',title,courseId = '' }) {

  let initDoenetML = useRecoilCallback(({snapshot,set})=> async (contentId)=>{
    const response = await snapshot.getPromise(fileByContentId(contentId));
    const doenetML = response.data;
    const viewerObj = await snapshot.getPromise(viewerContentDoenetMLAtom);
    const updateNumber = viewerObj.updateNumber+1;
    set(viewerContentDoenetMLAtom,{updateNumber,doenetML})
  })

  useEffect(() => {
    initDoenetML(contentId ? contentId : branchId)
}, []);

const viewerDoenetML = useRecoilValue(viewerContentDoenetMLAtom);


let attemptNumber = 1;
let requestedVariant = { index: attemptNumber }
  return (
    <Tool>
      <headerPanel title={title}>
      </headerPanel>

      <mainPanel>
      <DoenetViewer
      key={"doenetviewer" + viewerDoenetML?.updateNumber}
      doenetML={viewerDoenetML?.doenetML}
      flags={{
        showCorrectness: true,
        readOnly: true,
        showFeedback: true,
        showHints: true,
      }}
      attemptNumber={attemptNumber}
      ignoreDatabase={false}
      requestedVariant={requestedVariant}
      /> 
      </mainPanel>
      <menuPanel title="Content Info">
       {(
          <ContentInfoPanel
            branchId={branchId}
            itemType={"DoenetML"}
            courseId={courseId}
            // routePathDriveId={routePathDriveId}
            // routePathFolderId={routePathFolderId}
            // itemId={""}
          />
        )}

       </menuPanel>

    </Tool>
  );
}

