import { AppContext } from "../api";

import { frame } from "./frame";
import { logo } from "./logo";
import { newsletterForm } from "./newsletter-form";
import { characterCard } from "./character-card";

import {
    CODE,
    APP_SERVICES,
    DOLLARS,
    INTEGRATION
} from "@thi.ng/hiccup-carbon-icons";

/**
 * Landing page component.
 *
 * @param ctx injected context object
 */
export function about(ctx: AppContext) {
    return frame(ctx, [
        [
            "div",
            { class: "flex flex-col flex-grow justify-center p-12" },
            ["div", { class: "flex items-center" }],
            [
                "div",
                [
                    "p",
                    { class: "sm:text-xl text-gray-600 mb-2 leading-relaxed" },
                    "「门修斯」是吉登斯的《民族—国家与暴力》一书中译本对孟子英译 Mencius 的回译，因译名极不规范且广为人知。此后「门修斯」就成了一个典故，专门用来指代错误的译名。在中国，许多人名、地名的标准译法并没有建立起来，即便有一部分经辞书、手册加以规范，可在民间却并未获得普遍认同，所以大量不甚习见的译名，只能经过历史的沉淀，由实践本身来过滤。不过，在学术著作的译本中出现大量错误的译名，往往说明译者对原著涉及的领域非常陌生，对相关语境极不了解，因此也很难胜任其翻译工作。"
                ]
            ],
            newsletterForm
        ],
        [
            "div",
            { class: "bg-gray-100 border-t-2" },
            [
                "div",
                { class: "flex flex-wrap" },
                [
                    // attribs: string, keyword: string, description: string, icon: any
                    [
                        "sm:border-r sm:border-b",
                        "开放的数据",
                        "所有的词条以及相关翻译都以开源的形式保存在 Github 上",
                        CODE
                    ],
                    [
                        "border-t-2 sm:border-t-0 sm:border-l sm:border-b",
                        "开放的数据",
                        "所有的词条以及相关翻译都以开源的形式保存在 Github 上",
                        APP_SERVICES
                    ],
                    [
                        "border-t-2 sm:border-r sm:border-t",
                        "开放的数据",
                        "所有的词条以及相关翻译都以开源的形式保存在 Github 上",
                        DOLLARS
                    ],
                    [
                        "border-t-2 sm:border-l sm:border-t",
                        "开放的数据",
                        "所有的词条以及相关翻译都以开源的形式保存在 Github 上",
                        INTEGRATION
                    ]
                ].map(content => [characterCard, ...content])
            ]
        ]
    ]);
}
