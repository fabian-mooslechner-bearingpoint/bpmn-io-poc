export default class CustomPalette {
    constructor(create, elementFactory, palette, translate) {
        this.create = create;
        this.elementFactory = elementFactory;
        this.translate = translate;

        palette.registerProvider(this);
    }

    getPaletteEntries(element) {
        const {
            create,
            elementFactory,
            translate
        } = this;

        function createServiceTask(event) {
            const shape = elementFactory.createShape({ type: 'bpmn:ServiceTask' });

            create.start(event, shape);
        }

        return function (entries) {
            console.log("palette entries: ", entries)
            delete entries["create.group"];
            delete entries["create.participant-expanded"];
            delete entries["create.data-store"];
            delete entries["create.intermediate-event"];
            delete entries["create.service-task"];
            delete entries["create.subprocess-expanded"];

            entries["create.service-task"] = {
                group: 'activity',
                className: 'bpmn-icon-service-task',
                title: translate('Create ServiceTask'),
                action: {
                    dragstart: createServiceTask,
                    click: createServiceTask
                }
            };
            return entries;
        };
    }
}

CustomPalette.$inject = [
    'create',
    'elementFactory',
    'palette',
    'translate'
];
