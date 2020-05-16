import { AppContext } from "../api";
import { TOGGLE_ACCOUNT } from "../events";

import { eventBtn } from "./event-btn";

/**
 * Account dropdown component.
 *
 * @param ctx injected context object
 */
export function accountDropdown(ctx: AppContext) {
    const user = ctx.views.user.deref()!;
    const accountOpen = ctx.views.accountOpen.deref()!;
    return [
        "div",
        { class: "relative" },
        [
            "div",
            {
                class: "flex flex-row items-center relative w-8 mx-2",
            },
            [
                eventBtn,
                [TOGGLE_ACCOUNT],
                {
                    class:
                        "block rounded-full overflow-hidden focus:outline-none",
                },
                [
                    "img",
                    {
                        src: user.avatar_url,
                        alt: user.name,
                    },
                ],
            ],
        ],
        accountOpen
            ? [
                  "div",
                  {
                      class:
                          "absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl",
                  },
                  [
                      "div",
                      { class: "block px-4 text-gray-600" },
                      `Signed in as ${user.login.toLowerCase()}`,
                  ],
                  ["div", { class: "block my-2 border-b bg-grey-400" }],
                  [
                      "div",
                      { class: "block px-4 py-2 text-gray-800" },
                      "Settings",
                  ],
                  ["div", { class: "block px-4 py-2 text-gray-800" }, "Help"],
                  [
                      "div",
                      { class: "block px-4 py-2 text-gray-800" },
                      "Sign out",
                  ],
              ]
            : [],
    ];
}
