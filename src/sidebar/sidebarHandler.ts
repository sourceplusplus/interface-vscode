import BreakpointHit from "../model/breakpointHit";
import breakpointTreeProvider from "./breakpointTreeProvider";

namespace SidebarHandler {
    export let viewedBreakpointHit: BreakpointHit | undefined;

    export function setViewedBreakpointHit(breakpointHit: BreakpointHit) {
        viewedBreakpointHit = breakpointHit;
        breakpointTreeProvider.refresh();
    }
}

export default SidebarHandler;
