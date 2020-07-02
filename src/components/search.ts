import type { AppContext } from "../api";
import {
    ROUTE_TO_ENTRY,
    SEARCH_ENTRY,
    ROUTE_TO_SEARCH_ENTRY_PAGE,
} from "../events";
import { status } from "./status";
import { eventBtn } from "./event-btn";
import { CHEVRON_LEFT, CHEVRON_RIGHT } from "@thi.ng/hiccup-carbon-icons";

function nav(ctx: AppContext, attribs: any) {
    const views = ctx.views;
    const id = decodeURI(views.route.deref()!.params.id);
    const page = +views.route.deref()!.params.page;
    const search = views.search.deref()!;
    return [
        "div",
        { ...attribs },
        [
            "div",
            [
                eventBtn,
                [ROUTE_TO_SEARCH_ENTRY_PAGE, { id, page: page - 1 }],
                page > 1
                    ? {
                          class: "block m-1",
                      }
                    : {
                          class: "block m-1 disabled:opacity-50",
                          disabled: true,
                      },
                [
                    "div",
                    {
                        class: "flex flex-row items-center text-justify",
                    },
                    [
                        "div",
                        {
                            class:
                                "w-2 object-fill object-center items-baseline m-2 fill-current",
                        },
                        CHEVRON_LEFT,
                    ],
                    "Prev",
                ],
            ],
        ],
        [
            "div",
            { class: "pl-2" },
            [
                eventBtn,
                [ROUTE_TO_SEARCH_ENTRY_PAGE, { id, page: page + 1 }],
                page < Math.ceil(search.total_count / 30)
                    ? {
                          class: "block m-1",
                      }
                    : {
                          class: "block m-1 disabled:opacity-50",
                          disabled: true,
                      },
                [
                    "div",
                    {
                        class: "flex flex-row items-center text-justify",
                    },
                    "Next",
                    [
                        "div",
                        {
                            class:
                                "w-2 object-fill object-center items-baseline m-2 fill-current",
                        },
                        CHEVRON_RIGHT,
                    ],
                ],
            ],
        ],
    ];
}

/**
 * Search page.
 *
 * @param ctx injected context object
 */
export function search(ctx: AppContext) {
    const views = ctx.views;
    const bus = ctx.bus;
    const id = decodeURI(ctx.views.route.deref()!.params.id);
    const page = decodeURI(ctx.views.route.deref()!.params.page);
    bus.dispatch([SEARCH_ENTRY, { id, page }]);
    return () => {
        const id = decodeURI(ctx.views.route.deref()!.params.id);
        const page = +ctx.views.route.deref()!.params.page;
        const search = views.search.deref()!;
        const user = views.user.deref()!;
        return [
            "div",
            status,
            user.login
                ? [
                      "div",
                      { class: "p-6" },
                      [
                          "h2",
                          ctx.ui.newsletterForm.title,
                          `Search results for `,
                          ["span", { class: "font-bold" }, id],
                      ],
                      ["hr"],
                      search.entries
                          ? [
                                "div",
                                {
                                    class:
                                        "flex flex-col text-gray-600 font-light",
                                },
                                [
                                    "div",
                                    {
                                        class:
                                            "flex flex-row justify-between my-2 align-middle items-center",
                                    },
                                    [
                                        "span",
                                        "Showing ",
                                        search.total_count > 30
                                            ? [
                                                  "span",
                                                  [
                                                      "span",
                                                      {
                                                          class:
                                                              "text-black font-normal",
                                                      },
                                                      `${
                                                          (page - 1) * 30 + 1
                                                      }-${Math.min(
                                                          page * 30,
                                                          search.total_count
                                                      )} `,
                                                  ],
                                                  "of ",
                                              ]
                                            : ["span", "all "],
                                        [
                                            "span",
                                            { class: "text-black font-normal" },
                                            search.total_count + " ",
                                        ],
                                        "entries",
                                    ],
                                    search.total_count > 30
                                        ? nav(ctx, {
                                              class: "flex flex-row",
                                          })
                                        : [],
                                ],
                                [
                                    "div",
                                    {
                                        class: "flex flex-wrap",
                                    },
                                    search.entries.map((x) => [
                                        "div",
                                        [
                                            eventBtn,
                                            [ROUTE_TO_ENTRY, x],
                                            {
                                                class: "block m-1",
                                            },
                                            [
                                                "div",
                                                {
                                                    class:
                                                        "shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded",
                                                },
                                                x,
                                            ],
                                        ],
                                    ]),
                                ],
                                search.total_count > 30
                                    ? nav(ctx, {
                                          class:
                                              "flex flex-row px-4 justify-center my-4",
                                      })
                                    : [],
                            ]
                          : [
                                "div",
                                { class: "md:text-4xl text-xl m-auto p-6" },
                                "no available results",
                            ],
                  ]
                : [
                      "div",
                      { class: "flex flex-col p-6 md:p-12" },
                      [
                          "p",
                          ctx.ui.newsletterForm.title,
                          "Please sign in before searching any entries...",
                      ],
                  ],
        ];
    };
}
