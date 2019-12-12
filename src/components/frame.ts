import { AppContext } from "../api";
import { nav } from "./nav";

/**
 * Basic frame component.
 *
 * @param ctx injected context object
 */
export function frame(ctx: AppContext, content: any) {
    return [
        "div",
        nav,
        [
            "div",
            { class: "max-w-5xl mx-auto lg:-mt-16" },
            [
                "div",
                {
                    class:
                        "flex flex-col min-h-screen lg:flex-row lg:items-center lg:p-8"
                },
                [
                    "div",
                    {
                        class:
                            "flex flex-col flex-grow bg-white lg:shadow-2xl lg:rounded-lg lg:overflow-hidden"
                    },
                    content
                ]
            ]
        ]
    ];
}
