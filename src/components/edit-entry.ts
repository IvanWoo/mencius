import type { AppContext, Entry } from "../api";
import { status } from "./status";
import {
    ROUTE_TO_ENTRY,
    SET_TEMP_ENTRY_TEMPLATE,
    SET_TEMP_ENTRY,
    UPDATE_ENTRY,
    GET_WIKI_TEMP,
} from "../events";
import { entryInputForm } from "./entry-input-form";

/**
 * Edit existing entry page.
 *
 * @param ctx injected context object
 */
export function editEntry(ctx: AppContext) {
    const views = ctx.views;
    const bus = ctx.bus;
    const id = decodeURI(ctx.views.route.deref()!.params.id);
    const data: Entry = views.entries.deref()![id];
    if (!data) {
        return bus.dispatch([ROUTE_TO_ENTRY, id]);
    }
    bus.dispatch([SET_TEMP_ENTRY_TEMPLATE, { data }]);

    return () => {
        const user = views.user.deref()!;
        return [
            "div",
            status,
            user.name
                ? entryInputForm(
                      ctx,
                      "tempEntry",
                      SET_TEMP_ENTRY,
                      GET_WIKI_TEMP,
                      UPDATE_ENTRY
                  )
                : [
                      "div",
                      { class: "flex flex-col p-12" },
                      [
                          "p",
                          ctx.ui.newsletterForm.title,
                          "Please sign in before editing entry...",
                      ],
                  ],
        ];
    };
}
