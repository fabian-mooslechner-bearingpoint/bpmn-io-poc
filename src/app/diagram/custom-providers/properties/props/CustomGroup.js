import {isTextFieldEntryEdited, TextFieldEntry} from "@bpmn-io/properties-panel";
import {useService} from "bpmn-js-properties-panel";

// Create the custom magic group
export default function (element, translate) {
    return {
        id: 'input',
        label: translate('Input Variables'),
        entries: generateElements(element)
    }
}

function generateElements (element) {
    return [
        {
            id: 'input',
            element,
            component: CustomEntry,
            isEdited: isTextFieldEntryEdited
        }
    ]
}

function CustomEntry(props) {
    const {element, id} = props;

    const modeling = useService('modeling');
    const translate = useService('translate');
    const debounce = useService('debounceInput');

    const getValue = () => {
        return element.businessObject.input || '';
    }

    const setValue = value => {
        return modeling.updateProperties(element, {
            input: value
        });
    }

    return <TextFieldEntry
    id=${ id }
    element=${ element }
    description=${ translate('Input Values from outside') }
    label=${ translate('Input Value') }
    getValue=${ getValue }
    setValue=${ setValue }
    debounce=${ debounce }
  />
}
