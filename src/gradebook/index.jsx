import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { DropTargetsProvider } from "../imports/DropTarget";
import { BreadcrumbProvider } from "../imports/Breadcrumb";
import { RecoilRoot } from "recoil";
import ToolRoot from "../imports/Tool/ToolRoot";

import DoenetGradebook from "../Tools/DoenetGradebook";

    ReactDOM.render(
      <DropTargetsProvider>
        <BreadcrumbProvider>
          <RecoilRoot>
            <Router >
              <Switch>
                <Route
                  path="/"
                  render={(routeprops) => (
                    <ToolRoot
                      tool={<DoenetGradebook key={"BaseTool"} route={{ ...routeprops }}/>}
                    />
                  )}
                />
              </Switch>
            </Router>
          </RecoilRoot>
        </BreadcrumbProvider>
      </DropTargetsProvider>
  ,document.getElementById('root'));



  