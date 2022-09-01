export default interface Record {
    location: RecordLocation
    metadata: any
    name: string
    registration: string
    status: string
    type: string
}

export interface RecordLocation {
    endpoint: string
}
