import { AppContext } from "../api";
import { ABOUT, CONTACT } from "../routes";
import { TOGGLE_NAV } from "../events";

import { logo } from "./logo";
import { routeLink } from "./route-link";
import { eventBtn } from "./event-btn";
import {
    SEARCH,
    HEADER_HAMBURGER,
    HEADER_CLOSE,
    INFO_OUTLINE,
    CHAT
} from "@thi.ng/hiccup-carbon-icons";
/**
 * Main nav component with hard coded routes.
 *
 * @param ctx injected context object
 */
export function nav(ctx: AppContext) {
    const isNavOpen = ctx.views.isNavOpen.deref();
    const ui = ctx.ui.nav;
    return [
        "nav",
        {
            class: "sm:flex sm:justify-between sm:items-center px-6 py-3"
        },
        [
            "div",
            { class: "flex items-center justify-between px-4 py-3 sm:p-0" },
            logo,
            [
                eventBtn,
                [TOGGLE_NAV],
                { class: "block sm:hidden" },
                [
                    "div",
                    { class: "h-8 w-8 md:h-10 md:w-10 md:-my-1" },
                    isNavOpen ? HEADER_CLOSE : HEADER_HAMBURGER
                ]
            ]
        ],
        [
            "div",
            {
                class: "w-full xl:px-24 px-4 pt-2 pb-6"
            },
            [
                "div",
                { class: "relative" },
                [
                    "input#entry_search",
                    {
                        class:
                            "transition bg-white shadow-md focus:outline-0 border border-transparent placeholder-gray-700 rounded-lg py-2 pr-4 pl-10 block w-full appearance-none leading-normal",
                        placeholder: "搜寻条目 / Search Entries",
                        type: "text"
                    }
                ],
                [
                    "div",
                    {
                        class:
                            "pointer-events-none absolute inset-y-0 left-0 pl-4 flex items-center"
                    },
                    [
                        "div",
                        {
                            class:
                                "fill-current pointer-events-none text-gray-600 w-4 h-4"
                        },
                        SEARCH
                    ]
                ]
            ]
        ],
        [
            "div",
            isNavOpen ? ui.inner.open : ui.inner.close,
            [
                routeLink,
                ABOUT.id,
                null,
                ui.link,
                [
                    "div",
                    {
                        class: "flex flex-row items-center"
                    },
                    ["div", { class: "h-4 w-4 mr-2" }, INFO_OUTLINE],
                    "About"
                ]
            ],
            [
                routeLink,
                CONTACT.id,
                null,
                ui.link,
                [
                    "div",
                    {
                        class: "flex flex-row items-center"
                    },
                    ["div", { class: "h-4 w-4 mr-2" }, CHAT],
                    "Contact"
                ]
            ]
        ]
    ];
}
