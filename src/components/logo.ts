import type { AppContext } from "../api";
import { withSize, M_CHAR, MENCIUS } from "./icons";

/**
 * Logo component.
 *
 * @param ctx injected context object
 */
export function logo(ctx: AppContext) {
    const ui = ctx.ui.logo;
    return [
        "div",
        ui.container,
        ["div", { ...ui.m }, withSize(M_CHAR, "40px", "40px")],
        ["div", { ...ui.mxs }, withSize(MENCIUS, "200px", "40px")],
    ];
}
