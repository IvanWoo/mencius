import type { AppContext } from "../api";

/**
 * Status line component
 *
 * @param ctx injected context object
 */
export function status(ctx: AppContext) {
    const [type, msg] = ctx.views.status.deref()!;
    return ["p", ctx.ui.status[type], msg];
}
