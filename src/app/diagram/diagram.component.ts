import {
  AfterContentInit,
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

// @ts-ignore
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';
import BpmnModeler from 'bpmn-js/lib/Modeler';
// @ts-ignore
import minimapModule from 'diagram-js-minimap';
// @ts-ignore
import BpmnColorPickerModule from 'bpmn-js-color-picker';
// // @ts-ignore
// import {
//   BpmnPropertiesPanelModule,
//   BpmnPropertiesProviderModule
// } from 'bpmn-js-properties-panel';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent implements AfterContentInit, OnChanges, OnDestroy, OnInit {
  @ViewChild('ref', {static: true})
  diagramRef!: ElementRef
  @Input()
  url?: string;
  @Output()
  importDone: EventEmitter<any> = new EventEmitter();

  // private bpmnJS: BpmnJS = new BpmnJS();
  // bpmnJS = new BpmnViewer();
  bpmnJS = new BpmnJS({
    additionalModules: [
      minimapModule,
      BpmnColorPickerModule,
    ]
  });
  modelXml = '';
  bpmnModeler = new BpmnModeler({
    keyboard: {bindTo: document},
  });
  bpmnViewer = new BpmnViewer();

  constructor(private http: HttpClient) {
    console.log(this.bpmnJS);
    // @ts-ignore
    this.bpmnJS.on('import.done', ({error}) => {
      if (!error) {
        console.log('Fit viewport')
        // this.bpmnJS.get('canvas').zoom('fit-viewport')
      }
    });

    this.getEvents();
    // this.addOverlays();
    this.getElements();
  }

  ngAfterContentInit(): void {
    this.bpmnJS.attachTo(this.diagramRef.nativeElement);
    // this.bpmnModeler.attachTo(this.diagramRef.nativeElement);
    // this.bpmnViewer.attachTo(this.diagramRef.nativeElement);
    // console.log(this.bpmnJS);
    // console.log(this.bpmnModeler);
    // console.log(this.bpmnViewer);
  }

  ngOnInit(): void {
    if (this.url) {
      this.loadUrl(this.url);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // re-import whenever the url changes
    if (changes['url']) {
      this.loadUrl(changes['url'].currentValue);
    }
  }

  ngOnDestroy(): void {
    this.bpmnJS.destroy();
  }

  private getEvents() {
    var eventBus = this.bpmnJS.get('eventBus');

// you may hook into any of the following events
    var events = [
      'element.hover',
      'element.out',
      'element.click',
      'element.dblclick',
      'element.mousedown',
      'element.mouseup'
    ];

    events.forEach(function(event) {

      eventBus.on(event, function(e: object) {
        // e.element = the model element
        // e.gfx = the graphical element

        // console.log(event, 'on', e);
      });
    });
  }

  getElements() {
    var elementRegistry = this.bpmnJS.get('elementRegistry');

    console.log(elementRegistry);
    console.log(elementRegistry._elements);
    for (const elementId in elementRegistry._elements) {
      const elementObject = elementRegistry._elements[elementId];
      console.log(elementObject)
      // Process the elementObject
    }
    // console.log(elementRegistry._elements.get('SCAN_OK'))
    // var sequenceFlowElement = elementRegistry.get('SequenceFlow_1'),
    //   sequenceFlow = sequenceFlowElement.businessObject;
    //
    // sequenceFlow.name; // 'YES'
    // sequenceFlow.conditionExpression; // ModdleElement { $type: 'bpmn:FormalExpression', ... }
    //
    // var moddle = this.bpmnJS.get('moddle');

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
    this.bpmnJS.saveXML({format: true}).then((xml: any) => {
      this.modelXml = xml.xml;
    });
  }

  private importDiagram(xml: string): Observable<{warnings: Array<any>}> {
    return from(this.bpmnJS.importXML(xml) as Promise<{warnings: Array<any>}>);
  }
}
