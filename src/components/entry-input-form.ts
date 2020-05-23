import type { AppContext } from "../api";
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
 * Entry input form.
 *
 * @param ctx injected context object
 */
export function entryInputForm(
    ctx: AppContext,
    entryType: string,
    setEvent: string,
    wikiEvent: string,
    mainEvent: string
) {
    const views = ctx.views;
    const bus = ctx.bus;

    return () => {
        const entry = views[entryType].deref()!;
        return [
            "div",
            { class: "flex flex-col p-12" },
            [
                "h2",
                ctx.ui.newsletterForm.title,
                entryType === "newEntry" ? "Add new entry" : "Edit entry",
            ],
            entryInputRow(ctx, "原文", "name", setEvent, {
                value: entry.name,
                placeholder: "Mencius",
            }),
            [
                "div",
                {
                    class: "block font-medium text-gray-800 text-lg mb-2",
                },
                "语言",
                [
                    dropdown,
                    {
                        class:
                            "shadow-inner appearance-none border rounded w-full py-2 px-3 bg-gray-200 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:bg-white",
                        onchange: (e: InputEvent) =>
                            bus.dispatch([
                                setEvent,
                                {
                                    key: "language",
                                    value: (<HTMLTextAreaElement>e.target)
                                        .value,
                                },
                            ]),
                    },
                    LANG_OPTS,
                    entry.language,
                ],
            ],
            entryInputRow(ctx, "亦名", "alias", setEvent, {
                value: entry.alias,
                placeholder: "Mengzi",
            }),
            entryInputRow(ctx, "罗马化转写", "romanization", setEvent, {
                value: entry.romanization,
                placeholder: "Mengzi",
            }),
            entryInputRow(ctx, "属性", "category", setEvent, {
                value: entry.category,
                placeholder: "哲学家",
            }),
            entryInputRow(ctx, "作品年份", "date", setEvent, {
                value: entry.date,
                placeholder: "372-289 BC",
            }),
            entryInputRow(ctx, "团体", "group", setEvent, {
                value: entry.group,
            }),
            entryInputRow(ctx, "作者", "author", setEvent, {
                value: entry.author,
            }),
            entryInputRow(ctx, "专辑", "album", setEvent, {
                value: entry.album,
            }),
            entry.wikipedia
                ? [
                      "div",
                      ["div", { class: "block" }, "维基"],
                      [
                          "div",
                          {
                              class: "block font-light text-base text-gray-600",
                          },
                          entry.wikipedia.extract,
                      ],
                  ]
                : [],
            [
                eventBtn,
                [
                    wikiEvent,
                    {
                        titles: entry.name,
                        language: entry.language,
                    },
                ],
                // disable the btn when the name and language is empty
                entry.name && entry.language
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
                [mainEvent, { data: entry }],
                // disable the btn when the name is empty
                entry.name
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
        ];
    };
}
