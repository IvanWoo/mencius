import {
    EV_SET_VALUE,
    Event,
    FX_DELAY,
    FX_DISPATCH_ASYNC,
    FX_DISPATCH_NOW,
    valueUpdater
} from "@thi.ng/interceptors";
import { AppConfig, StatusType } from "./api";
import { about } from "./components/about";
import * as fx from "./effects";
import * as ev from "./events";
import * as routes from "./routes";

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
            routes.ABOUT
        ]
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
        [ev.POPUP_WINDOW]: () => ({
            [FX_DISPATCH_NOW]: [fx.POPUP]
        }),
    },

    // side effects
    effects: {
        [fx.POPUP]: () => {
            window.open(
                'https://tinyletter.com/nopro-studio', 'popupwindow', 'scrollbars=yes, width=800, height=600'
            );
            return true
        }
    },

    // mapping route IDs to their respective UI component functions
    // those functions are called automatically by the app's root component
    // base on the currently active route
    components: {
        [routes.ABOUT.id]: about
    },

    // DOM root element (or ID)
    domRoot: "app",

    // initial app state
    initialState: {
        status: [StatusType.INFO, "running"],
        users: {},
        userlist: [],
        route: {},
        debug: 1
    },

    // derived view declarations
    // each key specifies the name of the view and its value
    // the state path or `[path, transformer]`
    // docs here:
    // https://github.com/thi-ng/umbrella/tree/master/packages/atom#derived-views
    views: {
        json: ["", (state) => JSON.stringify(state, null, 2)],
        users: ["users", (users) => users || {}],
        userlist: "userlist",
        status: "status",
        debug: "debug"
    },

    // component CSS class config using tailwind-css
    // these attribs are being passed to all/most components
    ui: {
        newsletterForm: {
            root: { class: "md:pl-16 pl-0" },
            title: { class: "sm:font-light text-2xl sm:text-3xl md:text-4xl text-gray-900 mt-6" },
            form: { class: "w-full" },
            container: { class: "flex items-center border-b border-b-2 border-purple-500 py-2" },
            input: { class: "appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" },
            button: { class: "flex-shrink-0 bg-purple-500 hover:bg-purple-700 border-purple-500 hover:border-purple-700 text-sm border-4 text-white py-1 px-2 rounded" }
        },
        characterCard: {
            container: { class: "flex flex-col px-12 py-10 w-full sm:w-1/2 border-gray-200" },
            icon: { class: "h-8 w-8 md:h-10 md:w-10 md:-my-1" },
            body: { class: "flex flex-col leading-relaxed ml-4 md:ml-6" },
            content: {
                keyword: { class: "font-medium text-gray-800 text-lg" },
                description: { class: "text-gray-600 mt-1 text-sm md:text-base" }
            }
        },
        root: { class: "relative bg-gray-200" },
        logo: {
            container: { class: "flex items-center" },

        }
    }
};
