/**
 * External dependencies
 */
import React from 'react';
import { nanoid } from 'nanoid';
import axios from 'axios';
import { useRecoilCallback } from 'recoil';

/**
 * Internal dependencies
 */

import { assignmentDictionary } from '../_framework/Overlays/Content';
import Toast, { useToast } from '../../Tools/_framework/Toast';

export const useAssignment = () => {
  const [addToast, ToastType] = useToast();

  const addAssignment = useRecoilCallback(
    ({ snapshot, set }) => async ({
      driveIdcourseIditemIdparentFolderId,
      assignmentId,
    }) => {
      // assignment creation
      let newAssignmentObj = {
        assignmentId: assignmentId,
        title: 'Untitled Assignment',
        assignedDate: '',
        attemptAggregation: '',
        dueDate: '',
        gradeCategory: '',
        individualize: '0',
        isAssignment: '1',
        isPublished: '0',
        itemId: driveIdcourseIditemIdparentFolderId.itemId,
        multipleAttempts: '',
        numberOfAttemptsAllowed: '',
        proctorMakesAvailable: '0',
        showCorrectness: '1',
        showFeedback: '1',
        showHints: '1',
        showSolution: '1',
        timeLimit: '',
        totalPointsOrPercent: '',
        assignment_isPublished: '0',
        subType: 'Administrator',
      };

      let payload = {
        assignmentId: assignmentId,
        itemId: driveIdcourseIditemIdparentFolderId.itemId,
        courseId: driveIdcourseIditemIdparentFolderId.courseId,
        branchId: driveIdcourseIditemIdparentFolderId.branchId,
        contentId: driveIdcourseIditemIdparentFolderId.contentId,
      };

      axios.post(`/api/makeNewAssignment.php`, payload).then((response) => {
        console.log(response.data);
      });

      console.log(
        '>>>>>new assignment obj',
        assignmentDictionary(driveIdcourseIditemIdparentFolderId),
        newAssignmentObj,
      );
      set(
        assignmentDictionary(driveIdcourseIditemIdparentFolderId),
        newAssignmentObj,
      );

      return newAssignmentObj;
    },
  );

  const changeSettings = useRecoilCallback(
    ({ snapshot, set }) => async (
      props
    ) => {
      console.log(">>>>>>props in actions", props);
      let {driveIdcourseIditemIdparentFolderId,...value } = props
      set(
        assignmentDictionary(driveIdcourseIditemIdparentFolderId),
        (old) => {
          return { ...old, ...value };
        }
      );

    },
    
  );

  const saveSettings = useRecoilCallback(
    ({ snapshot, set }) => async ({
      driveIdcourseIditemIdparentFolderId,
      value,
    }) => {
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
    },
  );

  const publishAssignment = useRecoilCallback(
    ({ snapshot, set }) => async ({
      driveIdcourseIditemIdparentFolderId,
      value,
    }) => {
     
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
    },
  );
  const updateexistingAssignment = useRecoilCallback(
    ({ snapshot, set }) => async ({
      driveIdcourseIditemIdparentFolderId,
      value,
    }) => {
    let editAssignment = get(
          assignmentDictionary(driveIdcourseIditemIdparentFolderId)
        );

        set(
          assignmentDictionary(driveIdcourseIditemIdparentFolderId),
          editAssignment
        );
    },
  );
  const assignmentToContent = useRecoilCallback(
    ({ snapshot, set }) => async ({
      driveIdcourseIditemIdparentFolderId,
      value,
    }) => {
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

    },
  );
  const loadAvailableAssignment = useRecoilCallback(
    ({ snapshot, set }) => async ({
      driveIdcourseIditemIdparentFolderId,
      value,
    }) => {
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
    },
  );
  const onAssignmentError = ({ errorMessage = null }) => {
    addToast(`${errorMessage}`, ToastType.ERROR);
  };
  return {
    addAssignment,
    changeSettings,
    saveSettings,
    publishAssignment,
    updateexistingAssignment,
    assignmentToContent,
    loadAvailableAssignment,
    onAssignmentError,
  };
};

export const useAssignmentCallback = () =>{
  const assignmentCallbacks = useRecoilCallback(({ snapshot, get }) => async (driveIdcourseIditemIdparentFolderId) => {
    const aInfo = await snapshot.getPromise(assignmentDictionary(driveIdcourseIditemIdparentFolderId));
     
    return aInfo;

  });
  return {assignmentCallbacks};
}

 
