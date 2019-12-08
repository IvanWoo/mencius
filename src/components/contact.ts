import { AppContext } from "../api";
import { frame } from "./frame";
import { externalLink } from "./external-link";

/**
 * Contact page component.
 *
 * @param ctx injected context object
 */
export function contact(ctx: AppContext) {
    return frame(ctx, [
        "div",
        { class: "flex flex-col p-12" },
        ["p", ctx.ui.newsletterForm.title, "Get in touch!"],
        [
            "p",
            [
                ["https://github.com/IvanWoo/mencius", "GitHub"],
                ["/", "Twitter"],
                ["/", "Weibo"],
                ["/", "Medium"]
            ].map(link => [externalLink, ctx.ui.contact.link, ...link])
        ]
    ]);
}
