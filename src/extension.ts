// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {Uri} from 'vscode';
import {SourceMarker} from "./sourcemarker";
import addBreakpointCommand from "./commands/addBreakpointCommand";
import BreakpointTreeProvider from "./sidebar/breakpointTreeProvider";
import breakpointTreeProvider from "./sidebar/breakpointTreeProvider";

const workspaces = new Map<Uri, SourceMarker>();

export function getSourceMarker(): SourceMarker | undefined {
    let workspaceUri = vscode.workspace.workspaceFile;
    if (!workspaceUri)
        return undefined;

    let sourceMarker = workspaces.get(workspaceUri);
    if (!sourceMarker) {
        sourceMarker = new SourceMarker();
        workspaces.set(workspaceUri, sourceMarker);
    }
    return sourceMarker;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    vscode.workspace.onDidChangeConfiguration((e) => {
        if (!e.affectsConfiguration("sourceplusplus"))
            return;

        getSourceMarker()?.init(vscode.workspace.getConfiguration("sourceplusplus"));
    });

    getSourceMarker()?.init(vscode.workspace.getConfiguration("sourceplusplus"));

    const testCommandId = "sourceplusplus.statusClick";

    let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, -Infinity);
    statusBarItem.command = testCommandId;
    statusBarItem.text = "S++";
    statusBarItem.tooltip = "Click to disable Source++";
    statusBarItem.show();

    vscode.commands.registerCommand(testCommandId, () => {
        let inputBox = vscode.window.createInputBox();
        inputBox.prompt = "test";
        inputBox.show();

        console.log("Status bar pressed!");
    });


    vscode.window.createTreeView("live-breakpoints", {
        treeDataProvider: breakpointTreeProvider
    });


    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "sourceplusplus" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('sourceplusplus.addBreakpoint', addBreakpointCommand);

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
