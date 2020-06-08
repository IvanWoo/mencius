import { AppContext, NotificationMessenger } from "../api";
import {
    TOGGLE_NOTIFICATION,
    CLOSE_NOTIFICATION,
    VIEW_NEW_NOTIFICATIONS,
} from "../events";
import { eventBtn } from "./event-btn";
import { HEADER_NOTIFICATION } from "@thi.ng/hiccup-carbon-icons";

/**
 * Notification dropdown component.
 *
 * @param ctx injected context object
 */
export function notificationDropdown(ctx: AppContext) {
    const bus = ctx.bus;
    const notificationOpen = ctx.views.notificationOpen.deref()!;
    return () => {
        let newNotifications = ctx.views.newNotifications.deref()!;
        if (newNotifications !== null) {
            newNotifications = newNotifications.filter(
                (x) => x.status === "new"
            );
        }
        return [
            "div",
            {
                class: "relative",
                // TODO: fix browser compatibility issue, this only works on Chrome...
                onkeydown: (e: KeyboardEvent) => {
                    if (e.key === "Escape" || e.key === "Esc") {
                        bus.dispatch([CLOSE_NOTIFICATION, null]);
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
                    [TOGGLE_NOTIFICATION],
                    {
                        class:
                            "relative z-10 block rounded-full w-6 h-6 focus:outline-none",
                    },
                    [
                        "div",
                        // hacky red dot
                        { class: "relative" },
                        [
                            "div",
                            {
                                class:
                                    newNotifications && newNotifications.length
                                        ? "absolute top-0 right-0 text-xs text-center rounded-full p-1 transition eas-in-out duration-300 bg-red-500 border-2 border-gray-200"
                                        : "absolute top-0 right-0 text-xs text-center rounded-full p-1 transition eas-in-out duration-300 bg-transparent",
                            },
                        ],
                        ["div", HEADER_NOTIFICATION],
                    ],
                ],
                notificationOpen
                    ? [
                          eventBtn,
                          [CLOSE_NOTIFICATION],
                          {
                              tabindex: "-1",
                              class:
                                  "fixed inset-0 h-full w-full cursor-default",
                          },
                      ]
                    : [],
            ],
            notificationOpen
                ? [
                      "div",
                      {
                          class:
                              "absolute z-10 right-0 mt-2 py-2 w-64 bg-white rounded-lg shadow-xl",
                      },
                      [
                          "div",
                          { class: "block px-4 text-gray-600" },
                          "Notifications",
                      ],
                      ["div", { class: "block my-2 border-b bg-grey-400" }],
                      newNotifications && newNotifications.length
                          ? newNotifications.map((x) => [
                                eventBtn,
                                [
                                    VIEW_NEW_NOTIFICATIONS,
                                    <NotificationMessenger>{
                                        id: x.entry_id,
                                        data: { ...x, status: "viewed" },
                                    },
                                ],
                                {
                                    class:
                                        "block px-4 py-2 text-black hover:bg-gray-200 w-full text-left focus:outline-none",
                                },
                                x.entry_id,
                            ])
                          : [
                                "div",
                                {
                                    class:
                                        "block px-4 py-2 text-gray-500 w-full text-center focus:outline-none my-6 items-center",
                                },
                                "no notification",
                            ],
                  ]
                : [],
        ];
    };
}
