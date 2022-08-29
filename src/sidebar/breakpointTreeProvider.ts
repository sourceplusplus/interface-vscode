import {
    Breakpoint,
    Event,
    EventEmitter,
    ProviderResult,
    TreeDataProvider,
    TreeItem,
    TreeItemCollapsibleState
} from "vscode";
import SidebarHandler from "./sidebarHandler";
import {LiveVariable} from "../model/breakpointHit";

class BreakpointTreeProvider implements TreeDataProvider<LiveVariable> {
    private _onDidChangeTreeData: EventEmitter<LiveVariable | undefined> = new EventEmitter<LiveVariable | undefined>();

    readonly onDidChangeTreeData: Event<LiveVariable | undefined> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    getChildren(element?: LiveVariable): ProviderResult<LiveVariable[]> {
        if (!element) {
            if (SidebarHandler.viewedBreakpointHit) {
                return SidebarHandler.viewedBreakpointHit.stackTrace.elements[0].variables;
            } else {
                return [];
            }
        }
        return element.value instanceof Array ? element.value : [];
    }

    getTreeItem(element: LiveVariable): TreeItem | Thenable<TreeItem> {
        // TODO: Icons
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

const breakpointTreeProvider = new BreakpointTreeProvider();
export default breakpointTreeProvider;
