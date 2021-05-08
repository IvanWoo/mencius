import type { AppContext } from "../api";
import type { IObjectOf } from "@thi.ng/api";

interface aq {
    question: string;
    answer: string;
}

const aqs: IObjectOf<aq[]> = {
    en: [
        {
            question: "Why I cannot login?",
            answer:
                "We are using third-party cookies to store your login state, which helps us to verity the communications between your browser and our servers.",
        },
        {
            question: "Why I cannot search abbreviations?",
            answer:
                "Due to the complexity of searching entries, short keywords and abbreviations, especially with . (dot), sometimes can not be searchable, but you can try the full name or related keywords, such as Dr. Dre for N.W.A, to find the entry.",
        },
    ],
    zh: [
        {
            question: "为何无法登陆？",
            answer:
                "Mencius 使用第三方 cookie 来保存并验证用户登陆状态，请在当前页面允许使用第三方 cookie。",
        },
        {
            question: "为何无法检索缩略语？",
            answer:
                "由于检索词条的复杂性，有些时候带有 .（点）的缩略语无法被搜索，但是可以通过搜索全名或者相关信息来找到目标词条：比如用 Dr. Dre 找到 N.W.A。",
        },
    ],
};

/**
 * FAQ page component.
 *
 * @param ctx injected context object
 */
export function faq(_ctx: AppContext) {
    return [
        "div",
        [
            "div",
            { class: "flex flex-col pt-6 text-gray-800" },
            [
                "header",
                [
                    "div",
                    { class: "px-4 md:px-12 pb-6" },
                    [
                        "h1",
                        {
                            class: "text-5xl font-bold text-center",
                        },
                        "FAQ",
                    ],
                    [
                        "h2",
                        {
                            class: "text-2xl font-semibold text-center",
                        },
                        "Answers to common questions about Mencius.",
                    ],
                ],
            ],
            ["hr", { class: "pb-2" }],
            [
                "section",
                [
                    "div",
                    { class: "flex flex-col items-start px-4 md:px-12" },
                    aqs.zh.map(x => [
                        "article",
                        [
                            "h2",
                            { class: "text-2xl md:text-3xl font-bold py-2" },
                            x.question,
                        ],
                        ["p", { class: "font-light pb-8" }, x.answer],
                    ]),
                ],
            ],
        ],
    ];
}
