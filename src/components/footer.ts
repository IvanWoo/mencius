import { AppContext } from "../api";
import { ABOUT, CONTACT, FAQ, DONATE } from "../routes";
import { m } from "./logo";
import { routeLink } from "./route-link";

/**
 * Main footer component.
 *
 * @param ctx injected context object
 */
export function footer(ctx: AppContext) {
    const ui = ctx.ui.footer;
    return [
        "footer",
        {
            class: "flex flex-row justify-between items-center px-6 py-3",
        },
        [
            "div",
            { class: "flex items-center px-4 py-3 sm:p-0" },
            // ["div", ui.m, m],
            ["div", ui.copyright, `© ${new Date().getFullYear()} Mencius`],
        ],
        [
            "div",
            { class: "flex flex-row" },
            [
                routeLink,
                ABOUT.id,
                null,
                ui.link,
                [
                    "div",
                    {
                        class:
                            "flex flex-row items-center space-x-2 cursor-pointer",
                    },
                    ["div", "About"],
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
                        class:
                            "flex flex-row items-center space-x-2 cursor-pointer",
                    },
                    ["div", "Contact"],
                ],
            ],
            [
                routeLink,
                FAQ.id,
                null,
                ui.link,
                [
                    "div",
                    {
                        class:
                            "flex flex-row items-center space-x-2 cursor-pointer",
                    },
                    ["div", "FAQ"],
                ],
            ],
            [
                routeLink,
                DONATE.id,
                null,
                ui.link,
                [
                    "div",
                    {
                        class:
                            "flex flex-row items-center space-x-2 cursor-pointer",
                    },
                    ["div", "Donate"],
                ],
            ],
        ],
    ];
}
