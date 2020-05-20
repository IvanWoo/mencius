import type { AppContext } from "../api";
import { StatusType } from "../api";
import { GET_ENTRY, SET_STATUS } from "../events";
import { opinionCard } from "./opinion-card";
import { opinionInput } from "./opinion-input";
import { metadata } from "./metadata";
import { status } from "./status";

/**
 * Single entry detail page. Triggers JSON I/O request on init if entry
 * data has not been loaded yet.
 *
 * @param ctx injected context object
 */
export function entryDetail(ctx: AppContext) {
    const views = ctx.views;
    const bus = ctx.bus;
    const id = decodeURI(ctx.views.route.deref()!.params.id);
    bus.dispatch(
        views.entries.deref()![id]
            ? [SET_STATUS, [StatusType.SUCCESS, "loaded from cache", true]]
            : [GET_ENTRY, id]
    );
    return () => {
        const id = decodeURI(views.route.deref()!.params.id);
        const entry = views.entries.deref()![id];
        const user = views.user.deref()!;
        // TODO: 404 / create entry page
        return [
            "div",
            status,
            entry && entry.id
                ? [
                      "div",
                      { class: "flex flex-col" },
                      metadata(entry),
                      entry.opinions.map((x) => opinionCard(ctx, x)),
                      user.login &&
                      entry.opinions
                          .map((x) => x.github_handler.toLowerCase())
                          .indexOf(user.login.toLowerCase()) < 0
                          ? opinionInput
                          : [],
                  ]
                : [
                      "div",
                      { class: "text-4xl m-auto p-6" },
                      "no available data...",
                  ],
        ];
    };
}
