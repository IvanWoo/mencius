import { AppContext } from "../api";
import { TOGGLE_ACCOUNT, CLOSE_ACCOUNT, SIGN_OUT } from "../events";
import { ABOUT } from "../routes";
import { eventBtn } from "./event-btn";
import { routeLink } from "./route-link";

/**
 * Account dropdown component.
 *
 * @param ctx injected context object
 */
export function accountDropdown(ctx: AppContext) {
    const bus = ctx.bus;
    const user = ctx.views.user.deref()!;
    const accountOpen = ctx.views.accountOpen.deref()!;
    return [
        "div",
        {
            class: "relative",
            // TODO: fix browser compatibility issue, this only works on Chrome...
            onkeydown: (e: KeyboardEvent) => {
                if (e.key === "Escape" || e.key === "Esc") {
                    bus.dispatch([CLOSE_ACCOUNT, null]);
                }
            },
        },
        [
            "div",
            {
                class: "flex flex-row items-center relative w-8 mx-2",
            },
            [
                eventBtn,
                [TOGGLE_ACCOUNT],
                {
                    class:
                        "relative z-10 block rounded-full overflow-hidden focus:outline-none",
                },
                [
                    "img",
                    {
                        src: user.avatar_url,
                        alt: user.login,
                    },
                ],
            ],
            accountOpen
                ? [
                      eventBtn,
                      [CLOSE_ACCOUNT],
                      {
                          tabindex: "-1",
                          class: "fixed inset-0 h-full w-full cursor-default",
                      },
                  ]
                : [],
        ],
        accountOpen
            ? [
                  "div",
                  {
                      class:
                          "absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl",
                  },
                  [
                      "div",
                      { class: "block px-4 text-gray-600" },
                      `Signed in as ${user.login.toLowerCase()}`,
                  ],
                  ["div", { class: "block my-2 border-b bg-grey-400" }],
                  // TODO: add settings
                  //   [
                  //       routeLink,
                  //       ABOUT.id,
                  //       null,
                  //       {
                  //           class: "block px-4 py-2 text-black hover:bg-gray-200",
                  //       },
                  //       "Settings",
                  //   ],
                  // TODO: add help
                  //   [
                  //       routeLink,
                  //       ABOUT.id,
                  //       null,
                  //       {
                  //           class: "block px-4 py-2 text-black hover:bg-gray-200",
                  //       },
                  //       "Help",
                  //   ],
                  [
                      eventBtn,
                      [SIGN_OUT],
                      {
                          class:
                              "block px-4 py-2 text-black hover:bg-gray-200 w-full text-left",
                      },
                      "Sign out",
                  ],
              ]
            : [],
    ];
}
