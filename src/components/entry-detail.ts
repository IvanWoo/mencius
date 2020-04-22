import { AppContext, StatusType } from "../api";
import { GET_ENTRY, SET_STATUS } from "../events";

/**
 * Single user profile page. Triggers JSON I/O request on init if user
 * data has not been loaded yet.
 *
 * @param ctx injected context object
 */
export function entryDetail(ctx: AppContext) {
    const id = ctx.views.route.deref()!.params.id;
    ctx.bus.dispatch(
        ctx.views.entries.deref()![id]
            ? [SET_STATUS, [StatusType.SUCCESS, "loaded from cache", true]]
            : [GET_ENTRY, id]
    );
    return [
        "div.flex.flex-col.px-12.py-10.w-full.border-t-2.border-gray-200",
        [
            "div.flex.flex-col.ml-4.md:ml-6",
            [
                "div.my-3.flex.flex-row.justify-start.items-center",
                [
                    "img.h-8.w-8.md:h-10.md:w-10.rounded-full",
                    { src: "https://subjpop.com/images/djs/minami.jpg" },
                ],
                [
                    "div.ml-3.flex.flex-col",
                    ["div.font-semibold", "Minami"],
                    [
                        "div.text-gray-700.text-sm",
                        "ザ・アイドル, My Beauty is for Everyone",
                    ],
                ],
            ],
            [
                "div.leading-relaxed.flex.flex-col",
                ["h2.font-medium.text-gray-800.text-lg", "「探索一族」"],
                [
                    "p.text-gray-600.mt-1.text-sm.md:text-base",
                    "台译很贴切了，就照着用。如果加注释的话可以说一下缘起：最早他们几个人取的乐团名只是一个单词quest。在制作【black is black】这首单曲时，前来造访的朋友提议在quest前面加上a tribe called，正好完美无缺。",
                ],
            ],
            [
                "div.mt-4",
                [
                    "button.bg-transparent.hover:bg-purple-300.text-purple-700.font-semibold.hover:text-white.py-2.px-4.border.border-purple-500.hover:border-transparent.rounded",
                    "👍520",
                ],
                [
                    "button.bg-transparent.hover:bg-purple-300.text-purple-700.font-semibold.hover:text-white.py-2.px-4.border.border-purple-500.hover:border-transparent.rounded",
                    "👎0",
                ],
            ],
        ],
    ];
}
