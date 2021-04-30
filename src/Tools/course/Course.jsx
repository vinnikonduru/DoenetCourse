/**
 * External dependencies
 */
import React, { useEffect, useState, Suspense, useContext } from 'react';

import { useHistory } from 'react-router-dom';
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
  atomFamily,
} from 'recoil';
import axios from 'axios';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import { nanoid } from 'nanoid';

/**
 * Internal dependencies
 */
import Drive, {
  folderDictionarySelector,
  clearDriveAndItemSelections,
  encodeParams,
} from '../../_reactComponents/Drive/Drive';
import { BreadcrumbContainer } from '../../_reactComponents/Breadcrumb';
import Button from '../../_reactComponents/PanelHeaderComponents/Button';
import DriveCards from '../../_reactComponents/Drive/DriveCards';
import '../../_reactComponents/Drive/drivecard.css';
import '../../_utils/util.css';
import GlobalFont from '../../_utils/GlobalFont';
import Tool from '../_framework/Tool';
import { useToolControlHelper, ProfileContext } from '../_framework/ToolRoot';
import Toast, { useToast } from '../_framework/Toast';
import { drivecardSelectedNodesAtom } from '../library/Library';
import Enrollment from './Enrollment';
import { useAssignment } from '../course/CourseActions';
import { useAssignmentCallbacks } from '../../_reactComponents/Drive/DriveActions';
import { selectedInformation } from '../library/Library';
// import {assignmentDictionary} from "../_framework/Overlays/Content"
import CollapseSection from '../../_reactComponents/PanelHeaderComponents/CollapseSection'

export const roleAtom = atom({
  key: 'roleAtom',
  default: 'Instructor',
});
const loadAssignmentSelector = selectorFamily({
  key: 'loadAssignmentSelector',
  get: (assignmentId) => async ({ get, set }) => {
    const { data } = await axios.get(
      `/api/getAllAssignmentSettings.php?assignmentId=${assignmentId}`,
    );
    return data;
  },
});
export const assignmentDictionary = atom({
  key: 'assignmentDictionary',
  default: selector({
    key: 'assignmentDictionary/Default',
    get: (driveIdcourseIditemIdparentFolderId) => async (
      { get },
      instructions,
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
        const aInfo = await get(loadAssignmentSelector(itemIdassignmentId));
        if (aInfo) {
          return aInfo?.assignments[0];
        } else return null;
      } else return null;
    },
  }),
});

function Container(props) {
  return (
    <div
      style={{
        maxWidth: '850px',
        // border: "1px red solid",
        padding: '20px',
        display: 'grid',
      }}
    >
      {props.children}
    </div>
  );
}

function AutoSelect(props) {
  const { activateMenuPanel } = useToolControlHelper();

  const contentInfoLoad = useRecoilValueLoadable(selectedInformation);
  if (contentInfoLoad?.contents?.number > 0) {
    activateMenuPanel(0);
  } else {
    activateMenuPanel(1);
  }
  return null;
}

export default function Course(props) {
  const {
    addContentAssignment,
    changeSettings,
    saveSettings,
    assignmentToContent,
    loadAvailableAssignment,
    publishContentAssignment,
    onAddAssignmentError,
  } = useAssignment();
  const {
    makeAssignment,
    onmakeAssignmentError,
    publishAssignment,
    onPublishAssignmentError,
    publishContent,
    onPublishContentError,
    updateAssignmentTitle,
    onUpdateAssignmentTitleError,
    convertAssignmentToContent,
    onConvertAssignmentToContentError,
  } = useAssignmentCallbacks();

  const { openOverlay, activateMenuPanel } = useToolControlHelper();
  const [toast, toastType] = useToast();
  let routePathDriveId = '';
  let routePathFolderId = '';
  let pathItemId = '';
  let itemType = '';
  let urlParamsObj = Object.fromEntries(
    new URLSearchParams(props.route.location.search),
  );
  if (urlParamsObj?.path !== undefined) {
    [
      routePathDriveId,
      routePathFolderId,
      pathItemId,
      itemType,
    ] = urlParamsObj.path.split(':');
  }
  if (urlParamsObj?.path !== undefined) {
    [routePathDriveId] = urlParamsObj.path.split(':');
  }
  let courseId = '';
  if (urlParamsObj?.courseId !== undefined) {
    courseId = urlParamsObj?.courseId;
  }

  //Select +Add menuPanel if no course selected on startup
  useEffect(() => {
    if (routePathDriveId === '') {
      activateMenuPanel(1);
    }
  }, []);
  const history = useHistory();

  const DriveCardCallBack = ({ item }) => {
    let newParams = {};
    newParams['path'] = `${item.driveId}:${item.driveId}:${item.driveId}:Drive`;
    newParams['courseId'] = `${item.courseId}`;
    history.push('?' + encodeParams(newParams));
  };
  const setDrivecardSelection = useSetRecoilState(drivecardSelectedNodesAtom);
  const clearSelections = useSetRecoilState(clearDriveAndItemSelections);
  const [openEnrollment, setEnrollmentView] = useState(false);
  const role = useRecoilValue(roleAtom);

  const profile = useContext(ProfileContext)
  console.log(">>>profile",profile)
  
    if (profile.signedIn === "0"){
      return (<>
       <GlobalFont/>
      <Tool>
  
        <headerPanel title="Course">
        </headerPanel>
  
        <mainPanel>
          <div style={{border:"1px solid grey",borderRadius:"20px",margin:"auto",marginTop:"10%",padding:"10px",width:"50%"}}>
            <div style={{textAlign:"center",alignItems:"center",marginBottom:"20px"}}>
            <h2>You are not signed in</h2>
            <h2>Course currently requires sign in for use</h2> 
            <button style={{background:"#1a5a99",borderRadius:"5px"}}><a href='/signin' style={{color:"white",textDecoration:"none"}}>Sign in with this link</a></button>
            </div>
            </div>
        </mainPanel>
      
       
      </Tool>
      </>
      )
    }
  function cleardrivecardSelection(){
    setDrivecardSelection([]);
    // let newParams = {};
    // newParams["path"] = `:::`;
    // history.push("?" + encodeParams(newParams));
  }
  function useOutsideDriveSelector() {
    let newParams = {};
    newParams['path'] = `:::`;
    history.push('?' + encodeParams(newParams));
  }
  let breadcrumbContainer = null;
  if (routePathDriveId) {
    breadcrumbContainer = <BreadcrumbContainer />;
  }

  const setEnrollment = (e) => {
    e.preventDefault();
    setEnrollmentView(!openEnrollment);
  };

  const enrollCourseId = { courseId: courseId };
  let hideUnpublished = true;
  if (role === 'Instructor') {
    hideUnpublished = false;
  }
  let urlClickBehavior = '';
  if (role === 'Instructor') {
    urlClickBehavior = 'select';
  }
  let responsiveControls = '';
  if (role === 'Instructor' && routePathDriveId) {
    responsiveControls = (
      <Button
        value={openEnrollment ? 'Close Enrollment' : 'Open Enrollment'}
        callback={(e) => setEnrollment(e)}
      ></Button>
    );
  }

  const profile = useContext(ProfileContext);
  if (profile.signedIn === '0') {
    return (
      <>
        <GlobalFont />
        <Tool>
          <headerPanel title="Course"></headerPanel>

          <mainPanel>
            <div
              style={{
                border: '1px solid grey',
                borderRadius: '20px',
                margin: 'auto',
                marginTop: '10%',
                padding: '10px',
                width: '50%',
              }}
            >
              <div
                style={{
                  textAlign: 'center',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}
              >
                <h2>You are not signed in</h2>
                <h2>Course currently requires sign in for use</h2>
                <button style={{ background: '#1a5a99', borderRadius: '5px' }}>
                  <a
                    href="/signin"
                    style={{ color: 'white', textDecoration: 'none' }}
                  >
                    Sign in with this link
                  </a>
                </button>
              </div>
            </div>
          </mainPanel>
        </Tool>
      </>
    );
  }

  const MaterialsInfo = () => {
    const contentInfoLoad = useRecoilValueLoadable(selectedInformation);

    let itemId = contentInfoLoad?.contents?.itemInfo?.itemId;
    let branchId = contentInfoLoad?.contents?.itemInfo?.branchId;
    let contentId = contentInfoLoad?.contents?.itemInfo?.contentId;
    let assignmentId = contentInfoLoad?.contents?.itemInfo?.assignmentId;
    let isAssignment = contentInfoLoad?.contents?.itemInfo?.isAssignment;
    let assignment_isPublished =
      contentInfoLoad?.contents?.itemInfo?.assignment_isPublished;
    const handlePublishContent = () => {
      let payload = {
        itemId: itemId,
      };
      publishContent({
        driveIdFolderId: {
          driveId: routePathDriveId,
          folderId: routePathFolderId,
        },
        itemId: itemId,
        payload: payload,
      });

      axios.post(`/api/handlePublishContent.php`, payload).then((response) => {
        console.log(response.data);
      });
    };
    const assignmentIdSettings = useRecoilValueLoadable(assignmentDictionary);

    let aInfo = '';
    if (assignmentIdSettings?.state === 'hasValue') {
      aInfo = assignmentIdSettings?.contents;
      
      if (aInfo?.assignmentId) {
        assignmentId = aInfo?.assignmentId;
      }
    }
    const handleMakeContent = (e) => {
      let payload = {
        itemId: itemId,
      };
      axios.post(`/api/handleMakeContent.php`, payload).then((response) => {
        console.log(response.data);
      });
      assignmentToContent();
      // setAssignmentForm((old)=>{   //TODO remove
      //   return  {...old, [isAssignment]: 0}
      // })
      convertAssignmentToContent({
        driveIdFolderId: {
          driveId: routePathDriveId,
          folderId: routePathFolderId,
        },
        itemId: itemId,
        assignedDataSavenew: payload,
      });
    };

    const AssignmentForm = (props) => {
      let courseId = props.courseId;
      let itemType = props.itemType;
      let assignmentId = props.aInfo.assignmentId;
      let itemId = props.itemId;
      let driveId = props.driveId;
      let folderId = props.folderId;
      // let branchId = props.branchId;
      let aInfo = props.aInfo;

      const role = useRecoilValue(roleAtom);

      const [folderInfoObj, setFolderInfo] = useRecoilStateLoadable(
        folderDictionarySelector({ driveId: driveId, folderId: folderId }),
      );
      let branchId = '';
      if (folderInfoObj?.state === 'hasValue') {
        let itemInfo = folderInfoObj?.contents?.contentsDictionary[itemId];
        if (itemInfo?.itemType === 'DoenetML') {
          branchId = itemInfo.branchId;
        }
      }

      const handleChange = (event) => {
        event.preventDefault();
        let name = event.target.name;
        let value =
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value;
      
        const result = changeSettings({
          [name]: value,
          driveIdcourseIditemIdparentFolderId: {
            driveId: driveId,
            folderId: folderId,
            itemId: itemId,
            courseId: courseId,
            branchId: branchId,
            contentId: contentId,
          },
        });
        result
          .then((resp) => {
            if (resp.data.success) {
              // addToast(`Renamed item to '${newLabel}'`, ToastType.SUCCESS);
            } else {
              // onRenameItemError({errorMessage: resp.data.message});
            }
          })
          .catch((e) => {
            // onRenameItemError({errorMessage: e.message});
          });
      };
      const handleOnBlur = (e) => {
        let name = e.target.name;
        let value =
          e.target.type === 'checkbox' ? e.target.checked : e.target.value;

   

        const result = saveSettings({
          [name]: value,
          driveIdcourseIditemIdparentFolderId: {
            driveId: driveId,
            folderId: folderId,
            itemId: itemId,
            courseId: courseId,
            branchId: branchId,
            contentId: contentId,
          },
        });
      };
  

      return (role === 'Instructor' && isAssignment === '1') ||
        assignment_isPublished === '1' ? (
        <>
          {
            <>
              <div>
                <label>Assignment Name :</label>
                <input
                  required
                  type="text"
                  name="title"
                  value={aInfo ? aInfo?.title : ''}
                  placeholder="Title goes here"
                  onBlur={(e) => handleOnBlur(e)}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Assigned Date:</label>
                <input
                  required
                  type="text"
                  name="assignedDate"
                  value={aInfo ? aInfo?.assignedDate : ''}
                  placeholder="0001-01-01 01:01:01 "
                  onBlur={() => handleOnBlur()}
                  onChange={handleChange}
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
                  value={aInfo ? aInfo?.timeLimit : ''}
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
                  value={aInfo ? aInfo?.numberOfAttemptsAllowed : ''}
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
                  value={aInfo ? aInfo?.attemptAggregation : ''}
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
                  value={aInfo ? aInfo?.totalPointsOrPercent : ''}
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
                  value={aInfo ? aInfo?.gradeCategory : ''}
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
                  value={aInfo ? aInfo?.individualize : ''}
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
                  value={aInfo ? aInfo?.multipleAttempts : ''}
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
                  value={aInfo ? aInfo?.showSolution : ''}
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
                  value={aInfo ? aInfo?.showFeedback : ''}
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
                  value={aInfo ? aInfo?.showHints : ''}
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
                  value={aInfo ? aInfo?.showCorrectness : ''}
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
                  value={aInfo ? aInfo?.proctorMakesAvailable : ''}
                  onBlur={handleOnBlur}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Button
                  value="Publish assignment"
                  switch_value="publish changes"
                  callback={() => {
                    const payload = {
                      ...aInfo,
                      assignmentId: assignmentId,
                      assignment_isPublished: '1',
                      courseId: courseId,
                      branchId: branchId,
                    };
                    publishAssignment({
                      driveIdFolderId: {
                        driveId: driveId,
                        folderId: folderId,
                      },
                      itemId: itemId,
                      payload: payload,
                    });
                    const result = publishContentAssignment(payload);
                    // if(result){
                    //   setAssignmentForm(result);
                    // }
                    result.then((resp) => {
                      if (resp) {
                        // addToast(`Add new assignment 'Untitled assignment'`, ToastType.SUCCESS);
                        // setAssignmentForm(resp) TODO
                      }
                      // else{
                      //   onAddAssignmentError({errorMessage: resp.data.message});
                      // }
                    });
                    // .catch( e => {
                    //   onAddAssignmentError({errorMessage: e.message});
                    // })
                  }}
                  type="submit"
                ></Button>
                <br />
              </div>
              <div></div>
              <div></div>
            </>
          }
        </>
      ) : (
        <div>
          {role === 'Student' &&
            isAssignment === '1' &&
            assignment_isPublished ===
              '1'(
                <div>
                  <h1>{aInfo?.title}</h1>
                  <p>Due: {aInfo?.dueDate}</p>
                  <p>Time Limit: {aInfo?.timeLimit}</p>
                  <p>
                    Number of Attempts Allowed: {aInfo?.numberOfAttemptsAllowed}
                  </p>
                  <p>Points: {aInfo?.totalPointsOrPercent}</p>
                </div>,
              )}
        </div>
      );
    };
    const [showAForm, setShowAForm] = useState(false);

    const loadBackAssignment = () => {
      let payload = {
        itemId: itemId,
      };
      axios.post(`/api/handleBackAssignment.php`, payload).then((response) => {
        console.log(response.data);
      });

      loadAvailableAssignment({
        aInfo,
      });

      //    setFolderInfo({                                            //TODO
      //   instructionType: "assignment title update",
      //   itemId: itemId,
      //   payloadAssignment: aInfo,
      // });

      updateAssignmentTitle({
        driveIdFolderId: {
          driveId: routePathDriveId,
          folderId: routePathFolderId,
        },
        itemId: itemId,
        // payloadAssignment: {assignmentId:aInfo.assignmentId,title:aInfo.assignment_title},
      });
    };
    return (
      <>
        {assignment_isPublished != '1' && !assignmentId && isAssignment === '0' ? (
          <>
          <br />
          <Button
            value="Make Assignment"
            callback={() => {
              let assignmentId = nanoid();
              setShowAForm(true);
              const result = addContentAssignment({
                driveIdcourseIditemIdparentFolderId: {
                  driveId: routePathDriveId,
                  folderId: routePathFolderId,
                  itemId: itemId,
                  courseId: courseId,
                  branchId: branchId,
                  contentId: contentId,
                },
                assignmentId: assignmentId,
              });
              result.then((resp) => {
                if (resp) {
                  let payload = {
                    itemId: itemId,
                    // title:aInfo.assignment_title
                  };
                  makeAssignment({
                    driveIdFolderId: {
                      driveId: routePathDriveId,
                      folderId: routePathFolderId,
                    },
                    itemId: itemId,
                    payload: payload,
                  });
                  // addToast(`Add new assignment 'Untitled assignment'`, ToastType.SUCCESS);
                  // setAssignmentForm(resp) TODO
                }
                // else{
                //   onAddAssignmentError({errorMessage: resp.data.message});
                // }
              });
              // .catch( e => {
              //   onAddAssignmentError({errorMessage: e.message});
              // })
            }}
          />
          </>
        ) : (
          ' '
        )}
        <br />
        <br />
        <Button
          value="Publish Content"
          switch_value="Published"
          callback={handlePublishContent}
        />
        <br />
        { (role === 'Instructor' && isAssignment === '1') || assignment_isPublished === '1' ?
           <Button value="Make Content" callback={handleMakeContent} />
                  : " "}


        {(isAssignment === '1' || showAForm) && (
          <CollapseSection>
          <AssignmentForm
            itemType={itemType}
            courseId={courseId}
            driveId={routePathDriveId}
            folderId={routePathFolderId}
            branchId={branchId}
            assignmentId={assignmentId}
            aInfo={aInfo}
            itemId={itemId}
          />
          </CollapseSection>
        )}

        {role === 'Instructor' && assignmentId && isAssignment == '0' ? (
          <Button value="load Assignment" callback={loadBackAssignment} />
        ) : null}
      </>
    );
  };

  return (
    <Tool>
      <headerPanel title="Course" />
      <navPanel isInitOpen>
        <GlobalFont />
        <div
          style={{ marginBottom: '40px', height: '100vh' }}
          onClick={useOutsideDriveSelector}
        >
          <Drive driveId={routePathDriveId} foldersOnly={true} />
        </div>
      </navPanel>

      <mainPanel
        responsiveControls={responsiveControls}
        // responsiveControls={routePathDriveId ?
        // <Button value={openEnrollment ? "Close Enrollment" : "Open Enrollment"} callback={(e)=>setEnrollment(e)}></Button>: ''}
      >
        <AutoSelect />
        {openEnrollment ? (
          <Enrollment selectedCourse={enrollCourseId} />
        ) : (
          <>
            {breadcrumbContainer}
            <div
              onClick={() => {
                clearSelections();
              }}
              className={routePathDriveId ? 'mainPanelStyle' : ''}
            >
              <Container>
                <Drive
                  driveId={routePathDriveId}
                  hideUnpublished={hideUnpublished}
                  subTypes={['Administrator']}
                  // types={['content','course']}
                  urlClickBehavior="select"
                  doenetMLDoubleClickCallback={(info) => {
                    let isAssignment =
                      info.item.isAssignment === '0' ? 'content' : 'assignment';
                    openOverlay({
                      type:isAssignment,
                      branchId: info.item.branchId,
                      contentId:info.item.contentId,
                      assignmentId:info.item.assignmentId,
                     
                    });
                    // openOverlay({
                    //   type: 'materials',
                    //   branchId: info.item.branchId,
                    //   contentId: info.item.contentId,
                    //   courseId: courseId,
                    //   driveId: routePathDriveId,
                    //   folderId: routePathFolderId,
                    //   itemId: info.item.itemId,
                    //   title: info.item.label,
                    // });
                  }}
                />
              </Container>
            </div>

            <div
              onClick={cleardrivecardSelection}
              tabIndex={0}
              className={routePathDriveId ? '' : 'mainPanelStyle'}
            >
              {!routePathDriveId && <h2>Admin</h2>}
              <DriveCards
                routePathDriveId={routePathDriveId}
                isOneDriveSelect={true}
                types={['course']}
                subTypes={['Administrator']}
                driveDoubleClickCallback={({ item }) => {
                  DriveCardCallBack({ item });
                }}
              />
              {!routePathDriveId && <h2>Student</h2>}
              <DriveCards
                routePathDriveId={routePathDriveId}
                isOneDriveSelect={true}
                types={['course']}
                subTypes={['Student']}
                driveDoubleClickCallback={({ item }) => {
                  DriveCardCallBack({ item });
                }}
              />
            </div>
          </>
        )}
      </mainPanel>
      {routePathDriveId && (
        <menuPanel isInitOpen title="Selected">
          <MaterialsInfo />
        </menuPanel>
      )}
      <menuPanel title="+add"></menuPanel>
    </Tool>
  );
}
