import type { AppContext } from "../api";
import { externalLink } from "./external-link";
import { status } from "./status";

const {
    SNOWPACK_PUBLIC_CLIENT_ID,
    SNOWPACK_PUBLIC_REDIRECT_URI,
} = import.meta.env;
const CLIENT_ID = SNOWPACK_PUBLIC_CLIENT_ID;
const REDIRECT_URI = SNOWPACK_PUBLIC_REDIRECT_URI;

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
            { class: "flex flex-col p-6 md:p-12" },
            ["p", ctx.ui.newsletterForm.title, "Mencius"],
            [
                "p",
                [
                    [
                        `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user%20public_repo&redirect_uri=${REDIRECT_URI}`,
                        "Sign in with GitHub",
                    ],
                ].map(link => [externalLink, ctx.ui.contact.link, ...link]),
            ],
        ],
    ];
}
