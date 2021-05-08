import { AppContext } from "../api";

/**
 * Character card component.
 *
 * @param ctx injected context object
 */
export function characterCard(
    ctx: AppContext,
    attribs: string,
    keyword: string,
    description: string,
    icon: any
) {
    const ui = ctx.ui.characterCard;
    return [
        "div",
        { class: ui.container.class + " " + attribs },
        [
            "div",
            { class: "flex flex-grow" },
            ["div", ui.icon, icon],
            [
                "div",
                ui.body,
                ["h2", ui.content.keyword, keyword],
                ["p", ui.content.description, description],
            ],
        ],
    ];
}
