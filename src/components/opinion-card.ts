import type { Opinion } from "../api";

export function opinionCard(opinion: Opinion) {
    return [
        "div",
        {
            class:
                "flex flex-col px-12 py-10 w-full border-t-2 border-gray-200",
        },
        [
            "div",
            { class: "flex flex-col ml-4 md:ml-6" },
            [
                "div",
                { class: "my-3 flex flex-row justify-start items-center" },
                [
                    "img",
                    {
                        class: "h-8 w-8 md:h-10 md:w-10 rounded-full",
                        src: opinion.user_avatar_url
                            ? opinion.user_avatar_url
                            : "https://subjpop.com/images/sidebar-logo.png",
                    },
                ],
                [
                    "div",
                    { class: "ml-3 flex flex-col" },
                    ["div", { class: "font-semibold" }, opinion.user_name],
                    [
                        "div",
                        { class: "text-gray-700 text-sm" },
                        `@${opinion.github_handler.toLowerCase()}`,
                    ],
                    // [
                    //     "div",
                    //     { class: "text-gray-700 text-sm" },
                    //     opinion.user_bio,
                    // ],
                ],
            ],
            [
                "div",
                { class: "leading-relaxed flex flex-col" },
                [
                    "h2",
                    { class: "font-medium text-gray-800 text-lg" },
                    opinion.translation,
                ],
                [
                    "p",
                    { class: "text-gray-600 mt-1 text-sm md:text-base" },
                    opinion.details,
                ],
            ],
            [
                "div",
                { class: "mt-4" },
                [
                    "button",
                    {
                        class:
                            "bg-transparent hover:bg-purple-300 text-purple-700 font-semibold hover:text-white py-2 px-4 border border-purple-500 hover:border-transparent rounded",
                    },
                    "👍42",
                ],
                [
                    "button",
                    {
                        class:
                            "bg-transparent hover:bg-purple-300 text-purple-700 font-semibold hover:text-white py-2 px-4 border border-purple-500 hover:border-transparent rounded mx-2",
                    },
                    "👎0",
                ],
            ],
        ],
    ];
}
