import React ,{useState} from 'react';
import { useRecoilValue } from 'recoil';
import { globalSelectedNodesAtom } from '../../../_reactComponents/Drive/NewDrive';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import IncrementMenu from '../../../_reactComponents/PanelHeaderComponents/IncrementMenu';
import Switch from '../../_framework/Switch'
export default function SelectedDoenetId(props){

  const selection = useRecoilValue(globalSelectedNodesAtom);
  const [checkIsAssigned, setIsAssigned] = useState(false);

  // console.log(">>> SelectedDoenetId selection",selection);
  let makeAssignmentforReleasedButton = null;
  let assignmentForm = null;
  let aInfo = '';
  makeAssignmentforReleasedButton = (
    <>
      <Button
        value="Make Assignment"
        onClick={async () => {
          setIsAssigned(true);
          // const result = await addContentAssignment({
          //   driveIditemIddoenetIdparentFolderId: {
          //     driveId: itemInfo.driveId,
          //     folderId: itemInfo.parentFolderId,
          //     itemId: itemInfo.itemId,
          //     doenetId: itemInfo.doenetId,
          //     contentId: selectedContentId(),
          //     versionId: selectedVId,
          //   },
          //   doenetId: itemInfo.doenetId,
          //   contentId: selectedContentId(),
          //   versionId: selectedVId,
          // });
          // let payload = {
          //   ...aInfo,
          //   itemId: itemInfo.itemId,
          //   isAssigned: '1',
          //   doenetId: itemInfo.doenetId,
          //   contentId: selectedContentId(),
          //   driveId: itemInfo.driveId,
          //   versionId: selectedVId,
          // };

          // makeAssignment({
          //   driveIdFolderId: {
          //     driveId: itemInfo.driveId,
          //     folderId: itemInfo.parentFolderId,
          //   },
          //   itemId: itemInfo.itemId,
          //   payload: payload,
          // });
          // updateVersionHistory(itemInfo.doenetId, selectedVId);
          // try {
          //   if (result.success) {
          //     addToast(
          //       `Add new assignment`,
          //       ToastType.SUCCESS,
          //     );
          //   } else {
          //     onAssignmentError({ errorMessage: result.message });
          //   }
          // } catch (e) {
          //   onAssignmentError({ errorMessage: e });
          // }
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

  return <>
  <p>Released Versions(Soon)</p>
  {makeAssignmentforReleasedButton}
  <br />
  {checkIsAssigned && assignmentForm}
  
  </>
}