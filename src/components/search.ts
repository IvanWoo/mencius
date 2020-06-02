import type { AppContext } from "../api";
import {
    ROUTE_TO_ENTRY,
    SEARCH_ENTRY,
    ROUTE_TO_SEARCH_ENTRY_PAGE,
} from "../events";
import { status } from "./status";
import { eventBtn } from "./event-btn";
import { CARET_LEFT, CARET_RIGHT } from "@thi.ng/hiccup-carbon-icons";

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
        return [
            "div",
            status,
            [
                "div",
                { class: "p-6" },
                ["h2", ctx.ui.newsletterForm.title, `Search results of ${id}:`],
                search.entries
                    ? [
                          "div",
                          { class: "flex flex-col" },
                          [
                              "div",
                              { class: "flex flex-wrap" },
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
                          [
                              "div",
                              {
                                  class:
                                      "flex flex-row px-4 justify-center my-4",
                              },
                              page > 1
                                  ? [
                                        "div",
                                        [
                                            eventBtn,
                                            [
                                                ROUTE_TO_SEARCH_ENTRY_PAGE,
                                                { id, page: page - 1 },
                                            ],
                                            {
                                                class: "block m-1",
                                            },
                                            [
                                                "div",
                                                { class: "h-4 w-4" },
                                                CARET_LEFT,
                                            ],
                                        ],
                                    ]
                                  : [],
                              page < Math.ceil(search.total_count / 30)
                                  ? [
                                        "div",
                                        { class: "pl-2" },
                                        [
                                            eventBtn,
                                            [
                                                ROUTE_TO_SEARCH_ENTRY_PAGE,
                                                { id, page: page + 1 },
                                            ],
                                            {
                                                class: "block m-1",
                                            },
                                            [
                                                "div",
                                                { class: "h-4 w-4" },
                                                CARET_RIGHT,
                                            ],
                                        ],
                                    ]
                                  : [],
                          ],
                      ]
                    : [
                          "div",
                          { class: "md:text-4xl text-xl m-auto p-6" },
                          "no available results",
                      ],
            ],
        ];
    };
}
