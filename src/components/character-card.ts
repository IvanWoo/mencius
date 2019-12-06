import { AppContext } from "../api";


/**
 * Character card component.
 *
 * @param ctx injected context object
 */
export function characterCard(ctx: AppContext, attribs: string, keyword: string, description: string, icon: any) {
    return [
        "div",
        { class: ctx.ui.characterCard.container.class + " " + attribs },
        [
            "div",
            { class: "flex flex-grow" },
            ["div", ctx.ui.characterCard.icon, icon],
            [
                "div",
                ctx.ui.characterCard.body,
                ["h2", ctx.ui.characterCard.content.keyword, keyword],
                ["p", ctx.ui.characterCard.content.description, description]
            ]
        ]
    ];
}

