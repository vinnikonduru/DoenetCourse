import React ,{useState} from 'react';
import axios from 'axios';
import { atom, useRecoilValue, useRecoilValueLoadable,useSetRecoilState } from 'recoil';
import { globalSelectedNodesAtom } from '../../../_reactComponents/Drive/NewDrive';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import IncrementMenu from '../../../_reactComponents/PanelHeaderComponents/IncrementMenu';
import Switch from '../../_framework/Switch';
import { useToast } from '../../_framework/Toast';

import { useAssignment } from '../../course/CourseActions';
import { useAssignmentCallbacks } from '../../../_reactComponents/Drive/DriveActions';
import { itemHistoryAtom ,assignmentDictionarySelector} from '../ToolHandlers/CourseToolHandler';

export const selectedVersionAtom = atom({
  key: 'selectedVersionAtom',
  default: '',
});
export default function SelectedDoenetId(props){

  const selection = useRecoilValue(globalSelectedNodesAtom);
  // console.log(">>> new @@@@ here selection",selection);
  const [checkIsAssigned, setIsAssigned] = useState(false);
  const [selectVersion, setSelectVersion] = useState(false);
  const [selectedVId, setSelectedVId] = useState();
  const setSelectedVersionAtom = useSetRecoilState(selectedVersionAtom);
  const [addToast, ToastType] = useToast();

  const {addContentAssignment,changeSettings,updateVersionHistory,saveSettings,assignmentToContent,loadAvailableAssignment, publishContentAssignment,onAssignmentError} = useAssignment();
  const {makeAssignment,onmakeAssignmentError,publishAssignment,onPublishAssignmentError,publishContent,onPublishContentError, updateAssignmentTitle,onUpdateAssignmentTitleError,convertAssignmentToContent,onConvertAssignmentToContentError} = useAssignmentCallbacks();
  // console.log(">>> SelectedDoenetId selection",selection);
  let makeAssignmentforReleasedButton = null;
  let assignmentForm = null;


  const assignmentInfoSettings = useRecoilValueLoadable(
    assignmentDictionarySelector({
      driveId: selection[0].driveId,
      folderId: selection[0].parentFolderId,
      itemId: selection[0].itemId,
      doenetId: selection[0].doenetId,
      versionId: selection[0].versionId,
      contentId: selection[0].contentId,
    }),
  );

  let aInfo = '';

  if (assignmentInfoSettings?.state === 'hasValue') {
    aInfo = assignmentInfoSettings?.contents; 
  } 
  // console.log(">>>>> here aInfo",aInfo);
  
  // handle on blur on aForm
  const handleOnBlur = (e) => {
    e.preventDefault();
    let name = e.target.name;
    let value = e.target.value;
    if(value !== oldValue ){
    const result = saveSettings({
      [name]: value,
      driveIditemIddoenetIdparentFolderId: {
        driveId: itemInfo.driveId,
        folderId: itemInfo.parentFolderId,
        itemId: itemInfo.itemId,
        doenetId: itemInfo.doenetId,
        versionId: selectedVId,
        contentId: selectedContentId(),
      },
    });
    let payload = {
      ...aInfo,
      itemId: itemInfo.itemId,
      isAssigned: '1',
      [name]: value,
      doenetId: itemInfo.doenetId,
      contentId: itemInfo.contentId,
    };
    updateAssignmentTitle({
      driveIdFolderId: {
        driveId: itemInfo.driveId,
        folderId: itemInfo.parentFolderId,
      },
      itemId: itemInfo.itemId,
      payloadAssignment: payload,
      doenetId: itemInfo.doenetId,
      contentId: itemInfo.contentId,
    });

        result
          .then((resp) => {
            if (resp.data.success) {
              addToast(`Updated '${name}' to '${value}'`, ToastType.SUCCESS);
            } else {
              onAssignmentError({ errorMessage: resp.data.message });
            }
          })
          .catch((e) => {
            onAssignmentError({ errorMessage: e.message });
          });
  }
  };
  // released versions selection 
  const selectedVersion = (item) => {
    setSelectVersion(true);
    setSelectedVId(item);
    setSelectedVersionAtom(item);
  };

  const versionHistory = useRecoilValueLoadable(itemHistoryAtom(selection[0].doenetId));
  if (versionHistory.state === "loading"){ return null;}
  if (versionHistory.state === "hasError"){ 
    console.error(versionHistory.contents)
    return null;}
    // if (versionHistory.state === "hasValue"){ 
    //   const contentId = versionHistory.contents.named.contentId;
    //  }
    // console.log(">>>> ## versionHistory",versionHistory);
  
  let assigned = (
    <select multiple onChange={(event) => selectedVersion(event.target.value)}>
      {versionHistory.contents.named.map((item, i) => (
        <>
          {item.isReleased == 1 ? (
            <option key={i} value={item.versionId}>
              {item.isAssigned == '1' ? '(Assigned)' : ''}
              {item.title}
            </option>
          ) : (
            ''
          )}
        </>
      ))}
    </select>
  );
  makeAssignmentforReleasedButton = (
    <>
      <Button
        value="Make Assignment"
        onClick={async () => {
          setIsAssigned(true);

          const versionResult = await updateVersionHistory(selection[0].doenetId, selection[0].versionId);

          const result = await addContentAssignment({
            driveIditemIddoenetIdparentFolderId: {
              driveId: selection[0].driveId,
              folderId: selection[0].parentFolderId,
              itemId: selection[0].itemId,
              doenetId: selection[0].doenetId,
              contentId: selection[0].contentId,
              versionId: selection[0].versionId,
            },
            doenetId: selection[0].doenetId,
            contentId: selection[0].contentId,
            versionId: selection[0].versionId,
          });
          let payload = {
            ...aInfo,
            itemId: selection[0].itemId,
            isAssigned: '1',
            doenetId: selection[0].doenetId,
            contentId: selection[0].contentId,
            driveId: selection[0].driveId,
            versionId: selection[0].versionId,
          };

          // makeAssignment({
          //   driveIdFolderId: {
          //     driveId: selection[0].driveId,
          //     folderId: selection[0].parentFolderId,
          //   },
          //   itemId: selection[0].itemId,
          //   payload: payload,
          // });
          try {
            if (result.success && versionResult) {
              addToast(
                `Add new assignment`,
                ToastType.SUCCESS,
              );
            } else {
              onAssignmentError({ errorMessage: result.message });
            }
          } catch (e) {
            onAssignmentError({ errorMessage: e });
          }
        }}
      />
      
      <br />
    </>
  );

  assignmentForm = (
    <>
      {
        <>
          <h3>Assignment Info</h3>
          <div>
            <label>Assigned Date:</label>
            <input
              required
              type="text"
              name="assignedDate"
              value={aInfo ? aInfo?.assignedDate : ''}
              placeholder="0001-01-01 01:01:01 "
              // onBlur={handleOnBlur}
              // onChange={handleChange}
              // onFocus={handleOnfocus}
            />
          </div>
          <div>
            <label>Due date: </label>
            <input
              required
              type="text"
              name="dueDate"
              value={aInfo ? aInfo?.dueDate : ''}
              placeholder="0001-01-01 01:01:01"
              // onBlur={handleOnBlur}
              // onChange={handleChange}
              // onFocus={handleOnfocus}
            />
          </div>
          <div>
            <label>Time Limit:</label>
            <input
              required
              type="time"
              name="timeLimit"
              value={aInfo ? aInfo?.timeLimit : ''}
              placeholder="01:01:01"
              // onBlur={handleOnBlur}
              // onChange={handleChange}
              // onFocus={handleOnfocus}
            />
          </div>
          <div>
            <label>Number Of Attempts:</label>
            <IncrementMenu range={[0, 20]} />
            <input
              required
              type="number"
              name="numberOfAttemptsAllowed"
              value={aInfo ? aInfo?.numberOfAttemptsAllowed : ''}
              // onBlur={handleOnBlur}
              // onChange={handleChange}
              // onFocus={handleOnfocus}
            />
          </div>
          <div>
            <label>Attempt Aggregation :</label>
            <select name="attemptAggregation" 
            // onChange={handleOnBlur}
            >
              <option
                value="m"
                selected={aInfo?.attemptAggregation === 'm' ? 'selected' : ''}
              >
                Maximum
              </option>
              <option
                value="l"
                selected={aInfo?.attemptAggregation === 'l' ? 'selected' : ''}
              >
                Last Attempt
              </option>
            </select>
          </div>
          <div>
            <label>Total Points Or Percent: </label>
            <input
              required
              type="number"
              name="totalPointsOrPercent"
              value={aInfo ? aInfo?.totalPointsOrPercent : ''}
              // onBlur={handleOnBlur}
              // onChange={handleChange}
              // onFocus={handleOnfocus}
            />
          </div>
          <div>
            <label>Grade Category: </label>
            <input
              required
              type="select"
              name="gradeCategory"
              value={aInfo ? aInfo?.gradeCategory : ''}
              // onBlur={handleOnBlur}
              // onChange={handleChange}
              // onFocus={handleOnfocus}
            />
          </div>
          <div>
            <label>Individualize: </label>
            <Switch
              name="individualize"
              // onChange={handleOnBlur}
              checked={aInfo ? aInfo?.individualize : false}
            ></Switch>
          </div>
          <div>
            <label>Multiple Attempts: </label>
            <Switch
            name="multipleAttempts"
              // onChange={handleOnBlur}
              checked={aInfo ? aInfo?.multipleAttempts : false}
            ></Switch>
          </div>
          <div>
            <label>Show solution: </label>
            <Switch
            name="showSolution"
              // onChange={handleOnBlur}
              checked={aInfo ? aInfo?.showSolution : false}
            ></Switch>
          </div>
          <div>
            <label>Show feedback: </label>
            <Switch
            name="showFeedback"
              // onChange={handleOnBlur}
              checked={aInfo ? aInfo?.showFeedback : false}
            ></Switch>
          </div>
          <div>
            <label>Show hints: </label>
            <Switch
            name="showHints"
              // onChange={handleOnBlur}
              checked={aInfo ? aInfo?.showHints : false}
            ></Switch>         
          </div>
          <div>
            <label>Show correctness: </label>
            <Switch
            name="showCorrectness"
              // onChange={handleOnBlur}
              checked={aInfo ? aInfo?.showCorrectness : false}
            ></Switch> 
          </div>
          <div>
            <label>Proctor make available: </label>
            <Switch
            name="proctorMakesAvailable"
              // onChange={handleOnBlur}
              checked={aInfo ? aInfo?.proctorMakesAvailable : false}
            ></Switch> 
          </div>
          <br />
        </>
      }
    </>
  );
  const checkIfAssigned = () => {
    const assignedArr = versionHistory.contents.named.filter(
      (item) => item.versionId === selection[0].versionId,
    );
    if (assignedArr.length > 0 && assignedArr[0].isAssigned == '1') {
      return true;
    } else {
      return false;
    }
  };
let unAssignButton = ''; 
unAssignButton = (
  <>
    <Button
      value="Unassign"
      onClick={async () => {
        assignmentToContent({
          driveIditemIddoenetIdparentFolderId: {
            driveId: selection[0].driveId,
              folderId: selection[0].parentFolderId,
              itemId: selection[0].itemId,
              doenetId: selection[0].doenetId,
              contentId: selection[0].contentId,
              versionId: selection[0].versionId
          },
          doenetId: selection[0].doenetId,
          contentId: selection[0].contentId,
          versionId: selection[0].versionId
        });

        // convertAssignmentToContent({ // TODO
        //   driveIdFolderId: {
        //     driveId: selection[0].driveId,
        //       folderId: selection[0].parentFolderId,
        //   },
        //      itemId: selection[0].itemId,
        //       doenetId: selection[0].doenetId,
        //       contentId: selection[0].contentId,
        //       versionId: selection[0].versionId
        // });

        const result = axios.post(`/api/handleMakeContent.php`, {
          itemId: selection[0].itemId,
          doenetId: selection[0].doenetId,
          contentId: selection[0].contentId,
          versionId: selection[0].versionId
        });
        result
          .then((resp) => {
            if (resp.data.success) {
              addToast(
                `'UnAssigned ''`, 
                ToastType.SUCCESS,
              );
            } else {
              onAssignmentError({ errorMessage: resp.data.message });
            }
          })
          .catch((e) => {
            onAssignmentError({ errorMessage: e.message });
          });
      }}
    />
    <br />
    <br />
  </>
);
  return <>
  <p>Released Versions(Soon)</p>
  {assigned} 

  {selection[0].isAssigned == '1' && checkIfAssigned() && selectVersion && unAssignButton }

  {selection[0].isAssigned === '0' &&  selectVersion && makeAssignmentforReleasedButton}
  <br />
  {checkIsAssigned && assignmentForm}
  
  </>
}