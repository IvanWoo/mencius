import type { AppContext } from "../api";
import { status } from "./status";

/**
 * Create new entry page.
 *
 * @param ctx injected context object
 */
export function newEntry(ctx: AppContext) {
    const user = ctx.views.user.deref()!;
    return [
        "div",
        status,
        user.name
            ? [
                  "div",
                  { class: "flex flex-col p-12" },
                  ["p", ctx.ui.newsletterForm.title, "Add new entry"],
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
}
