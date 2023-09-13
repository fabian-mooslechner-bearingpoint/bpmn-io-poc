import {ListEntry, ListGroup} from '@bpmn-io/properties-panel';

export default function (element, injector, translate) {

    return {
        id: 'parameters',
        label: translate('Magic parameters'),
        component: ListGroup,
        ...ParametersProps({element, injector})
    };
}

function ParametersProps({ element, injector }) {

    const parameters = getParameters(element) || [];

    const bpmnFactory = injector.get('bpmnFactory'),
        commandStack = injector.get('commandStack');

    const items = parameters.map((parameter, index) => {
        const id = element.id + '-parameter-' + index;

        return {
            id,
            label: parameter.get('name') || '',
            entries: ParameterProps({
                idPrefix: id,
                element,
                parameter
            }),
            autoFocusEntry: id + '-name',
            remove: removeFactory({ commandStack, element, parameter })
        };
    });

    return {
        items,
        add: addFactory({ element, bpmnFactory, commandStack })
    };
}

function removeFactory({ commandStack, element, parameter }) {
    return function(event) {
        // ...
    };
}

function addFactory({ element, bpmnFactory, commandStack }) {
    return function(event) {
        // ...
    }
}

function ExtensionList(props) {
    const {
        element,
        idPrefix,
        parameter
    } = props;

    const id = `${ idPrefix }-extensions`;

    const bpmnFactory = useService('bpmnFactory');
    const commandStack = useService('commandStack');
    const translate = useService('translate');

    const businessObject = getBusinessObject(element);

    let extensions = parameter.get('extensions');

    const extensionsList = (extensions && extensions.get('extensions')) || [];

    function addExtension() {
        // ...
    }

    function removeExtension(extension) {
        // ...
    }

    return <ListEntry
        element={ element }
        autoFocusEntry={ `[data-entry-id="${id}-extension-${extensionsList.length - 1}"] input` }
        id={ id }
        label={ translate('Extensions') }
        items={ extensionsList }
        component={ Extension }
        onAdd={ addExtension }
        onRemove={ removeExtension } />;
}
