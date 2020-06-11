import { AppContext } from "../api";

interface aq {
    question: string;
    answer: string;
}

const aqs: aq[] = [
    {
        question: "Why I cannot login?",
        answer:
            "We are using cookies to store your JSON Web Token (JWT). If you block third-party cookies, the communications between your browser and our servers will not work properly.",
    },
    {
        question: "Why I cannot search abbreviations?",
        answer:
            "Due to the complexity of searching entries, short keywords and abbreviations, especially with . (dot), sometimes can not be searchable, but you can try the full name or related keywords, such as Dr. Dre for N.W.A, to find the entry.",
    },
];

/**
 * FAQ page component.
 *
 * @param ctx injected context object
 */
export function faq(ctx: AppContext) {
    return [
        "div",
        [
            "div",
            { class: "flex flex-col pt-6 text-gray-800" },
            [
                "header",
                [
                    "div",
                    { class: "px-12 pb-6" },
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
                    { class: "flex flex-col items-center px-12" },
                    aqs.map((x) => [
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
