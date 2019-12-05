import { AppContext } from "../api";
import { POPUP_WINDOW } from "../events";


/**
 * Newsletter form component.
 *
 * @param ctx injected context object
 */
export function newsletterForm(ctx: AppContext) {
    return [
        "div",
        ctx.ui.newsletterForm.root,
        ["h1", ctx.ui.newsletterForm.title, "加入 Newsletter 获取项目最新进展"],
        [
            "form", {
                ...ctx.ui.newsletterForm.form,
                action: "https://tinyletter.com/nopro-studio",
                method: "post",
                target: "popupwindow",
                onsubmit: () => ctx.bus.dispatch([POPUP_WINDOW])
            },
            [
                "div", ctx.ui.newsletterForm.container,
                ["input", { ...ctx.ui.newsletterForm.input, type: "text", placeholder: "you.are.awesome@email.com", name: "email", id: "tlemail" }],
                ["input", { ...ctx.ui.newsletterForm.button, type: "submit", value: "GET UPDATES" }]
            ]
        ]
    ];
}
