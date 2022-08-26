import * as vscode from "vscode";

export default async function addBreakpointCommand() {
    console.log("addBreakpointCommand");

    let input = vscode.window.createInputBox();
    input.prompt = "Breakpoint Condition";
    await new Promise<void>(resolve => {
        input.onDidAccept(resolve);
        input.show();
    });
    let condition = input.value;

    input.value = "1";
    input.prompt = "Hit Limit";
    await new Promise<void>(resolve => {
        input.onDidAccept(() => {
            let value = parseInt(input.value);
            if (isNaN(value) || value < 1) {
                vscode.window.showErrorMessage("Hit Limit must be a positive integer");
                return;
            }
            resolve();
        });
        input.show();
    });
    let hitLimit = parseInt(input.value);
    input.dispose();

    vscode.window.showInformationMessage(`Breakpoint added with condition: ${condition} and hit limit: ${hitLimit}`);
}

