import CompositeComponent from './abstract/CompositeComponent';
import { postProcessCopy } from '../utils/copy';

export default class CopyFromSubs extends CompositeComponent {
  static componentType = "copyfromsubs";

  static useReplacementsWhenCopyProp = true;

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.fromMapAncestor = { default: 0 };
    properties.fixed = { default: true, useDefaultForShadows: true }
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atMostOneFixed = childLogic.newLeaf({
      name: "atMostOneFixed",
      componentType: "fixed",
      comparison: "atMost",
      number: 1,
    })

    let atMostOneString = childLogic.newLeaf({
      name: "atMostOneString",
      componentType: 'string',
      comparison: 'atMost',
      number: 1,
    });

    childLogic.newOperator({
      name: "stringAndFixed",
      operator: "and",
      propositions: [atMostOneFixed, atMostOneString],
      setAsBase: true,
    })

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.substitutionsNumber = {
      returnDependencies: () => ({
        stringChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneString",
          variableNames: ["value"],
        },
      }),
      defaultValue: 1,
      definition: function ({ dependencyValues }) {
        if (dependencyValues.stringChild.length === 0) {
          return { useEssentialOrDefaultValue: { substitutionsNumber: { variablesToCheck: ["substitutionsNumber"] } } }
        }
        let number = Number(dependencyValues.stringChild[0].stateValues.value);
        if (Number.isNaN(number)) {
          number = 1;
        }
        return { newValues: { substitutionsNumber: number } };
      }
    }

    stateVariableDefinitions.targetSubsName = {
      additionalStateVariablesDefined: ["childNumber"],
      stateVariablesDeterminingDependencies: ["fromMapAncestor", "substitutionsNumber"],
      returnDependencies: function ({ stateValues, sharedParameters }) {
        let substitutionsInfo = sharedParameters.substitutionsInfo;

        if (substitutionsInfo === undefined) {
          throw Error(`copyfromsubs can only be inside a map template.`);
        }

        let level = substitutionsInfo.length - 1 - stateValues.fromMapAncestor;
        let infoForLevel = substitutionsInfo[level];
        if (infoForLevel === undefined) {
          throw Error(`Invalid value of copyfromsubs fromMapAncestor: ${stateValues.fromMapAncestor}`);
        }
        let infoForSubs = infoForLevel[stateValues.substitutionsNumber - 1];
        if (infoForSubs === undefined) {
          throw Error(`Invalid substitutionsNumber of copyfromsubs: ${stateValues.substitutionsNumber}`);
        };

        return {
          targetSubsName: {
            dependencyType: "value",
            value: infoForSubs.name,
          },
          childNumber: {
            dependencyType: "value",
            value: infoForSubs.childNumber
          }
        }

      },
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            targetSubsName: dependencyValues.targetSubsName,
            childNumber: dependencyValues.childNumber
          },
          makeEssential: ["targetSubsName", "childNumber"],
        }
      },
    };

    stateVariableDefinitions.targetSubs = {
      stateVariablesDeterminingDependencies: ["targetSubsName"],
      returnDependencies: ({ stateValues }) => ({
        targetSubsComponent: {
          dependencyType: "componentIdentity",
          componentName: stateValues.targetSubsName,
        }
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { targetSubs: dependencyValues.targetSubsComponent } }
      },
    };


    stateVariableDefinitions.replacementClassesForProp = {
      returnDependencies: () => ({
        targetSubs: {
          dependencyType: "stateVariable",
          variableName: "targetSubs"
        }
      }),
      definition: function ({ dependencyValues, componentInfoObjects }) {
        return {
          newValues: {
            replacementClassesForProp: [componentInfoObjects.allComponentClasses[dependencyValues.targetSubs.componentType]],
          }
        };
      },
    };


    stateVariableDefinitions.readyToExpand = {
      stateVariablesDeterminingDependencies: [
        "targetSubs"
      ],
      returnDependencies: function ({ stateValues, componentInfoObjects }) {

        let dependencies = {}

        let compositeClass = componentInfoObjects.allComponentClasses._composite;
        let targetSubsClass = componentInfoObjects.allComponentClasses[stateValues.targetSubs.componentType];

        if (compositeClass.isPrototypeOf(targetSubsClass)) {
          dependencies.targetSubsReady = {
            dependencyType: "componentStateVariable",
            componentIdentity: stateValues.targetSubs,
            variableName: "readyToExpand"
          }
        }

        return dependencies;

      },
      definition: function () {
        return { newValues: { readyToExpand: true } };
      },
    };



    return stateVariableDefinitions;
  }



  static createSerializedReplacements({ component, components, workspace }) {

    // console.log(`createSerializedReplacements for ${component.componentName}`);

    let serializedCopy;

    let targetSubsComponent = components[component.stateValues.targetSubs.componentName];
    let targetChild = targetSubsComponent.activeChildren[component.stateValues.childNumber];
    if (targetChild === undefined) {
      workspace.targetChildName = undefined;
      return [];
    }
    workspace.targetChildName = targetChild.componentName;
    serializedCopy = targetChild.serialize({ forCopy: true });
    serializedCopy = [serializedCopy];

    return { replacements: postProcessCopy({ serializedComponents: serializedCopy, componentName: component.componentName }) };

  }

  static calculateReplacementChanges({ component, components, workspace }) {
    let targetSubsComponent = components[component.stateValues.targetSubs.componentName];
    let targetChild = targetSubsComponent.activeChildren[component.stateValues.childNumber];
    if (targetChild === undefined) {
      workspace.targetChildName = undefined;
      if (component.replacements.length > 0) {
        let replacementInstruction = {
          changeType: "delete",
          changeTopLevelReplacements: true,
          firstReplacementInd: 0,
          numberReplacementsToDelete: component.replacements.length,
        }

        replacementChanges.push(replacementInstruction);
      }
      return replacementChanges;
    }

    if (targetChild.componentName !== workspace.targetChildName) {
      // have different child than last time
      // create new replacements and delete old ones
      workspace.targetChildName = targetChild.componentName;
      serializedCopy = targetChild.serialize({ forCopy: true });
      serializedCopy = [serializedCopy];

      let newSerializedReplacements = postProcessCopy({ serializedComponents: serializedCopy, componentName: component.componentName });

      let replacementInstruction = {
        changeType: "add",
        changeTopLevelReplacements: true,
        firstReplacementInd: 0,
        numberReplacementsToReplace: component.replacements.length,
        serializedReplacements: newSerializedReplacements,
        replacementsToWithhold: 0,
      };

      replacementChanges.push(replacementInstruction);

    }

    return replacementChanges;


  }


}