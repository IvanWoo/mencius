import type { AppContext, Opinion, OpinionMessenger } from "../api";
import { eventBtn } from "./event-btn";
import {
    DELETE_OPINION,
    EDIT_OPINION,
    TOGGLE_DELETE_OPINION,
    CLOSE_DELETE_OPINION,
    CLOSE_REPORT,
    SET_REPORT,
    SET_OPINION_REPORT,
    CREATE_REPORT,
} from "../events";
import { withSize, EDIT, DELETE, WARNING } from "@thi.ng/hiccup-carbon-icons";
import { parser } from "./markdown-parser";
import { dropdown, DropDownOption } from "@thi.ng/hdom-components";

const LANG_OPTS: DropDownOption[] = [
    [
        "Unwanted commercial content or spam",
        "Unwanted commercial content or spam",
    ],
    [
        "Pornography or sexually explicit material",
        "Pornography or sexually explicit material",
    ],
    ["Child abuse", "Child abuse"],
    ["Hate speech or graphic violence", "Hate speech or graphic violence"],
    ["Harassment or bullying", "Harassment or bullying"],
];

export function opinionCard(ctx: AppContext, opinion: Opinion) {
    const views = ctx.views;
    const bus = ctx.bus;
    const id = decodeURI(ctx.views.route.deref()!.params.id);
    const user = views.user.deref()!;
    const deleteOpinionOpen = ctx.views.deleteOpinionOpen.deref()!;
    const reportOpen = ctx.views.reportOpen.deref()!;
    const report = ctx.views.report.deref()!;
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
                { class: "my-3 flex flex-row justify-between items-center" },
                [
                    "div",
                    { class: "flex flex-row justify-start items-center" },
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
                // TODO: refactor modal into separate file
                user.login == opinion.github_handler
                    ? [
                          "div",
                          { class: "flex flex-row items-top text-gray-500" },
                          [
                              eventBtn,
                              [
                                  EDIT_OPINION,
                                  <OpinionMessenger>{ id, data: opinion },
                              ],
                              {
                                  class:
                                      "ml-2 focus:outline-none hover:text-gray-700 p-2",
                              },
                              [
                                  "div",
                                  { class: "flex flex-row" },
                                  [
                                      "div",
                                      {
                                          class:
                                              "inline-block w-full fill-current pr-2",
                                      },
                                      withSize(EDIT, "20"),
                                  ],
                                  ["div", "edit"],
                              ],
                          ],
                          // TODO: use modal like report
                          [
                              eventBtn,
                              deleteOpinionOpen
                                  ? [
                                        DELETE_OPINION,
                                        <OpinionMessenger>{
                                            id,
                                            data: opinion,
                                            userName: user.login,
                                        },
                                    ]
                                  : [TOGGLE_DELETE_OPINION],
                              {
                                  class: deleteOpinionOpen
                                      ? "focus:outline-none hover:text-black text-gray-700 bg-red-500 fill-current z-30 p-2"
                                      : "focus:outline-none hover:text-gray-700 fill-current p-2",
                              },
                              [
                                  "div",
                                  { class: "flex flex-row" },
                                  [
                                      "div",
                                      { class: "pr-2" },
                                      withSize(DELETE, "20"),
                                  ],
                                  [
                                      "div",
                                      deleteOpinionOpen ? "confirm?" : "delete",
                                  ],
                              ],
                          ],
                          deleteOpinionOpen
                              ? [
                                    eventBtn,
                                    [CLOSE_DELETE_OPINION],
                                    {
                                        tabindex: "-1",
                                        class:
                                            "fixed inset-0 h-full w-full cursor-default bg-black bg-opacity-50 z-20",
                                    },
                                ]
                              : [],
                      ]
                    : [
                          "div",
                          { class: "flex flex-row items-top text-gray-500" },
                          [
                              eventBtn,
                              [SET_OPINION_REPORT, opinion],
                              {
                                  class:
                                      "ml-2 focus:outline-none hover:text-gray-700 p-2",
                              },
                              [
                                  "div",
                                  { class: "flex flex-row" },
                                  [
                                      "div",
                                      {
                                          class:
                                              "inline-block w-full fill-current pr-2",
                                      },
                                      withSize(WARNING, "20"),
                                  ],
                                  ["div", "report"],
                              ],
                          ],
                          reportOpen
                              ? [
                                    "div",
                                    {
                                        class:
                                            "fixed inset-0 flex items-center justify-center z-30",
                                    },
                                    [
                                        "div",
                                        {
                                            class:
                                                "fixed flex flex-col items-center justify-between mt-2 py-2 md:w-1/3 w-2/4 bg-white rounded-lg shadow-xl z-40",
                                        },
                                        [
                                            "div",
                                            {
                                                class:
                                                    "block font-medium text-gray-800 text-lg p-4 border-b border-b-2 w-full",
                                            },
                                            [
                                                "div",
                                                { class: "mb-2" },
                                                "Report opinion",
                                            ],
                                            [
                                                dropdown,
                                                {
                                                    class:
                                                        "shadow-inner appearance-none border rounded w-full py-2 px-3 bg-gray-200 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:bg-white",
                                                    onchange: (e: InputEvent) =>
                                                        bus.dispatch([
                                                            SET_REPORT,
                                                            {
                                                                key: "reason",
                                                                value: (<
                                                                    HTMLTextAreaElement
                                                                >e.target)
                                                                    .value,
                                                            },
                                                        ]),
                                                },
                                                LANG_OPTS,
                                                report.reason,
                                            ],
                                        ],
                                        [
                                            "div",
                                            {
                                                class: "flex flex-row self-end",
                                            },
                                            [
                                                eventBtn,
                                                [CLOSE_REPORT],
                                                {
                                                    class:
                                                        "block px-4 py-2 text-black text-left",
                                                },
                                                "CANCEL",
                                            ],
                                            [
                                                eventBtn,
                                                [
                                                    CREATE_REPORT,
                                                    { data: report },
                                                ],
                                                {
                                                    class:
                                                        "block px-4 py-2 text-black text-left disabled:opacity-50 transition ease-in-out duration-300",
                                                    disabled: report.reason
                                                        ? false
                                                        : true,
                                                },
                                                "REPORT",
                                            ],
                                        ],
                                    ],
                                    [
                                        eventBtn,
                                        [CLOSE_REPORT],
                                        {
                                            tabindex: "-1",
                                            class:
                                                "fixed inset-0 h-full w-full cursor-default bg-black bg-opacity-50",
                                        },
                                    ],
                                ]
                              : [],
                      ],
            ],
            [
                "div",
                { class: "leading-relaxed flex flex-col" },
                [
                    "h2",
                    { class: "font-bold text-gray-800 text-xl md:text-2xl" },
                    opinion.translation,
                ],
                [
                    "p",
                    { class: "text-gray-700 mt-1 text-sm md:text-base" },
                    parser(opinion.details),
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
