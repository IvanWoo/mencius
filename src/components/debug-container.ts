import type { AppContext } from "../api";
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
                { class: "flex" },
                ["div", { class: "flex-1 bg-gray-200" }, json],
            ],
        ],
    ];
}
