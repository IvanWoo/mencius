import type { Event } from "@thi.ng/interceptors";
import type { AppContext } from "../api";

/**
 * Customizable button component emitting given event on app's event
 * bus when clicked.
 *
 * @param ctx injected context object
 * @param event event tuple of `[event-id, payload]`
 * @param attribs element attribs
 * @param body link body
 */
export function eventBtn(
    ctx: AppContext,
    event: Event,
    attribs: any,
    body: any
) {
    return [
        "button",
        {
            ...attribs,
            onclick: (e: any) => {
                e.preventDefault();
                ctx.bus.dispatch(event);
            },
        },
        body,
    ];
}
