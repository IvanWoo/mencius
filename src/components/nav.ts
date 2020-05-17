import { AppContext, StatusType } from "../api";
import { ABOUT, CONTACT, SIGN_IN, NEW_ENTRY } from "../routes";
import { TOGGLE_NAV } from "../events";

import { logo } from "./logo";
import { routeLink } from "./route-link";
import { eventBtn } from "./event-btn";
import { searchBar } from "./search-bar";
import { accountDropdown } from "./account-dropdown";
import {
    HEADER_HAMBURGER,
    ADD_OUTLINE,
    HEADER_CLOSE,
    INFO_OUTLINE,
    CHAT,
    USER,
} from "@thi.ng/hiccup-carbon-icons";

/**
 * Main nav component with hard coded routes.
 *
 * @param ctx injected context object
 */
export function nav(ctx: AppContext) {
    const isNavOpen = ctx.views.isNavOpen.deref()!;
    const user = ctx.views.user.deref()!;
    const ui = ctx.ui.nav;
    return [
        "nav",
        {
            class: "sm:flex sm:justify-between sm:items-center px-6 py-3",
        },
        [
            "div",
            { class: "flex items-center justify-between px-4 py-3 sm:p-0" },
            logo,
            [
                "div",
                { class: "flex items-center justify-end" },
                [
                    eventBtn,
                    [TOGGLE_NAV],
                    { class: "block sm:hidden" },
                    [
                        "div",
                        { class: "h-8 w-8 md:h-10 md:w-10 md:-my-1" },
                        isNavOpen ? HEADER_CLOSE : HEADER_HAMBURGER,
                    ],
                ],
                user.name !== undefined
                    ? [
                          "div",
                          { class: "block sm:hidden z-10" },
                          accountDropdown,
                      ]
                    : [],
            ],
        ],
        searchBar,
        [
            "div",
            isNavOpen ? ui.inner.open : ui.inner.close,
            [
                routeLink,
                NEW_ENTRY.id,
                null,
                ui.link,
                [
                    "div",
                    {
                        class: "flex flex-row items-center",
                    },
                    ["div", { class: "h-4 w-4 mr-2" }, ADD_OUTLINE],
                    "New",
                ],
            ],
            [
                routeLink,
                ABOUT.id,
                null,
                ui.link,
                [
                    "div",
                    {
                        class: "flex flex-row items-center",
                    },
                    ["div", { class: "h-4 w-4 mr-2" }, INFO_OUTLINE],
                    "About",
                ],
            ],
            [
                routeLink,
                CONTACT.id,
                null,
                ui.link,
                [
                    "div",
                    {
                        class: "flex flex-row items-center",
                    },
                    ["div", { class: "h-4 w-4 mr-2" }, CHAT],
                    "Contact",
                ],
            ],
            user.name === undefined
                ? [
                      routeLink,
                      SIGN_IN.id,
                      null,
                      ui.link,
                      [
                          "div",
                          {
                              class: "flex flex-row items-center",
                          },
                          ["div", { class: "h-4 w-4 mr-2" }, USER],
                          // TODO: figure out why "sign in" will break the ui
                          "Sign_in",
                      ],
                  ]
                : ["div", { class: "hidden sm:block" }, accountDropdown],
        ],
    ];
}
