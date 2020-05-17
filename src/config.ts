import {
    EV_SET_VALUE,
    Event,
    FX_DELAY,
    FX_DISPATCH_ASYNC,
    FX_DISPATCH_NOW,
    valueUpdater,
} from "@thi.ng/interceptors";
import { AppConfig, StatusType } from "./api";
import { about } from "./components/about";
import { contact } from "./components/contact";
// import { search } from "./components/search";
import { entryDetail } from "./components/entry-detail";
import { newEntry } from "./components/new-entry";
import { signIn } from "./components/sign-in";
import { githubOauth } from "./components/github-oauth";
import * as fx from "./effects";
import * as ev from "./events";
import * as routes from "./routes";

const API_HOST = "http://localhost:4200";

// main App configuration
export const CONFIG: AppConfig = {
    // router configuration
    // docs here:
    // https://github.com/thi-ng/umbrella/blob/master/packages/router/src/api.ts#L100
    router: {
        // use URI hash for routes (KISS)
        useFragment: true,
        // route ID if no other matches (MUST be non-parametric!)
        defaultRouteID: routes.ABOUT.id,
        // IMPORTANT: rules with common prefixes MUST be specified in
        // order of highest precision / longest path
        routes: [
            routes.ABOUT,
            routes.CONTACT,
            // routes.SEARCH,
            routes.ENTRY_DETAIL,
            routes.NEW_ENTRY,
            routes.SIGN_IN,
            routes.GITHUB_OAUTH_CB,
        ],
    },

    // event handlers events are queued and batch processed in app's RAF
    // render loop event handlers can be single functions, interceptor
    // objects with `pre`/`post` keys or arrays of either.

    // the event handlers' only task is to transform the event into a
    // number of side effects. event handlers should be pure functions
    // and only side effect functions execute any "real" work.

    // see EventBus docs here:
    // https://github.com/thi-ng/umbrella/blob/master/packages/atom/src/event-bus.ts#L14

    events: {
        // sets status to "done"
        [ev.DONE]: () => ({
            [FX_DISPATCH_NOW]: [ev.SET_STATUS, [StatusType.DONE, "done"]],
        }),

        // sets status to thrown error's message
        [ev.ERROR]: (_, [__, err]) => ({
            [FX_DISPATCH_NOW]:
                err.message === "Unauthorized"
                    ? [
                          [ev.SET_STATUS, [StatusType.ERROR, err.message]],
                          [ev.ROUTE_TO, [routes.SIGN_IN.id, {}]],
                      ]
                    : [ev.SET_STATUS, [StatusType.ERROR, err.message]],
        }),

        // stores status (a tuple of `[type, message, done?]`) in app state
        // if status type != DONE & `done` == true, also triggers delayed EV_DONE
        // Note: we inject the `trace` interceptor to log the event to the console
        [ev.SET_STATUS]: (_, [__, status]) => ({
            [FX_DISPATCH_NOW]: [EV_SET_VALUE, ["status", status]],
            [FX_DISPATCH_ASYNC]:
                status[0] !== StatusType.DONE && status[2]
                    ? [FX_DELAY, [1000], ev.DONE, ev.ERROR]
                    : undefined,
        }),

        [ev.POPUP_WINDOW]: () => ({
            [FX_DISPATCH_NOW]: [fx.POPUP],
        }),

        [ev.TOGGLE_NAV]: valueUpdater<boolean>("isNavOpen", (x) => !x),

        [ev.TOGGLE_ACCOUNT]: valueUpdater<boolean>("accountOpen", (x) => !x),

        [ev.CLOSE_ACCOUNT]: valueUpdater<boolean>("accountOpen", (x) => false),

        // toggles debug state flag on/off
        [ev.TOGGLE_DEBUG]: valueUpdater<boolean>("debug", (x) => !x),

        [ev.SET_INPUT]: [
            (_, [__, input]) => ({
                [FX_DISPATCH_NOW]: [
                    EV_SET_VALUE,
                    ["input", input.toLowerCase()],
                ],
            }),
        ],

        [ev.GET_ENTRY]: (_, [__, id]) => ({
            [FX_DISPATCH_NOW]: [
                [ev.SET_STATUS, [StatusType.INFO, "getting entry data..."]],
            ],
            [FX_DISPATCH_ASYNC]: [fx.GET_ENTRY, id, ev.RECEIVE_ENTRY, ev.ERROR],
        }),

        [ev.RECEIVE_ENTRY]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [EV_SET_VALUE, [["entries", decodeURI(json.id)], json.data]],
                [
                    ev.SET_STATUS,
                    [
                        StatusType.SUCCESS,
                        "entry data successfully loaded",
                        true,
                    ],
                ],
            ],
        }),

        [ev.ROUTE_TO_ENTRY]: (_, [__, id]) => ({
            [FX_DISPATCH_NOW]: [
                [ev.ROUTE_TO, [routes.ENTRY_DETAIL.id, { id }]],
            ],
        }),

        [ev.GET_USER]: () => ({
            [FX_DISPATCH_NOW]: [
                [ev.SET_STATUS, [StatusType.INFO, "getting user data..."]],
            ],
            [FX_DISPATCH_ASYNC]: [fx.GET_USER, null, ev.RECEIVE_USER, ev.ERROR],
        }),

        [ev.RECEIVE_USER]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [EV_SET_VALUE, ["user", json.data]],
                [
                    ev.SET_STATUS,
                    [StatusType.SUCCESS, "user data successfully loaded", true],
                ],
            ],
        }),

        [ev.GET_TOKEN]: (_, [__, code]) => ({
            [FX_DISPATCH_NOW]: [
                [ev.SET_STATUS, [StatusType.INFO, "getting token..."]],
            ],
            [FX_DISPATCH_ASYNC]: [
                fx.GET_TOKEN,
                code,
                ev.RECEIVE_TOKEN,
                ev.ERROR,
            ],
        }),

        [ev.RECEIVE_TOKEN]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [
                    ev.SET_STATUS,
                    [StatusType.SUCCESS, "token successfully loaded", true],
                ],
                // TODO: redirect to sign-in landing page
                [ev.ROUTE_TO, [routes.ABOUT.id, {}]],
                [ev.GET_USER],
            ],
        }),

        [ev.SIGN_OUT]: () => ({
            [FX_DISPATCH_NOW]: [
                [ev.SET_STATUS, [StatusType.INFO, "signing out..."]],
            ],
            [FX_DISPATCH_ASYNC]: [
                fx.SIGN_OUT,
                null,
                ev.SIGN_OUT_SUCCESS,
                ev.ERROR,
            ],
        }),

        [ev.SIGN_OUT_SUCCESS]: () => ({
            [FX_DISPATCH_NOW]: [
                [
                    ev.SET_STATUS,
                    [StatusType.SUCCESS, "signed out successfully", true],
                ],
                // redirect to home page
                [ev.ROUTE_TO, [routes.ABOUT.id, {}]],
                [EV_SET_VALUE, ["user", {}]],
            ],
        }),
    },

    // side effects
    effects: {
        [fx.POPUP]: () => {
            window.open(
                "https://tinyletter.com/nopro-studio",
                "popupwindow",
                "scrollbars=yes, width=800, height=600"
            );
            return true;
        },
        [fx.GET_ENTRY]: (id) =>
            fetch(API_HOST + "/api/v1/entries/" + id, {
                method: "GET",
                headers: [
                    ["Content-Type", "application/json"],
                    ["Content-Type", "text/plain"],
                ],
                credentials: "include",
            }).then((resp) => {
                if (!resp.ok) {
                    throw new Error(resp.statusText);
                }
                return resp.json();
            }),
        [fx.GET_USER]: () =>
            fetch(API_HOST + "/api/v1/user", {
                method: "GET",
                headers: [
                    ["Content-Type", "application/json"],
                    ["Content-Type", "text/plain"],
                ],
                credentials: "include",
            }).then((resp) => {
                if (!resp.ok) {
                    throw new Error(resp.statusText);
                }
                return resp.json();
            }),
        [fx.GET_TOKEN]: (code) =>
            fetch(API_HOST + "/token?code=" + code, {
                method: "GET",
                headers: [
                    ["Content-Type", "application/json"],
                    ["Content-Type", "text/plain"],
                ],
                credentials: "include",
            }).then((resp) => {
                if (!resp.ok) {
                    throw new Error(resp.statusText);
                }
                return resp.json();
            }),
        [fx.SIGN_OUT]: () =>
            // sign-out endpoint on backend
            fetch(API_HOST + "/token", {
                method: "DELETE",
                headers: [
                    ["Content-Type", "application/json"],
                    ["Content-Type", "text/plain"],
                ],
                credentials: "include",
            }).then((resp) => {
                if (!resp.ok) {
                    throw new Error(resp.statusText);
                }
                // document.cookie ="session_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                return resp.json();
            }),
    },

    // mapping route IDs to their respective UI component functions
    // those functions are called automatically by the app's root component
    // base on the currently active route
    components: {
        [routes.ABOUT.id]: about,
        [routes.CONTACT.id]: contact,
        // [routes.SEARCH.id]: search,
        [routes.ENTRY_DETAIL.id]: entryDetail,
        [routes.NEW_ENTRY.id]: newEntry,
        [routes.SIGN_IN.id]: signIn,
        [routes.GITHUB_OAUTH_CB.id]: githubOauth,
    },

    // DOM root element (or ID)
    domRoot: "app",

    // initial app state
    initialState: {
        status: [StatusType.INFO, "running"],
        user: {},
        route: {},
        debug: false,
        isNavOpen: false,
        accountOpen: false,
        input: "",
        entries: {},
    },

    // derived view declarations
    // each key specifies the name of the view and its value
    // the state path or `[path, transformer]`
    // docs here:
    // https://github.com/thi-ng/umbrella/tree/master/packages/atom#derived-views
    views: {
        json: ["", (state) => JSON.stringify(state, null, 2)],
        user: ["user", (user) => user || {}],
        status: "status",
        debug: "debug",
        isNavOpen: "isNavOpen",
        accountOpen: "accountOpen",
        input: "input",
        entries: "entries",
    },

    // component CSS class config using tailwind-css
    // these attribs are being passed to all/most components
    ui: {
        status: {
            [StatusType.DONE]: {
                class: "text-center p-2 bg-yellow-200 text-yellow-700 fadeout",
            },
            [StatusType.INFO]: {
                class: "text-center p-2 bg-yellow-200 text-yellow-700",
            },
            [StatusType.SUCCESS]: {
                class: "text-center p-2 bg-green-200 text-green-700",
            },
            [StatusType.ERROR]: {
                class: "text-center p-2 bg-red-200 text-red-700",
            },
        },
        newsletterForm: {
            title: {
                class:
                    "sm:font-light text-2xl sm:text-3xl md:text-4xl text-gray-900 mt-6",
            },
            form: { class: "w-full" },
            container: {
                class:
                    "flex items-center border-b border-b-2 border-purple-500 py-2",
            },
            input: {
                class:
                    "appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none md:text-xl",
            },
            button: {
                class:
                    "flex-shrink-0 bg-purple-500 hover:bg-purple-700 border-purple-500 hover:border-purple-700 text-sm border-4 text-white py-1 px-2 rounded",
            },
        },
        characterCard: {
            container: {
                class:
                    "flex flex-col px-12 py-10 w-full sm:w-1/2 border-gray-200",
            },
            icon: { class: "h-8 w-8 md:h-10 md:w-10 md:-my-1" },
            body: {
                class: "flex flex-col leading-relaxed ml-4 md:ml-6",
            },
            content: {
                keyword: { class: "font-medium text-gray-800 text-lg" },
                description: {
                    class: "text-gray-600 mt-1 text-sm md:text-base",
                },
            },
        },
        root: { class: "about_bg" },
        debug: {
            container: {
                class: "max-w-xs fixed right-0 mt-40 flex",
            },
            debugToggle: {
                class: "font-bold rotate-270 flex -m-3 focus:outline-none",
            },
            open: {
                class: "bg-gray-200 text-xs p-2 text-gray-800 rounded-lg",
            },
            close: {
                class: "hidden",
            },
        },
        logo: {
            container: {
                class: "sm:px-4 sm:pt-2 sm:pb-6 flex items-center",
            },
            m: { class: "h-10" },
            mxs: { class: "h-10 ml-4" },
        },
        nav: {
            outer: {},
            search: {},
            inner: {
                open: {
                    class:
                        "items-center justify-between px-4 pt-2 pb-6 block sm:block sm:flex",
                },
                close: {
                    class:
                        "items-center justify-between px-4 pt-2 pb-6 hidden sm:block sm:flex",
                },
            },
            title: { class: "black f1 lh-title tc db mb2 mb2-ns" },
            link: {
                class:
                    "mt-1 block px-2 py-1 font-bold rounded hover:bg-gray-100 text-lg sm:mt-0 sm:ml-2",
            },
        },
        contact: {
            link: {
                class:
                    "flex flex-col sm:text-xl text-gray-600 mt-2 leading-relaxed font-bold hover:bg-gray-200 hover:text-gray-900",
            },
        },
    },
};
