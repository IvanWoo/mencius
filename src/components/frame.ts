import { AppContext } from "../api";

/**
 * Basic frame component.
 *
 * @param ctx injected context object
 */
export function frame(_: AppContext, content: any) {
    return [
        "div",
        { class: "flex-grow h-full" },
        [
            "div",
            {
                class: "max-w-5xl mx-auto flex h-full lg:items-center lg:px-8",
            },
            [
                "div",
                {
                    class:
                        "flex-grow bg-white lg:shadow-2xl lg:rounded-lg lg:overflow-hidden h-full lg:h-auto",
                },
                content,
            ],
        ],
    ];
}
