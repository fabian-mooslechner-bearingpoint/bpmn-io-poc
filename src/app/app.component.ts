import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bpmn-poc';
  diagramUrl = 'https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';
  // diagramUrl = 'https://raw.githubusercontent.com/bpmn-io/bpmn-js-examples/main/bpmn-properties/test/spec/diagram.bpmn';
  //   diagramUrl = 'https://raw.githubusercontent.com/bpmn-io/bpmn-js-examples/main/properties-panel/resources/newDiagram.bpmn';

  handleImported(event: any) {

    const {
      type,
      error,
      warnings
    } = event;

    if (type === 'success') {
      console.log(`Rendered diagram (%s warnings)`, warnings.length);
    }

    if (type === 'error') {
      console.error('Failed to render diagram', error);
    }
  }
}
