import { AppContext, StatusType } from "../api";
import { SET_INPUT, GET_ENTRY, SET_STATUS, ROUTE_TO_ENTRY } from "../events";

import { SEARCH } from "@thi.ng/hiccup-carbon-icons";

export function searchBar(ctx: AppContext) {
    const bus = ctx.bus;
    const input = ctx.views.input.deref()!;
    const entries = ctx.views.entries.deref()!;
    return [
        "div",
        {
            class: "w-full xl:px-24 px-4 pt-2 pb-6",
        },
        [
            "div",
            { class: "relative" },
            [
                "input",
                {
                    id: "entry_search",
                    class:
                        "transition bg-white shadow-md focus:outline-0 border border-transparent placeholder-gray-700 rounded-lg py-2 pr-4 pl-10 block w-full appearance-none leading-normal",
                    placeholder: "搜寻条目 / Search Entries",
                    type: "text",
                    oninput: (e) => {
                        bus.dispatch([SET_INPUT, e.target.value]);
                    },
                    onkeyup: (e) => {
                        if (e.key === "Enter") {
                            bus.dispatch(
                                entries[input]
                                    ? [
                                          SET_STATUS,
                                          [
                                              StatusType.SUCCESS,
                                              "loaded from cache",
                                              true,
                                          ],
                                      ]
                                    : [GET_ENTRY, input]
                            );
                            bus.dispatch([ROUTE_TO_ENTRY, input]);
                        }
                    },
                },
            ],
            [
                "div",
                {
                    class:
                        "pointer-events-none absolute inset-y-0 left-0 pl-4 flex items-center",
                },
                [
                    "div",
                    {
                        class:
                            "fill-current pointer-events-none text-gray-600 w-4 h-4",
                    },
                    SEARCH,
                ],
            ],
        ],
    ];
}
