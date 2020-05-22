import type { AppContext, Entry } from "../api";
import { status } from "./status";
import { SET_NEW_ENTRY_TEMPLATE, SET_NEW_ENTRY, GET_WIKI } from "../events";
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
    const newEntry = views.newEntry.deref()!;

    if (!newEntry.name) {
        const data: Entry = {
            album: "",
            alias: "",
            author: "",
            category: "",
            consensus_translation: "",
            date: "",
            group: "",
            id: "",
            name: "",
            language: "en",
            romanization: "",
            wikipedia: null,
            opinions: [],
        };
        bus.dispatch([SET_NEW_ENTRY_TEMPLATE, { data }]);
    }
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
                      entryInputRow(
                          ctx,
                          "原文",
                          newEntry.name,
                          "Mencius",
                          "name"
                      ),
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
                      entryInputRow(
                          ctx,
                          "亦名",
                          newEntry.alias,
                          "Mengzi",
                          "alias"
                      ),
                      entryInputRow(
                          ctx,
                          "罗马化转写",
                          newEntry.romanization,
                          "Mencius",
                          "romanization"
                      ),
                      entryInputRow(
                          ctx,
                          "属性",
                          newEntry.category,
                          "哲学家",
                          "category"
                      ),
                      entryInputRow(
                          ctx,
                          "作品年份",
                          newEntry.date,
                          "372-289 BC",
                          "date"
                      ),
                      entryInputRow(ctx, "团体", newEntry.group, "", "group"),
                      entryInputRow(ctx, "作者", newEntry.author, "", "author"),
                      entryInputRow(ctx, "专辑", newEntry.album, "", "album"),
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
                      newEntry.name && newEntry.language
                          ? [
                                eventBtn,
                                [
                                    GET_WIKI,
                                    {
                                        titles: newEntry.name,
                                        language: newEntry.language,
                                    },
                                ],
                                { class: "block mt-4" },
                                [
                                    "div",
                                    {
                                        class:
                                            "shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded",
                                    },
                                    "RETRIEVE FROM WIKIPEDIA",
                                ],
                            ]
                          : [],
                      [
                          eventBtn,
                          [],
                          { class: "block mt-4" },
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
