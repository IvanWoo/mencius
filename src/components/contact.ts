import { AppContext } from "../api";
import { externalLink } from "./external-link";

/**
 * Contact page component.
 *
 * @param ctx injected context object
 */
export function contact(ctx: AppContext) {
    return [
        "div",
        { class: "flex flex-col p-6 md:p-12" },
        ["p", ctx.ui.newsletterForm.title, "Get in touch!"],
        [
            "p",
            [
                ["mailto:townb.production@gmail.com", "Email"],
                ["https://github.com/noprostudio", "GitHub"],
                // ["/", "Twitter"],
                // ["/", "Weibo"],
                // ["/", "Medium"],
            ].map((link) => [externalLink, ctx.ui.contact.link, ...link]),
        ],
    ];
}
