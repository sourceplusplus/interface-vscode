import {SourceMarker} from "../sourcemarker";
import {LiveInstrumentEvent, LiveInstrumentEventType} from "./liveInstrumentEvent";
import * as vscode from "vscode";
import BreakpointTreeProvider from "./breakpoint/breakpointTreeProvider";
import breakpointTreeProvider from "./breakpoint/breakpointTreeProvider";

export interface BreakpointHitEvent {
    breakpointId: string
    traceId: string
    occurredAt: string
    service: string
    serviceInstance: string
    stackTrace: LiveStackTrace
}

export interface LiveStackTrace {
    exceptionType: string
    message: string
    causedBy?: LiveStackTrace
    elements: LiveStackTraceElement[]
}

export interface LiveStackTraceElement {
    method: string
    source: string
    column?: number
    sourceCode?: string
    variables: LiveVariable[]
}

export interface LiveVariable {
    name: string
    value: string | number | LiveVariable[]
    lineNumber: number
    scope: string
    liveClazz: string
    liveIdentity: string
    presentation?: string
}

export default class LiveInstrumentManager {
    sourceMarker: SourceMarker

    constructor(sourceMarker: SourceMarker) {
        this.sourceMarker = sourceMarker;
    }

    async start() {
        let developer = "system";
        // TODO: this.sourceMarker.config.serviceToken

        this.sourceMarker.eventBusRegisterHandler(`spp.service.live-instrument.subscriber:${developer}`, (err, message) => {
            let body = message.body;
            body.eventType = LiveInstrumentEventType[body.eventType];
            let liveEvent: LiveInstrumentEvent = body;
            this.sourceMarker.log(`Received instrument event. Type: ${LiveInstrumentEventType[liveEvent.eventType]}`);

            switch (liveEvent.eventType) {
                case LiveInstrumentEventType.LOG_HIT:
                    this.handleLogHitEvent(liveEvent);
                    break;
                case LiveInstrumentEventType.BREAKPOINT_HIT:
                    this.handleBreakpointHitEvent(liveEvent);
                    break;
                case LiveInstrumentEventType.BREAKPOINT_ADDED:
                    this.handleBreakpointAddedEvent(liveEvent);
                    break;
                case LiveInstrumentEventType.BREAKPOINT_REMOVED:
                    this.handleInstrumentRemovedEvent(liveEvent);
                    break;
                case LiveInstrumentEventType.LOG_ADDED:
                    this.handleLogAddedEvent(liveEvent);
                    break;
                case LiveInstrumentEventType.LOG_REMOVED:
                    this.handleInstrumentRemovedEvent(liveEvent);
                    break;
                default:
                    this.sourceMarker.log(`Un-implemented event type: ${LiveInstrumentEventType[liveEvent.eventType]}`);
            }
        });
    }

    handleLogHitEvent(liveEvent: LiveInstrumentEvent) {
        this.sourceMarker.log(`Log hit event. Data: ${liveEvent.data}`);
    }

    handleBreakpointHitEvent(liveEvent: LiveInstrumentEvent) {
        let hitEvent: BreakpointHitEvent = JSON.parse(liveEvent.data);

        vscode.window.createTreeView("live-breakpoints", {
            treeDataProvider: new BreakpointTreeProvider(hitEvent.stackTrace.elements[0].variables)
        });
    }

    handleBreakpointAddedEvent(liveEvent: LiveInstrumentEvent) {
        this.sourceMarker.log(`Breakpoint added event. Data: ${liveEvent.data}`);
    }

    handleLogAddedEvent(liveEvent: LiveInstrumentEvent) {
        this.sourceMarker.log(`Log added event. Data: ${liveEvent.data}`);
    }

    handleInstrumentRemovedEvent(liveEvent: LiveInstrumentEvent) {
        this.sourceMarker.log(`Instrument removed event. Data: ${liveEvent.data}`);
    }
}