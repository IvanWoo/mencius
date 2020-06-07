import type { AppContext, Entry, NotificationMessenger } from "../api";
import { eventBtn } from "./event-btn";
import {
    ROUTE_TO_EDIT_ENTRY,
    CREATE_NOTIFICATION,
    DELETE_NOTIFICATION,
} from "../events";
import {
    withSize,
    EDIT,
    VISIBILITY_ON,
    VISIBILITY_OFF,
} from "@thi.ng/hiccup-carbon-icons";

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
        { class: "flex flex-col justify-center p-8" },
        [
            "div",
            { class: " px-12 md:pl-12" },
            [
                "div",
                [
                    "h3",
                    {
                        class:
                            "sm:font-light text-2xl sm:text-3xl md:text-4xl text-gray-900 mt-2",
                    },
                    `${entry.name} ・ ${entry.consensus_translation}`,
                ],
                // [
                //     "div",
                //     { class: "mv-2 text-base text-gray-700" },
                //     `${entry.date}`,
                // ],
                notification && notification[0] && notification[0].entry_id
                    ? [
                          "div",
                          { class: "flex flex-row" },
                          [
                              eventBtn,
                              [
                                  DELETE_NOTIFICATION,
                                  <NotificationMessenger>{
                                      id,
                                      data: notification[0],
                                  },
                              ],
                              {
                                  class:
                                      "p-2 mb-2 focus:outline-none hover:text-gray-700 border border-purple-300 hover:border-purple-900 font-semibold rounded",
                              },
                              [
                                  "div",
                                  { class: "flex flex-row" },
                                  [
                                      "div",
                                      {
                                          class:
                                              "inline-block w-full fill-current pr-2 self-center",
                                      },
                                      withSize(VISIBILITY_OFF, "20"),
                                  ],
                                  ["div", "unwatch"],
                              ],
                          ],
                      ]
                    : [
                          "div",
                          { class: "flex flex-row" },
                          [
                              eventBtn,
                              [
                                  CREATE_NOTIFICATION,
                                  <NotificationMessenger>{
                                      id,
                                      data: { github_handler: user.login },
                                  },
                              ],
                              {
                                  class:
                                      "p-2 mb-2 focus:outline-none hover:text-gray-700 border border-purple-300 hover:border-purple-900 font-semibold rounded",
                              },
                              [
                                  "div",
                                  { class: "flex flex-row" },
                                  [
                                      "div",
                                      {
                                          class:
                                              "inline-block w-full fill-current pr-2 self-center",
                                      },
                                      withSize(VISIBILITY_ON, "20"),
                                  ],
                                  ["div", "watch"],
                              ],
                          ],
                      ],
            ],
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
                ].map((x) => (x ? [tag, x] : [])),
                [
                    eventBtn,
                    [ROUTE_TO_EDIT_ENTRY, id],
                    {
                        class: "ml-2 focus:outline-none hover:text-gray-700",
                    },
                    [
                        "div",
                        { class: "flex flex-row" },
                        [
                            "div",
                            {
                                class: "inline-block w-full fill-current pr-2",
                            },
                            withSize(EDIT, "20"),
                        ],
                        ["div", "edit"],
                    ],
                ],
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
