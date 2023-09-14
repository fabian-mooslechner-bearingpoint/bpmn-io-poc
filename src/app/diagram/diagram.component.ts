import {
  AfterContentInit, AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input, OnChanges, OnDestroy, OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {from, map, Observable, Subscription, switchMap} from "rxjs";

import Modeler from "bpmn-js/lib/Modeler";
import {
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule
// @ts-ignore
} from 'bpmn-js-properties-panel';
// @ts-ignore
import customControlsModule from './custom-providers/palette';
// @ts-ignore
import customPropertiesProvider from './custom-providers/custom-properties/custom-property-provider';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent implements AfterViewInit, OnChanges, OnDestroy, OnInit {
  @ViewChild('diagram')
  diagramRef!: ElementRef;
    @ViewChild('properties')
    propertiesRef!: ElementRef;
  @Input()
  url?: string;
  @Output()
  importDone: EventEmitter<any> = new EventEmitter();

  modelXml = '';
  bpmnModeler: Modeler = new Modeler({
    // container: this.diagramRef.nativeElement,
    width: '100%',
    height: '600px',
    additionalModules: [
      BpmnPropertiesPanelModule,
      BpmnPropertiesProviderModule,
      customControlsModule,
      customPropertiesProvider,
    ],
    propertiesPanel: {
      // parent: this.propertiesRef.nativeElement,
    }
  });
  propertiesPanel = this.bpmnModeler.get('propertiesPanel');

  constructor(private http: HttpClient) {

  }

  ngAfterViewInit(): void {
    this.bpmnModeler.attachTo(this.diagramRef.nativeElement);
    // @ts-ignore
    this.propertiesPanel?.attachTo(this.propertiesRef.nativeElement);
  }

  ngOnInit(): void {
    if (this.url) {
      this.loadUrl(this.url);
    }
    if (this.url) {
      this.loadUrl(this.url);
    }
    this.getEvents();
    this.getElements();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['url'] && this.bpmnModeler) {
      this.loadUrl(changes['url'].currentValue);
    }
  }

  ngOnDestroy(): void {
    this.bpmnModeler?.destroy();
  }

  private getEvents() {
    if (!this.bpmnModeler) {
      return;
    }

    this.bpmnModeler.on('element.changed', (event: any) => {
      console.log("Event: ", event)
      const element = event['element'];
      console.log(element);
      console.log(element.type, ": ", element.id, ", ", element.height, "x", element.width);
    })
    this.bpmnModeler.on('element.hover', (event) => {
      // console.log(event)
    })

    // const eventBus = this.bpmnModeler.get('eventBus');
    //
    // const events = [
    //   'element.hover',
    //   'element.out',
    //   'element.click',
    //   'element.dblclick',
    //   'element.mousedown',
    //   'element.mouseup'
    // ];
    //
    // events.forEach(function(event) {
    //
    //   // @ts-ignore
    //   eventBus.on(event, function(e: object) {
    //     // e.element = the model element
    //     // e.gfx = the graphical element
    //
    //     console.log(event, 'on', e);
    //   });
    // });
  }

  getElements() {
    if (!this.bpmnModeler) {
      return;
    }

    const elementReg: object = this.bpmnModeler.get('elementRegistry');
    // console.log(this.bpmnViewer.get('elementRegistry'))
    console.log("Registry from modeler")
    console.log(elementReg)
    // @ts-ignore
    console.log(elementReg.get('SCAN_OK'))

    // var elementRegistry = this.bpmnJS.get('elementRegistry');
    //
    // console.log("Element registry: ", elementRegistry);
    // console.log("Elements: ", elementRegistry._elements);
    // Object.entries(elementRegistry._elements).forEach((key, item) => {
    //   console.log(key, ": ", item);
    // })
    // for (const elementId in elementRegistry._elements) {
    //   const elementObject = elementRegistry._elements[elementId];
    //   console.log("Element registry: ", elementObject)
    //   // Process the elementObject
    //   // console.log(elementObject);
    // }
    // // console.log(elementRegistry._elements.get('SCAN_OK'))
    // var sequenceFlowElement = elementRegistry.get('SCAN_OK');
    // console.log("Registry element: ", sequenceFlowElement);
    // //   sequenceFlow = sequenceFlowElement.businessObject;
    // //
    // // sequenceFlow.name; // 'YES'
    // // sequenceFlow.conditionExpression; // ModdleElement { $type: 'bpmn:FormalExpression', ... }
    // //
    // var moddle = this.bpmnJS.get('moddle');
    // console.log("Moddle: ", moddle);
    // var newCondition = moddle.create('bpmn:FormalExpression', {
    //   body: '${ value > 100 }'
    // });
    // console.log("new condition", newCondition);
    //
    // // var modeling = this.bpmnJS.get('modeling');
    // // console.log(modeling);
    // //
    // // modeling.updateProperties(sequenceFlowElement, {
    // //   conditionExpression: newCondition
    // // });
  }

  loadUrl(url: string): Subscription {

    return (
      this.http.get(url, { responseType: 'text' }).pipe(
        switchMap((xml: string) => this.importDiagram(xml)),
        map(result => result.warnings),
      ).subscribe(
        (warnings) => {
          this.importDone.emit({
            type: 'success',
            warnings
          });
        },
        (err) => {
          this.importDone.emit({
            type: 'error',
            error: err
          });
        }
      )
    );
  }

  saveXml() {
    this.bpmnModeler?.saveXML({format: true}).then((xml: any) => {
      this.modelXml = xml.xml;
    });
  }

  private importDiagram(xml: string): Observable<{warnings: Array<any>}> {
    // return from(this.bpmnJS.importXML(xml) as Promise<{warnings: Array<any>}>);
    //   console.log(xml);
    return from(this.bpmnModeler?.importXML(xml) as Promise<{warnings: Array<any>}>);
  }
}
