export interface LiveInstrumentEvent {
    eventType: LiveInstrumentEventType
    data: string
}

export enum LiveInstrumentEventType {
    BREAKPOINT_ADDED,
    BREAKPOINT_APPLIED,
    BREAKPOINT_HIT,
    BREAKPOINT_REMOVED,

    LOG_ADDED,
    LOG_APPLIED,
    LOG_HIT,
    LOG_REMOVED,

    METER_ADDED,
    METER_APPLIED,
    METER_UPDATED,
    METER_REMOVED,

    SPAN_ADDED,
    SPAN_APPLIED,
    SPAN_REMOVED
}