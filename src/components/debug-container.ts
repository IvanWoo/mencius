import { AppContext } from "../api";
import { TOGGLE_DEBUG } from "../events";
import { eventBtn } from "./event-btn";

/**
 * Collapsible component showing stringified app state.
 *
 * @param ctx injected context object
 * @param debug
 * @param json
 */
export function debugContainer(ctx: AppContext, debug: any, json: string) {
    const ui = ctx.ui.debug;
    return [
        "div#debug",
        ui.container,
        [eventBtn, [TOGGLE_DEBUG], ui.debugToggle, debug ? "close▼" : "open▲"],
        [
            "pre",
            debug ? ui.open : ui.close,
            [
                "div",
                { class: "flex-1 flex overflow-hidden" },
                ["div", { class: "flex-1 overflow-y-scroll" }, json],
            ],
        ],
    ];
}
