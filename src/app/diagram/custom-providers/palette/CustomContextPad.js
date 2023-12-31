export default class CustomContextPad {
  constructor(config, contextPad, create, elementFactory, injector, translate) {
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    if (config.autoPlace !== false) {
      this.autoPlace = injector.get('autoPlace', false);
    }

    contextPad.registerProvider(this);
  }

  getContextPadEntries(element) {
    const {
      autoPlace,
      create,
      elementFactory,
      translate
    } = this;

    function appendServiceTask(event, element) {
      if (autoPlace) {
        const shape = elementFactory.createShape({ type: 'bpmn:ServiceTask' });

        autoPlace.append(element, shape);
      } else {
        appendServiceTaskStart(event, element);
      }
    }

    function appendServiceTaskStart(event) {
      const shape = elementFactory.createShape({ type: 'bpmn:ServiceTask' });

      create.start(event, shape, element);
    }

    return function (entries) {
      if (element.type === "bpmn:ServiceTask") {
        delete entries["replace"];
      }

      delete entries["append.service-task"];
      delete entries["append.intermediate-event"];
      delete entries["append.intermediate-event"];
      delete entries["replace"];

      // entries["append.service-task"] = {
      //   group: 'model',
      //   className: 'bpmn-icon-service-task',
      //   title: translate('Append ServiceTask'),
      //   action: {
      //     click: appendServiceTask,
      //     dragstart: appendServiceTaskStart
      //   }
      // };
      return entries;
    };
  }
}

CustomContextPad.$inject = [
  'config',
  'contextPad',
  'create',
  'elementFactory',
  'injector',
  'translate'
];
