import * as vscode from "vscode";

export interface SourceMarkerConfig {
    host: string
    accessToken: string
}

export function readConfig(config: vscode.WorkspaceConfiguration): SourceMarkerConfig {
    return {
        host: config.get("host")!,
        accessToken: config.get("accessToken")!
    }
}