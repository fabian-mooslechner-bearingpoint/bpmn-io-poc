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

import BpmnModeler from 'bpmn-js/lib/Modeler';
import Modeler from "bpmn-js/lib/Modeler";
import {
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule
// @ts-ignore
} from 'bpmn-js-properties-panel';
// @ts-ignore
import customControlsModule from './custom-providers/palette';
// @ts-ignore
import customPropertiesProviderModule from './custom-providers/properties';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent implements AfterContentInit, OnChanges, OnDestroy, OnInit {
  @ViewChild('diagram')
  diagramRef!: ElementRef;
    @ViewChild('properties')
    propertiesRef!: ElementRef;
  @Input()
  url?: string;
  @Output()
  importDone: EventEmitter<any> = new EventEmitter();

  // private bpmnJS: BpmnJS = new BpmnJS();
  // bpmnJS = new BpmnViewer();
  // bpmnJS = new BpmnJS({
  //   additionalModules: [
  //       BpmnPropertiesPanelModule,
  //       BpmnPropertiesProviderModule,
  //     minimapModule,
  //     BpmnColorPickerModule,
  //   ]
  // });

  modelXml = '';
  // bpmnModeler = new BpmnModeler({
  //   keyboard: {bindTo: document},
  // });
  // bpmnViewer = new BpmnViewer();
    bpmnModeler?: Modeler;
    // bpmnJS?: BpmnJS;

  constructor(private http: HttpClient) {
    // const _getPaletteEntries = PaletteProvider.prototype.getPaletteEntries;
    // PaletteProvider.prototype.getPaletteEntries = () => {
    //   console.log("palette");
    //   console.log(this);
    //   return _getPaletteEntries.apply(this);
    // }
    // console.log("bpmnJS: ", this.bpmnJS);
    // @ts-ignore
    // this.bpmnJS.on('import.done', ({error}) => {
    //   if (!error) {
    //     console.log('Fit viewport')
    //     // this.bpmnJS.get('canvas').zoom('fit-viewport')
    //   }
    // });

    // this.getEvents();
    // this.addOverlays();
    // this.getElements();
    // console.log(PaletteProvider.prototype.getPaletteEntries())
    // const _getPaletteEntries = PaletteProvider.prototype.getPaletteEntries;
    // PaletteProvider.prototype.getPaletteEntries = () => {
    //   console.log(this)
    //   let entries = _getPaletteEntries.apply(this);
    //   console.log(entries);
    //   return entries;
    //
    // }
  }

  ngAfterContentInit(): void {
    console.log(this.diagramRef)
    // this.bpmnJS.attachTo(this.diagramRef.nativeElement);
    // this.bpmnModeler.attachTo(this.diagramRef.nativeElement);
    // this.bpmnViewer.attachTo(this.diagramRef.nativeElement);
    // console.log("bpmnJS", this.bpmnJS);
    // console.log("bpmnModeler", this.bpmnModeler);
    // console.log("bpmnViewer", this.bpmnViewer);
    //   console.log(this.bpmnModeler.get('propertiesPanel'))
  }

  ngAfterViewInit(): void {
    console.log("After view init: ", this.diagramRef);
      this.bpmnModeler = new Modeler({
          container: this.diagramRef.nativeElement,
          width: '100%',
          height: '600px',
            additionalModules: [
                BpmnPropertiesPanelModule,
                BpmnPropertiesProviderModule,
              customControlsModule,
                customPropertiesProviderModule,
            ],
          propertiesPanel: {
              parent: this.propertiesRef.nativeElement,
          }
      });
      console.log("Created")
      // this.bpmnJS = new BpmnJS({
      //     container: '#canvas',
      //     propertiesPanel: {
      //         parent: '#properties'
      //     }
      // })
      if (this.url) {
          this.loadUrl(this.url);
      }
      this.getEvents();
      this.getElements();
  }

  ngOnInit(): void {
    console.log(this.diagramRef)

    if (this.url) {
      this.loadUrl(this.url);
    }
    this.getEvents();
    this.getElements();
  }

  ngOnChanges(changes: SimpleChanges) {
    // re-import whenever the url changes
    if (changes['url'] && this.bpmnModeler) {
      this.loadUrl(changes['url'].currentValue);
    }
  }

  ngOnDestroy(): void {
    // this.bpmnJS.destroy();
      this.bpmnModeler?.destroy();
  }

  private getEvents() {
    if (!this.bpmnModeler) {
      return;
    }

    this.bpmnModeler.on('element.changed', (event) => {
      console.log(event)
    })
    this.bpmnModeler.on('element.hover', (event) => {
      // console.log(event)
    })

    // var eventBus = this.bpmnModeler.get('eventBus');

// you may hook into any of the following events
//     var events = [
//       'element.hover',
//       'element.out',
//       'element.click',
//       'element.dblclick',
//       'element.mousedown',
//       'element.mouseup'
//     ];
//
//     events.forEach(function(event) {
//
//       eventBus.on(event, function(e: object) {
//         // e.element = the model element
//         // e.gfx = the graphical element
//
//         // console.log(event, 'on', e);
//       });
//     });
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
