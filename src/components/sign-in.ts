import type { AppContext } from "../api";
import { externalLink } from "./external-link";
import { status } from "./status";

const CLIENT_ID = process.env.CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;

/**
 * Sign in page.
 *
 * @param ctx injected context object
 */
export function signIn(ctx: AppContext) {
    return [
        "div",
        status,
        [
            "div",
            { class: "flex flex-col p-12" },
            ["p", ctx.ui.newsletterForm.title, "Mencius"],
            [
                "p",
                [
                    [
                        `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`,
                        "Sign in with GitHub",
                    ],
                ].map((link) => [externalLink, ctx.ui.contact.link, ...link]),
            ],
        ],
    ];
}
