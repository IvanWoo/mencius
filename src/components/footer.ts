import { AppContext } from "../api";
import { ABOUT, CONTACT, FAQ, DONATE } from "../routes";
import { withSize, M_CHAR, GITHUB } from "./icons";
import { routeLink } from "./route-link";
import { externalLink } from "./external-link";

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
            { class: "flex items-center justify-start px-4 py-3 sm:p-0" },
            ["div", { ...ui.icon }, withSize(M_CHAR, "16px", "16px")],
            [
                externalLink,
                { title: "See our work on GitHub" },
                "https://github.com/noprostudio",
                ["div", { ...ui.icon }, withSize(GITHUB, "16px", "16px")],
            ],
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
