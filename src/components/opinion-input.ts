import type { AppContext, Opinion, OpinionMessenger } from "../api";
import {
    SET_OPINION_TEMPLATE,
    CREATE_OPINION,
    CANCEL_EDIT_OPINION,
    UPDATE_OPINION,
} from "../events";
import { eventBtn } from "./event-btn";
import { opinionInputRow } from "./input-row";

const isEmpty = (x: any): x is object => Object.keys(x).length === 0;

export function opinionInput(ctx: AppContext) {
    const bus = ctx.bus;
    const views = ctx.views;
    const user = views.user.deref()!;
    const id = decodeURI(views.route.deref()!.params.id);
    const opinions = views.opinions.deref()!;
    const tempOpinion = views.tempOpinion.deref()!;

    if (!opinions[id]) {
        const data: Opinion = {
            github_handler: user.login,
            user_avatar_url: user.avatar_url,
            user_bio: user.bio,
            user_name: user.name,
            translation: "",
            details: "",
        };
        bus.dispatch([SET_OPINION_TEMPLATE, <OpinionMessenger>{ id, data }]);
    }
    return () => {
        const opinion = views.opinions.deref()![id];
        return opinion
            ? [
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
                              class:
                                  "my-3 flex flex-row justify-start items-center",
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
                          opinionInputRow(ctx, "翻译:", "translation", id, {
                              value: opinion.translation,
                              placeholder: id,
                          }),
                          opinionInputRow(ctx, "论据:", "details", id, {
                              value: opinion.details,
                              placeholder: id,
                          }),
                          [
                              eventBtn,
                              isEmpty(tempOpinion)
                                  ? [
                                        CREATE_OPINION,
                                        <OpinionMessenger>{ id, data: opinion },
                                    ]
                                  : [
                                        UPDATE_OPINION,
                                        <OpinionMessenger>{ id, data: opinion },
                                    ],
                              // disable the btn when the translation is empty
                              opinion.translation
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
                                  isEmpty(tempOpinion) ? "CREATE" : "UPDATE",
                              ],
                          ],
                          isEmpty(tempOpinion)
                              ? []
                              : [
                                    eventBtn,
                                    [
                                        CANCEL_EDIT_OPINION,
                                        <OpinionMessenger>{
                                            id,
                                            data: tempOpinion,
                                        },
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
              ]
            : [];
    };
}
