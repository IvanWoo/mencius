import { AppContext } from "../api";
import { externalLink } from "./external-link";
import ALIPAY from "../assets/alipay.png";

/**
 * Donate page component.
 *
 * @param ctx injected context object
 */
export function donate(ctx: AppContext) {
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
                        "Donate",
                    ],
                ],
            ],
            ["hr", { class: "pb-2" }],
            [
                "section",
                [
                    "div",
                    { class: "flex flex-col items-start px-12" },
                    [
                        "article",
                        { class: "mb-4" },
                        [
                            "h2",
                            { class: "text-2xl md:text-3xl font-bold py-2" },
                            "PayPal",
                        ],
                        [
                            "div",
                            "请点击[",
                            [
                                externalLink,
                                {
                                    class:
                                        "font-bold text-purple-900 hover:bg-purple-900 hover:text-white transition duration-300 ease-in-out border-dotted border-b-2",
                                },
                                "https://www.paypal.me/yifanwu0/5",
                                "付款链接",
                            ],
                            "]",
                        ],
                    ],
                ],
            ],
            [
                "section",
                [
                    "div",
                    { class: "flex flex-col items-start px-12 w-full" },
                    [
                        "article",
                        { class: "mb-8 w-full" },
                        [
                            "h2",
                            { class: "text-2xl md:text-3xl font-bold py-2" },
                            "支付宝",
                        ],
                        [
                            "div",
                            {
                                class:
                                    "flex justify-center content-center w-full",
                            },
                            [
                                "img",
                                {
                                    class:
                                        "rounded-lg shadow-2xl sm:shadow-none",
                                    src: ALIPAY,
                                },
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ];
}
