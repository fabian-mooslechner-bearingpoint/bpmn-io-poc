// Require your custom property entries.
import customProps from "./props/CustomProps";

// import {isTextFieldEntryEdited} from "@bpmn-io/properties-panel";
// import customProps from "./props/CustomProps";
// import customGroup from "./props/CustomGroup";
import {is} from "bpmn-js/lib/util/ModelUtil";

var LOW_PRIORITY = 500;

export default function CustomPropertiesProvider(propertiesPanel, translate) {
    // this.getGroups = function(element) {
    //     return function(groups) {
    //
    //         console.log("groups", groups)
    //
    //         // Add the "magic" group
    //         if(is(element, 'bpmn:StartEvent')) {
    //             // groups.push(customGroup(element, translate));
    //         }
    //
    //         return groups;
    //     }
    // };

    this.getGroups = function (element) {
        return function (groups) {
            console.log("tabs")

            let generalGroup = groups.find((e) => e.id === "general");
            console.log("generalTab", generalGroup)
            const elements = generalGroup.elements;

            // let generalGroup = groups.find((e) => e.id === "general");

            let connectorGroup = groups.find((e) => e.id === "connector");
            // const connectorGroups = connectorGroup.groups;
            // console.log("connectorGroups", connectorGroups);
            // generalGroup.entries.concat(connectorGroups);
            // console.log("generalGroup", generalGroup);

            if (element.type === "bpmn:ServiceTask") {
                generalGroup.id = "config";
                generalGroup.label = "Configuration";
                generalGroup.id = "config";
                generalGroup.label = "Configuration";
                customProps(generalGroup, element, translate);
                // generalTab.groups = [generalGroup];
                // connectorGroups.forEach(connectorGroup => {
                //     generalTab.groups.push(connectorGroup);
                // });


                // groups = [generalTab];
            }

            return groups;
        };
    };

    // Register our custom  properties provider.
    // Use a lower priority to ensure it is loaded after the basic BPMN properties.
    propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

CustomPropertiesProvider.$inject = ["propertiesPanel", "translate"];
