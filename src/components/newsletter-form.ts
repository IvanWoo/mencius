import type { AppContext } from "../api";

/**
 * Newsletter form component.
 *
 * @param ctx injected context object
 */
export function newsletterForm(ctx: AppContext) {
    const ui = ctx.ui.newsletterForm;
    return [
        "div",
        ui.root,
        ["h1", ui.title, "加入 Newsletter 获取项目最新进展"],
        [
            "form",
            {
                ...ui.form,
                action: "https://tinyletter.com/nopro-studio",
                method: "post",
                target: "popupwindow",
            },
            [
                "div",
                ui.container,
                [
                    "input",
                    {
                        ...ui.input,
                        type: "email",
                        placeholder: "email address",
                        name: "email",
                        id: "tlemail",
                    },
                ],
                ["input", { ...ui.button, type: "submit", value: "SUBSCRIBE" }],
            ],
        ],
    ];
}
