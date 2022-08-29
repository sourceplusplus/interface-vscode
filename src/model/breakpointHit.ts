export default interface BreakpointHit {
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