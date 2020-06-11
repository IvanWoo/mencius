import type { AppContext, Entry } from "../api";
import { status } from "./status";
import {
    SET_NEW_ENTRY_TEMPLATE,
    SET_NEW_ENTRY,
    CREATE_ENTRY,
    GET_WIKI_NEW,
} from "../events";
import { entryInputForm } from "./entry-input-form";

/**
 * Create new entry page.
 *
 * @param ctx injected context object
 */
export function newEntry(ctx: AppContext) {
    const views = ctx.views;
    const bus = ctx.bus;
    const id = decodeURI(views.route.deref()!.params.id);
    const newEntry = views.newEntry.deref()!;
    const data: Entry =
        id === "null" || id === ""
            ? newEntry
            : { ...newEntry, ...{ id, name: id } };
    bus.dispatch([SET_NEW_ENTRY_TEMPLATE, { data }]);

    return () => {
        const user = views.user.deref()!;
        return [
            "div",
            status,
            user.login
                ? [
                      entryInputForm,
                      "newEntry",
                      SET_NEW_ENTRY,
                      GET_WIKI_NEW,
                      CREATE_ENTRY,
                  ]
                : [
                      "div",
                      { class: "flex flex-col p-12" },
                      [
                          "p",
                          ctx.ui.newsletterForm.title,
                          "Please sign in before adding new entry...",
                      ],
                  ],
        ];
    };
}
