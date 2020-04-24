import type { AppContext } from "../api";
import { StatusType } from "../api";
import { GET_ENTRY, SET_STATUS } from "../events";
import { opinionCard } from "./opinion-card";
import { metadata } from "./metadata";

/**
 * Single entry detail page. Triggers JSON I/O request on init if entry
 * data has not been loaded yet.
 *
 * @param ctx injected context object
 */
export function entryDetail(ctx: AppContext) {
    const id = decodeURI(ctx.views.route.deref()!.params.id);
    ctx.bus.dispatch(
        ctx.views.entries.deref()![id]
            ? [SET_STATUS, [StatusType.SUCCESS, "loaded from cache", true]]
            : [GET_ENTRY, id]
    );
    return () => {
        const id = decodeURI(ctx.views.route.deref()!.params.id);
        const entry = ctx.views.entries.deref()![id];
        // TODO: 404 / create entry page
        return entry && entry.id
            ? [
                  "div",
                  { class: "flex flex-col" },
                  metadata(entry),
                  entry.opinions.map((x) => opinionCard(x)),
              ]
            : ["div", { class: "text-4xl m-auto p-6" }, "no data..."];
    };
}
