import { AppContext } from "../api";
import { ABOUT, CONTACT } from "../routes";
import { TOGGLE_NAV } from "../events";

import { logo } from "./logo";
import { routeLink } from "./route-link";
import { eventBtn } from "./event-btn";
import {
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
            class:
                "bg-gray-00 sm:flex sm:justify-between sm:items-center px-6 py-3"
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
