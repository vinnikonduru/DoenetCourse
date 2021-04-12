import React, { useEffect, useState, useRef } from "react";
import Tool from "../Tool";

import {
  atom,
  useSetRecoilState,
  useRecoilValue,
  selector,
  useRecoilState,
  selectorFamily,
  useRecoilValueLoadable,
  useRecoilStateLoadable,
  useRecoilCallback
} from "recoil";
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
        console.log(">>>> published value", value.assignedData.branchId);
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
  console.log(">>>content info  props", props);
  let courseId = props.courseId;
  let itemId = props.itemId;
  let itemType = props.itemType;
  let assignmentId = "";
  let driveId = props.routePathDriveId;
  let folderId = props.routePathFolderId;
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
  let branchId = '';
  // console.log(">>>> folderInfoObj",folderInfoObj);
  if(folderInfoObj?.state === "hasValue"){
 
  let itemInfo = folderInfoObj?.contents?.contentsDictionary[itemId];
    if (itemInfo?.itemType === "DoenetML"){
      branchId = itemInfo.branchId;
    }
  }
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

      {role === "Instructor" &&
      (assignmentId === "" || assignmentId === undefined) &&
      itemType === "DoenetML" ? (
        <ToggleButton value="Make Assignment" callback={handleMakeAssignment} />
      ) : null}
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

      {role === "Instructor" && assignmentInfo?.isAssignment == "1" && (
        <ToggleButton value="Make Content" callback={handleMakeContent} />
      )}

      {role === "Instructor" &&
      assignmentId &&
      assignmentInfo?.isAssignment == "0" ? (
        <ToggleButton value="Make Assignment" callback={loadBackAssignment} />
      ) : null}
    </div>
  );
};

export default function Content({ branchId = '',contentId ='',title }) {

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
            // itemType={""}
            // courseId={courseId}
            // routePathDriveId={routePathDriveId}
            // routePathFolderId={routePathFolderId}
            // itemId={""}
          />
        )}

       </menuPanel>

    </Tool>
  );
}

