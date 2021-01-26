import React, { useState } from "react";
import styled from "styled-components";
import { atom } from "recoil";
import ResponsiveControlsWrapper from "../Tool/ResponsiveControls";

export const supportVisible = atom({
  key: "supportVisibleAtom",
  default: false,
});

const SupportPanelContainer = styled.div`
  overflow: auto;
`;

const ResponsiveControlsContainer = styled.div`
  height: 32px;
  border-bottom: 1px solid black;
  display: flex;
`;

export default function SupportPanel({ children, responsiveControls }) {
  const [supportPanelHeaderGrpWidth, setSupportPanelHeaderGrpWidth] = useState(
    0
  );
  const [
    supportPanelHeaderCtrlGrpEl,
    setSupportPanelHeaderCtrlGrpEl,
  ] = useState(null);

  const setSupportHeaderCtrlGroupRef = (element) => {
    if (element) {
      setSupportPanelHeaderCtrlGrpEl(element);
      setSupportPanelHeaderGrpWidth(element.clientWidth);
    }
  };

  const resizeWindowHanlderForSupportPanel = () => {
    if (supportPanelHeaderCtrlGrpEl) {
      //console.log(supportPanelHeaderCtrlGrpEl.clientWidth, "supportPanelHeaderCtrlGrpEl.clientWidth");
      setSupportPanelHeaderGrpWidth(supportPanelHeaderCtrlGrpEl.clientWidth);
    }
  };

  let responsiveControlsContents = null;

  if (responsiveControls) {
    responsiveControlsContents = (
      <ResponsiveControlsContainer>
        <ResponsiveControlsWrapper mainPanelWidth={supportPanelHeaderGrpWidth}>
          {responsiveControls}
        </ResponsiveControlsWrapper>
      </ResponsiveControlsContainer>
    );
  }

  return (
    <SupportPanelContainer>
      {responsiveControlsContents}
      {children}
    </SupportPanelContainer>
  );
}
