import type { AppContext, Entry } from "../api";
import { status } from "./status";
import {
    SET_NEW_ENTRY_TEMPLATE,
    SET_NEW_ENTRY,
    GET_WIKI,
    CREATE_ENTRY,
} from "../events";
import { entryInputRow } from "./input-row";
import { eventBtn } from "./event-btn";
import { dropdown, DropDownOption } from "@thi.ng/hdom-components";

const LANG_OPTS: DropDownOption[] = [
    ["en", "英语"],
    ["jp", "日语"],
    ["ko", "韩语"],
    ["fr", "法语"],
    ["de", "德语"],
];

/**
 * Create new entry page.
 *
 * @param ctx injected context object
 */
export function newEntry(ctx: AppContext) {
    const views = ctx.views;
    const bus = ctx.bus;
    const id = decodeURI(views.route.deref()!.params.id);
    const newEntry = views.newEntry.deref()!;
    const data: Entry =
        id === "null" || id === ""
            ? newEntry
            : { ...newEntry, ...{ id, name: id } };
    bus.dispatch([SET_NEW_ENTRY_TEMPLATE, { data }]);

    return () => {
        const user = views.user.deref()!;
        const newEntry = views.newEntry.deref()!;
        return [
            "div",
            status,
            user.name
                ? [
                      "div",
                      { class: "flex flex-col p-12" },
                      ["h2", ctx.ui.newsletterForm.title, "Add new entry"],
                      entryInputRow(ctx, "原文", "name", {
                          value: newEntry.name,
                          placeholder: "Mencius",
                      }),
                      [
                          "div",
                          {
                              class:
                                  "block font-medium text-gray-800 text-lg mb-2",
                          },
                          "语言",
                          [
                              dropdown,
                              {
                                  class:
                                      "shadow-inner appearance-none border rounded w-full py-2 px-3 bg-gray-200 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:bg-white",
                                  onchange: (e: InputEvent) =>
                                      bus.dispatch([
                                          SET_NEW_ENTRY,
                                          {
                                              key: "language",
                                              value: (<HTMLTextAreaElement>(
                                                  e.target
                                              )).value,
                                          },
                                      ]),
                              },
                              LANG_OPTS,
                              "en",
                          ],
                      ],
                      entryInputRow(ctx, "亦名", "alias", {
                          value: newEntry.alias,
                          placeholder: "Mengzi",
                      }),
                      entryInputRow(ctx, "罗马化转写", "romanization", {
                          value: newEntry.romanization,
                          placeholder: "Mengzi",
                      }),
                      entryInputRow(ctx, "属性", "category", {
                          value: newEntry.category,
                          placeholder: "哲学家",
                      }),
                      entryInputRow(ctx, "作品年份", "date", {
                          value: newEntry.date,
                          placeholder: "372-289 BC",
                      }),
                      entryInputRow(ctx, "团体", "group", {
                          value: newEntry.group,
                      }),
                      entryInputRow(ctx, "作者", "author", {
                          value: newEntry.author,
                      }),
                      entryInputRow(ctx, "专辑", "album", {
                          value: newEntry.album,
                      }),
                      newEntry.wikipedia
                          ? [
                                "div",
                                ["div", { class: "block" }, "维基"],
                                [
                                    "div",
                                    {
                                        class:
                                            "block font-light text-base text-gray-600",
                                    },
                                    newEntry.wikipedia.extract,
                                ],
                            ]
                          : [],
                      [
                          eventBtn,
                          [
                              GET_WIKI,
                              {
                                  titles: newEntry.name,
                                  language: newEntry.language,
                              },
                          ],
                          // disable the btn when the name and language is empty
                          newEntry.name && newEntry.language
                              ? {
                                    class:
                                        "block mt-4 transition ease-in-out duration-700",
                                }
                              : {
                                    class:
                                        "block mt-4 transition ease-in-out duration-700 disabled:opacity-50",
                                    disabled: true,
                                },
                          [
                              "div",
                              {
                                  class:
                                      "shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded",
                              },
                              "RETRIEVE FROM WIKIPEDIA",
                          ],
                      ],
                      [
                          eventBtn,
                          [CREATE_ENTRY, { data: newEntry }],
                          // disable the btn when the name is empty
                          newEntry.name
                              ? {
                                    class:
                                        "block mt-4 transition ease-in-out duration-700",
                                }
                              : {
                                    class:
                                        "block mt-4 transition ease-in-out duration-700 disabled:opacity-50",
                                    disabled: true,
                                },
                          [
                              "div",
                              {
                                  class:
                                      "shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded",
                              },
                              "SUBMIT",
                          ],
                      ],
                  ]
                : [
                      "div",
                      { class: "flex flex-col p-12" },
                      [
                          "p",
                          ctx.ui.newsletterForm.title,
                          "Please sign in before adding new entry...",
                      ],
                  ],
        ];
    };
}
