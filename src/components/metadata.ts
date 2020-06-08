import type { AppContext, Entry } from "../api";

function tag(_: AppContext, x: string) {
    return [
        "div",
        [
            "span",
            {
                class:
                    " py-2, bg-purple-200 text-sm sm:text-base text-gray-700 subpixel-antialiased px-1 rounded mr-2",
            },
            `# ${x}`,
        ],
    ];
}

export function metadata(ctx: AppContext, entry: Entry) {
    const id = decodeURI(ctx.views.route.deref()!.params.id);
    const user = ctx.views.user.deref()!;
    const notification = ctx.views.notifications.deref()![id];
    return [
        "div",
        { class: "flex flex-col justify-center px-12 pb-10" },
        [
            "div",
            { class: "ml-4 md:ml-6" },
            [
                "h3",
                {
                    class:
                        "sm:font-light text-xl sm:text-2xl md:text-3xl text-gray-900 mt-2",
                },
                `${entry.name} ・ ${entry.consensus_translation}`,
            ],
            // [
            //     "div",
            //     { class: "mv-2 text-base text-gray-700" },
            //     `${entry.date}`,
            // ],
            [
                "div",
                { class: "flex flex-wrap" },
                [
                    entry.alias,
                    entry.author,
                    entry.category,
                    entry.date,
                    entry.group,
                    entry.language,
                    entry.romanization,
                    entry.album,
                ].map((x) => (x ? [tag, x] : [])),
            ],
            entry.wikipedia.pageid ? wikipedia(entry) : [],
        ],
    ];
}

function wikipedia(entry: Entry) {
    return [
        "div",
        {
            class: " sm:text-xl text-gray-600 mt-3 leading-relaxed",
        },
        ["p", { class: "font-light text-base" }, entry.wikipedia.extract],
        [
            "div",
            {
                class:
                    "pt-2 mt-auto text-lg font-medium inline-flex items-center text-purple-600 hover:text-purple-800",
            },
            [
                "a",
                {
                    href: `https://${entry.language}.wikipedia.org/?curid=${entry.wikipedia.pageid}`,
                    target: "_blank",
                },
                "Surf the Wikipedia 🌊",
            ],
        ],
    ];
}
