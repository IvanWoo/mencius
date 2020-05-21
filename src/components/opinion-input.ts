import type { AppContext, Opinion, OpinionMessenger } from "../api";
import {
    SET_OPINION_TEMPLATE,
    SET_OPINION,
    CREATE_OPINION,
    CANCEL_EDIT_OPINION,
    UPDATE_OPINION,
} from "../events";
import { eventBtn } from "./event-btn";

const isEmpty = (x: any): x is object => Object.keys(x).length === 0;

export function opinionInput(ctx: AppContext) {
    const bus = ctx.bus;
    const views = ctx.views;
    const user = views.user.deref()!;
    const id = decodeURI(views.route.deref()!.params.id);
    const opinions = views.opinions.deref()!;
    const tempOpinion = views.tempOpinion.deref()!;

    let data: Opinion;

    if (!opinions[id]) {
        data = {
            github_handler: user.login,
            user_avatar_url: user.avatar_url,
            user_bio: user.bio,
            user_name: user.name,
            translation: "",
            details: "",
        };
        bus.dispatch([SET_OPINION_TEMPLATE, <OpinionMessenger>{ id, data }]);
    } else {
        data = opinions[id];
    }
    return () => [
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
                {
                    class: "my-3 flex flex-row justify-start items-center",
                },
                [
                    "img",
                    {
                        class: "h-8 w-8 md:h-10 md:w-10 rounded-full",
                        src: user.avatar_url,
                    },
                ],
                [
                    "div",
                    { class: "ml-3 flex flex-col" },
                    ["div", { class: "font-semibold" }, user.name],
                    [
                        "div",
                        { class: "text-gray-700 text-sm" },
                        `@${user.login.toLowerCase()}`,
                    ],
                    // ["div", { class: "text-gray-700 text-sm" }, "user.bio"],
                ],
            ],
            [
                "div",
                { class: "leading-relaxed flex flex-col" },
                [
                    "div",
                    { class: "block font-medium text-gray-800 text-lg mb-2" },
                    "翻译:",
                    [
                        "input",
                        {
                            class:
                                "shadow-inner appearance-none border rounded w-full py-2 px-3 bg-gray-200 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:bg-white",
                            value: data.translation,
                            oninput: (e: InputEvent) =>
                                bus.dispatch([
                                    SET_OPINION,
                                    {
                                        id,
                                        key: "translation",
                                        value: (<HTMLTextAreaElement>e.target)
                                            .value,
                                    },
                                ]),
                        },
                    ],
                ],
                [
                    "div",
                    { class: "block font-medium text-gray-800 text-lg mb-2" },
                    "论据:",
                    [
                        "input",
                        {
                            class:
                                "shadow-inner appearance-none border rounded w-full py-2 px-3 bg-gray-200 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:bg-white",
                            value: data.details,
                            oninput: (e: InputEvent) =>
                                bus.dispatch([
                                    SET_OPINION,
                                    {
                                        id,
                                        key: "details",
                                        value: (<HTMLTextAreaElement>e.target)
                                            .value,
                                    },
                                ]),
                        },
                    ],
                ],
                [
                    eventBtn,
                    isEmpty(tempOpinion)
                        ? [CREATE_OPINION, <OpinionMessenger>{ id, data }]
                        : [UPDATE_OPINION, <OpinionMessenger>{ id, data }],
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
                isEmpty(tempOpinion)
                    ? []
                    : [
                          eventBtn,
                          [
                              CANCEL_EDIT_OPINION,
                              <OpinionMessenger>{ id, data: tempOpinion },
                          ],
                          { class: "block mt-4" },
                          [
                              "div",
                              {
                                  class:
                                      "shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded",
                              },
                              "CANCEL",
                          ],
                      ],
            ],
        ],
    ];
}
