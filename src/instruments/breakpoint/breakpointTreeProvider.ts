import {ProviderResult, TreeDataProvider, TreeItem, TreeItemCollapsibleState} from "vscode";
import {LiveStackTrace, LiveVariable} from "../liveInstrumentManager";

export default class BreakpointTreeProvider implements TreeDataProvider<LiveVariable> {
    rootVariables?: LiveVariable[];

    constructor(rootVariables: LiveVariable[]) {
        this.rootVariables = rootVariables;
    }

    getChildren(element?: LiveVariable): ProviderResult<LiveVariable[]> {
        if (!element) return this.rootVariables || [];
        return element.value instanceof Array ? element.value : [];
    }

    getTreeItem(element: LiveVariable): TreeItem | Thenable<TreeItem> {
        if (element.value instanceof Array) {
            return {
                label: element.name,
                collapsibleState: TreeItemCollapsibleState.Collapsed
            }
        } else {
            return {
                label: `${element.name} = ${element.value}`,
            }
        }
    }

}
