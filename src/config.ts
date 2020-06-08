import {
    EV_SET_VALUE,
    EV_UPDATE_VALUE,
    Event,
    FX_DELAY,
    FX_DISPATCH_ASYNC,
    FX_DISPATCH_NOW,
    valueUpdater,
} from "@thi.ng/interceptors";
import type { AppConfig, Opinion, Vote } from "./api";
import { StatusType, ReportType } from "./api";
import { about } from "./components/about";
import { contact } from "./components/contact";
import { search } from "./components/search";
import { entryDetail } from "./components/entry-detail";
import { newEntry } from "./components/new-entry";
import { editEntry } from "./components/edit-entry";
import { signIn } from "./components/sign-in";
import { githubOauth } from "./components/github-oauth";
import * as fx from "./effects";
import * as ev from "./events";
import * as routes from "./routes";

const API_HOST = process.env.API_HOST;

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
            routes.SEARCH,
            routes.ENTRY_DETAIL,
            routes.NEW_ENTRY,
            routes.EDIT_ENTRY,
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
                err.message === "Unauthorized" || err.message === "Bad Request"
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

        [ev.TOGGLE_NAV]: valueUpdater<boolean>("isNavOpen", (x) => !x),

        [ev.TOGGLE_ACCOUNT]: valueUpdater<boolean>("accountOpen", (x) => !x),

        [ev.CLOSE_ACCOUNT]: valueUpdater<boolean>("accountOpen", (x) => false),

        // prettier-ignore
        [ev.TOGGLE_DELETE_OPINION]: valueUpdater<boolean>("deleteOpinionOpen", (x) => !x),
        // prettier-ignore
        [ev.CLOSE_DELETE_OPINION]: valueUpdater<boolean>("deleteOpinionOpen", (x) => false),

        [ev.TOGGLE_REPORT]: valueUpdater<boolean>("reportOpen", (x) => !x),

        [ev.CLOSE_REPORT]: valueUpdater<boolean>("reportOpen", (x) => false),

        [ev.SET_REPORT]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                EV_SET_VALUE,
                [["report", json.key], json.value],
            ],
        }),

        [ev.SET_OPINION_REPORT]: (_, [__, opinion, url]) => ({
            [FX_DISPATCH_NOW]: [
                [ev.TOGGLE_REPORT],
                [ev.SET_REPORT, { key: "type", value: ReportType.OPINION }],
                [ev.SET_REPORT, { key: "context", value: opinion }],
                [ev.SET_REPORT, { key: "url", value: url }],
            ],
        }),

        [ev.CREATE_REPORT]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [ev.SET_STATUS, [StatusType.INFO, "reporting..."]],
            ],
            [FX_DISPATCH_ASYNC]: [
                fx.CREATE_REPORT,
                json,
                ev.CREATE_REPORT_SUCCESS,
                ev.ERROR,
            ],
        }),

        [ev.CREATE_REPORT_SUCCESS]: () => ({
            [FX_DISPATCH_NOW]: [
                [
                    ev.SET_STATUS,
                    [StatusType.SUCCESS, "reported successfully", true],
                ],
                [ev.CLOSE_REPORT],
            ],
        }),

        // toggles debug state flag on/off
        [ev.TOGGLE_DEBUG]: valueUpdater<boolean>("debug", (x) => !x),

        [ev.SET_INPUT]: (_, [__, input]) => ({
            [FX_DISPATCH_NOW]: [EV_SET_VALUE, ["input", input.toLowerCase()]],
        }),

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

        [ev.ROUTE_TO_NEW_ENTRY]: (_, [__, id]) => ({
            [FX_DISPATCH_NOW]: [[ev.ROUTE_TO, [routes.NEW_ENTRY.id, { id }]]],
        }),

        [ev.ROUTE_TO_EDIT_ENTRY]: (_, [__, id]) => ({
            [FX_DISPATCH_NOW]: [[ev.ROUTE_TO, [routes.EDIT_ENTRY.id, { id }]]],
        }),

        [ev.ROUTE_TO_SEARCH_ENTRY]: (_, [__, id, page]) => ({
            [FX_DISPATCH_NOW]: [
                [ev.ROUTE_TO, [routes.SEARCH.id, { id, page }]],
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
                [ev.GET_NEW_NOTIFICATIONS],
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

        [ev.SET_OPINION_TEMPLATE]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                EV_SET_VALUE,
                [["opinions", json.id], json.data],
            ],
        }),

        [ev.SET_OPINION]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                EV_SET_VALUE,
                [["opinions", json.id, json.key], json.value],
            ],
        }),

        [ev.CREATE_OPINION]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [ev.SET_STATUS, [StatusType.INFO, "submitting opinion..."]],
                [ev.APPEND_OPINION, json],
            ],
            [FX_DISPATCH_ASYNC]: [
                fx.CREATE_OPINION,
                json,
                ev.CREATE_OPINION_SUCCESS,
                ev.ERROR,
            ],
        }),

        [ev.CREATE_OPINION_SUCCESS]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [
                    ev.SET_STATUS,
                    [
                        StatusType.SUCCESS,
                        "opinion submitted successfully",
                        true,
                    ],
                ],
                [ev.CREATE_NOTIFICATION, json],
            ],
        }),

        [ev.APPEND_OPINION]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [
                    EV_UPDATE_VALUE,
                    [
                        ["entries", json.id, "opinions"],
                        (x: Opinion[]) => [...x, json.data],
                    ],
                ],
            ],
        }),

        [ev.REMOVE_OPINION]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [
                    EV_UPDATE_VALUE,
                    [
                        ["entries", json.id, "opinions"],
                        (x: Opinion[]) =>
                            x.filter((y: Opinion) => y !== json.data),
                    ],
                ],
            ],
        }),

        [ev.DELETE_OPINION]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [ev.SET_STATUS, [StatusType.INFO, "deleting opinion..."]],
                [ev.REMOVE_OPINION, json],
            ],
            [FX_DISPATCH_ASYNC]: [
                fx.DELETE_OPINION,
                json,
                ev.DELETE_OPINION_SUCCESS,
                ev.ERROR,
            ],
        }),

        [ev.DELETE_OPINION_SUCCESS]: () => ({
            [FX_DISPATCH_NOW]: [
                [
                    ev.SET_STATUS,
                    [StatusType.SUCCESS, "opinion deleted successfully", true],
                ],
                [ev.CLOSE_DELETE_OPINION],
            ],
        }),

        [ev.SET_TEMP_OPINION]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [[EV_SET_VALUE, ["tempOpinion", json.data]]],
        }),

        [ev.EDIT_OPINION]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [ev.SET_TEMP_OPINION, json],
                [ev.SET_OPINION_TEMPLATE, json],
                [ev.REMOVE_OPINION, json],
            ],
        }),

        [ev.CANCEL_EDIT_OPINION]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [ev.APPEND_OPINION, json],
                [ev.SET_OPINION_TEMPLATE, { ...json, data: {} }],
                [ev.SET_TEMP_OPINION, { data: {} }],
            ],
        }),

        [ev.UPDATE_OPINION]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [ev.SET_STATUS, [StatusType.INFO, "updating opinion..."]],
                [ev.APPEND_OPINION, json],
            ],
            [FX_DISPATCH_ASYNC]: [
                fx.UPDATE_OPINION,
                json,
                ev.UPDATE_OPINION_SUCCESS,
                ev.ERROR,
            ],
        }),

        [ev.UPDATE_OPINION_SUCCESS]: () => ({
            [FX_DISPATCH_NOW]: [
                [
                    ev.SET_STATUS,
                    [StatusType.SUCCESS, "opinion updated successfully", true],
                ],
            ],
        }),

        [ev.SET_NEW_ENTRY]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                EV_SET_VALUE,
                [["newEntry", json.key], json.value],
            ],
        }),

        [ev.SET_NEW_ENTRY_TEMPLATE]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [EV_SET_VALUE, ["newEntry", json.data]],
        }),

        // TODO: find way to unify get-wiki
        [ev.GET_WIKI_NEW]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [ev.SET_STATUS, [StatusType.INFO, "getting wikipedia data..."]],
            ],
            [FX_DISPATCH_ASYNC]: [
                fx.GET_WIKI,
                json,
                ev.RECEIVE_WIKI_NEW,
                ev.ERROR,
            ],
        }),

        [ev.RECEIVE_WIKI_NEW]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [EV_SET_VALUE, ["newEntry.wikipedia", json.data]],
                [
                    ev.SET_STATUS,
                    [
                        StatusType.SUCCESS,
                        "wikipedia data successfully loaded",
                        true,
                    ],
                ],
            ],
        }),

        [ev.GET_WIKI_TEMP]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [ev.SET_STATUS, [StatusType.INFO, "getting wikipedia data..."]],
            ],
            [FX_DISPATCH_ASYNC]: [
                fx.GET_WIKI,
                json,
                ev.RECEIVE_WIKI_TEMP,
                ev.ERROR,
            ],
        }),

        [ev.RECEIVE_WIKI_TEMP]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [EV_SET_VALUE, ["tempEntry.wikipedia", json.data]],
                [
                    ev.SET_STATUS,
                    [
                        StatusType.SUCCESS,
                        "wikipedia data successfully loaded",
                        true,
                    ],
                ],
            ],
        }),

        [ev.CREATE_ENTRY]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [ev.SET_STATUS, [StatusType.INFO, "submitting entry..."]],
            ],
            [FX_DISPATCH_ASYNC]: [
                fx.CREATE_ENTRY,
                json,
                ev.CREATE_ENTRY_SUCCESS,
                ev.ERROR,
            ],
        }),

        [ev.CREATE_ENTRY_SUCCESS]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [ev.ROUTE_TO_ENTRY, json.id],
                [
                    ev.SET_STATUS,
                    [StatusType.SUCCESS, "entry submitted successfully", true],
                ],
            ],
        }),

        [ev.UPDATE_ENTRY]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [ev.SET_STATUS, [StatusType.INFO, "updating entry..."]],
            ],
            [FX_DISPATCH_ASYNC]: [
                fx.UPDATE_ENTRY,
                json,
                ev.UPDATE_ENTRY_SUCCESS,
                ev.ERROR,
            ],
        }),

        [ev.UPDATE_ENTRY_SUCCESS]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [EV_SET_VALUE, [["entries", json.id], ""]],
                [ev.ROUTE_TO_ENTRY, json.id],
                [
                    ev.SET_STATUS,
                    [StatusType.SUCCESS, "entry updated successfully", true],
                ],
            ],
        }),

        [ev.SET_TEMP_ENTRY]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                EV_SET_VALUE,
                [["tempEntry", json.key], json.value],
            ],
        }),

        [ev.SET_TEMP_ENTRY_TEMPLATE]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [EV_SET_VALUE, ["tempEntry", json.data]],
        }),

        [ev.SEARCH_ENTRY]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [ev.SET_STATUS, [StatusType.INFO, "searching entries..."]],
            ],
            [FX_DISPATCH_ASYNC]: [
                fx.SEARCH_ENTRY,
                json,
                ev.SEARCH_ENTRY_SUCCESS,
                ev.ERROR,
            ],
        }),

        [ev.SEARCH_ENTRY_SUCCESS]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [EV_SET_VALUE, ["search", json.data]],
                [
                    ev.SET_STATUS,
                    [StatusType.SUCCESS, "searched successfully", true],
                ],
            ],
        }),

        [ev.ROUTE_TO_SEARCH_ENTRY_PAGE]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [ev.SEARCH_ENTRY, json],
                [ev.ROUTE_TO_SEARCH_ENTRY, json.id, json.page],
            ],
        }),

        [ev.GET_VOTE]: (_, [__, id]) => ({
            [FX_DISPATCH_ASYNC]: [fx.GET_VOTE, id, ev.RECEIVE_VOTE, ev.ERROR],
        }),

        [ev.RECEIVE_VOTE]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [
                    EV_SET_VALUE,
                    [["votes", decodeURI(json.id)], json.data ? json.data : []],
                ],
                [
                    ev.SET_STATUS,
                    [StatusType.SUCCESS, "vote data successfully loaded", true],
                ],
            ],
        }),

        [ev.CREATE_VOTE]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [ev.SET_STATUS, [StatusType.INFO, "voting..."]],
            ],
            [FX_DISPATCH_ASYNC]: [
                fx.CREATE_VOTE,
                json,
                ev.CREATE_VOTE_SUCCESS,
                ev.ERROR,
            ],
        }),

        [ev.CREATE_VOTE_SUCCESS]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [
                    ev.SET_STATUS,
                    [StatusType.SUCCESS, "voted successfully", true],
                ],
                [ev.APPEND_VOTE, json],
            ],
        }),

        [ev.DELETE_VOTE]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [ev.SET_STATUS, [StatusType.INFO, "deleting vote..."]],
                [ev.REMOVE_VOTE, json],
            ],
            [FX_DISPATCH_ASYNC]: [
                fx.DELETE_VOTE,
                json,
                ev.DELETE_VOTE_SUCCESS,
                ev.ERROR,
            ],
        }),

        [ev.DELETE_VOTE_SUCCESS]: () => ({
            [FX_DISPATCH_NOW]: [
                [
                    ev.SET_STATUS,
                    [StatusType.SUCCESS, "vote deleted successfully", true],
                ],
            ],
        }),

        [ev.APPEND_VOTE]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [
                    EV_UPDATE_VALUE,
                    [["votes", json.id], (x: Vote[]) => [...x, ...json.data]],
                ],
            ],
        }),

        [ev.REMOVE_VOTE]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [
                    EV_UPDATE_VALUE,
                    [
                        ["votes", json.id],
                        (x: Vote[]) => x.filter((y: Vote) => y !== json.data),
                    ],
                ],
            ],
        }),

        [ev.GET_ENTRY_W_ACTIVITY]: (_, [__, id]) => ({
            [FX_DISPATCH_NOW]: [
                [ev.GET_NOTIFICATION, id],
                [ev.GET_VOTE, id],
                [ev.GET_ENTRY, id],
            ],
        }),

        [ev.GET_NOTIFICATION]: (_, [__, id]) => ({
            [FX_DISPATCH_ASYNC]: [
                fx.GET_NOTIFICATION,
                id,
                ev.RECEIVE_NOTIFICATION,
                ev.ERROR,
            ],
        }),

        [ev.RECEIVE_NOTIFICATION]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [
                    EV_SET_VALUE,
                    [
                        ["notifications", decodeURI(json.id)],
                        json.data[0].entry_id ? json.data : [],
                    ],
                ],
                [
                    ev.SET_STATUS,
                    [
                        StatusType.SUCCESS,
                        "notification successfully loaded",
                        true,
                    ],
                ],
            ],
        }),

        [ev.CREATE_NOTIFICATION]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [ev.SET_STATUS, [StatusType.INFO, "watching the entry..."]],
            ],
            [FX_DISPATCH_ASYNC]: [
                fx.CREATE_NOTIFICATION,
                json,
                ev.CREATE_NOTIFICATION_SUCCESS,
                ev.ERROR,
            ],
        }),

        [ev.CREATE_NOTIFICATION_SUCCESS]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [
                    ev.SET_STATUS,
                    [StatusType.SUCCESS, "watched successfully", true],
                ],
                [ev.APPEND_NOTIFICATION, json],
            ],
        }),

        [ev.DELETE_NOTIFICATION]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [ev.SET_STATUS, [StatusType.INFO, "deleting notification..."]],
                [ev.REMOVE_NOTIFICATION, json],
            ],
            [FX_DISPATCH_ASYNC]: [
                fx.DELETE_NOTIFICATION,
                json,
                ev.DELETE_NOTIFICATION_SUCCESS,
                ev.ERROR,
            ],
        }),

        [ev.DELETE_NOTIFICATION_SUCCESS]: () => ({
            [FX_DISPATCH_NOW]: [
                [
                    ev.SET_STATUS,
                    [
                        StatusType.SUCCESS,
                        "notification deleted successfully",
                        true,
                    ],
                ],
            ],
        }),

        [ev.APPEND_NOTIFICATION]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [
                    EV_UPDATE_VALUE,
                    [
                        ["notifications", json.id],
                        (x: Vote[]) => [...x, ...json.data],
                    ],
                ],
            ],
        }),

        [ev.REMOVE_NOTIFICATION]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [
                    EV_UPDATE_VALUE,
                    [
                        ["notifications", json.id],
                        (x: Vote[]) => x.filter((y: Vote) => y !== json.data),
                    ],
                ],
            ],
        }),

        [ev.GET_NEW_NOTIFICATIONS]: () => ({
            [FX_DISPATCH_ASYNC]: [
                fx.GET_NEW_NOTIFICATIONS,
                null,
                ev.RECEIVE_NEW_NOTIFICATIONS,
                ev.ERROR,
            ],
        }),

        [ev.RECEIVE_NEW_NOTIFICATIONS]: (_, [__, json]) => ({
            [FX_DISPATCH_NOW]: [
                [EV_SET_VALUE, ["newNotifications", json.data]],
                [
                    ev.SET_STATUS,
                    [
                        StatusType.SUCCESS,
                        "new notifications successfully loaded",
                        true,
                    ],
                ],
            ],
        }),
    },

    // side effects
    effects: {
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
        [fx.GET_TOKEN]: (code: string) =>
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
        [fx.CREATE_OPINION]: (json) =>
            fetch(API_HOST + "/api/v1/entries/" + json.id, {
                method: "POST",
                headers: [
                    ["Content-Type", "application/json"],
                    ["Content-Type", "text/plain"],
                ],
                credentials: "include",
                body: JSON.stringify(json.data),
            }).then((resp) => {
                if (!resp.ok) {
                    throw new Error(resp.statusText);
                }
                return resp.json();
            }),
        [fx.DELETE_OPINION]: (json) =>
            fetch(API_HOST + `/api/v1/entries/${json.id}/${json.userName}`, {
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
                return resp.json();
            }),
        [fx.UPDATE_OPINION]: (json) =>
            fetch(API_HOST + `/api/v1/entries/${json.id}/${json.userName}`, {
                method: "PUT",
                headers: [
                    ["Content-Type", "application/json"],
                    ["Content-Type", "text/plain"],
                ],
                credentials: "include",
                body: JSON.stringify(json.data),
            }).then((resp) => {
                if (!resp.ok) {
                    throw new Error(resp.statusText);
                }
                return resp.json();
            }),
        [fx.GET_WIKI]: (json) =>
            fetch(
                API_HOST +
                    `/api/v1/wiki?language=${json.language}&titles=${json.titles}`,
                {
                    method: "GET",
                    headers: [
                        ["Content-Type", "application/json"],
                        ["Content-Type", "text/plain"],
                    ],
                    credentials: "include",
                }
            ).then((resp) => {
                if (!resp.ok) {
                    throw new Error(resp.statusText);
                }
                return resp.json();
            }),
        [fx.GET_ENTRY]: (id: string) =>
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
        [fx.CREATE_ENTRY]: (json) =>
            fetch(API_HOST + "/api/v1/entries", {
                method: "POST",
                headers: [
                    ["Content-Type", "application/json"],
                    ["Content-Type", "text/plain"],
                ],
                credentials: "include",
                body: JSON.stringify(json.data),
            }).then((resp) => {
                if (!resp.ok) {
                    throw new Error(resp.statusText);
                }
                return resp.json();
            }),
        [fx.UPDATE_ENTRY]: (json) =>
            fetch(API_HOST + `/api/v1/entries/${json.id}`, {
                method: "PUT",
                headers: [
                    ["Content-Type", "application/json"],
                    ["Content-Type", "text/plain"],
                ],
                credentials: "include",
                body: JSON.stringify(json.data),
            }).then((resp) => {
                if (!resp.ok) {
                    throw new Error(resp.statusText);
                }
                return resp.json();
            }),
        [fx.SEARCH_ENTRY]: (json) =>
            fetch(
                API_HOST +
                    `/api/v1/search/entry?id=${json.id}&page=${json.page}`,
                {
                    method: "GET",
                    headers: [
                        ["Content-Type", "application/json"],
                        ["Content-Type", "text/plain"],
                    ],
                    credentials: "include",
                }
            ).then((resp) => {
                if (!resp.ok) {
                    throw new Error(resp.statusText);
                }
                return resp.json();
            }),
        [fx.CREATE_REPORT]: (json) =>
            fetch(API_HOST + "/api/v1/report", {
                method: "POST",
                headers: [
                    ["Content-Type", "application/json"],
                    ["Content-Type", "text/plain"],
                ],
                credentials: "include",
                body: JSON.stringify(json.data),
            }).then((resp) => {
                if (!resp.ok) {
                    throw new Error(resp.statusText);
                }
                return resp.json();
            }),
        [fx.GET_VOTE]: (id: string) =>
            fetch(
                API_HOST + `/api/v1/entries/${id}/placeholder/vote/placeholder`,
                {
                    method: "GET",
                    headers: [
                        ["Content-Type", "application/json"],
                        ["Content-Type", "text/plain"],
                    ],
                    credentials: "include",
                }
            ).then((resp) => {
                if (!resp.ok) {
                    throw new Error(resp.statusText);
                }
                return resp.json();
            }),
        [fx.CREATE_VOTE]: (json) =>
            fetch(
                API_HOST +
                    `/api/v1/entries/${json.id}/${json.data.opinion_github_handler}/vote`,
                {
                    method: "POST",
                    headers: [
                        ["Content-Type", "application/json"],
                        ["Content-Type", "text/plain"],
                    ],
                    credentials: "include",
                    body: JSON.stringify(json.data),
                }
            ).then((resp) => {
                if (!resp.ok) {
                    throw new Error(resp.statusText);
                }
                return resp.json();
            }),
        [fx.DELETE_VOTE]: (json) =>
            fetch(
                API_HOST +
                    `/api/v1/entries/${json.id}/${json.data.opinion_github_handler}/vote/${json.voteID}`,
                {
                    method: "DELETE",
                    headers: [
                        ["Content-Type", "application/json"],
                        ["Content-Type", "text/plain"],
                    ],
                    credentials: "include",
                    body: JSON.stringify(json.data),
                }
            ).then((resp) => {
                if (!resp.ok) {
                    throw new Error(resp.statusText);
                }
                return resp.json();
            }),
        [fx.GET_NOTIFICATION]: (id: string) =>
            fetch(API_HOST + `/api/v1/notification/${id}/placeholder`, {
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
        [fx.CREATE_NOTIFICATION]: (json) =>
            fetch(API_HOST + `/api/v1/notification/${json.id}`, {
                method: "POST",
                headers: [
                    ["Content-Type", "application/json"],
                    ["Content-Type", "text/plain"],
                ],
                credentials: "include",
                body: JSON.stringify(json.data),
            }).then((resp) => {
                if (!resp.ok) {
                    throw new Error(resp.statusText);
                }
                return resp.json();
            }),
        [fx.DELETE_NOTIFICATION]: (json) =>
            fetch(
                API_HOST +
                    `/api/v1/notification/${json.id}/${json.data.github_handler}`,
                {
                    method: "DELETE",
                    headers: [
                        ["Content-Type", "application/json"],
                        ["Content-Type", "text/plain"],
                    ],
                    credentials: "include",
                    body: JSON.stringify(json.data),
                }
            ).then((resp) => {
                if (!resp.ok) {
                    throw new Error(resp.statusText);
                }
                return resp.json();
            }),
        [fx.GET_NEW_NOTIFICATIONS]: () =>
            fetch(API_HOST + `/api/v1/notifications`, {
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
    },

    // mapping route IDs to their respective UI component functions
    // those functions are called automatically by the app's root component
    // base on the currently active route
    components: {
        [routes.ABOUT.id]: about,
        [routes.CONTACT.id]: contact,
        [routes.SEARCH.id]: search,
        [routes.ENTRY_DETAIL.id]: entryDetail,
        [routes.NEW_ENTRY.id]: newEntry,
        [routes.EDIT_ENTRY.id]: editEntry,
        [routes.SIGN_IN.id]: signIn,
        [routes.GITHUB_OAUTH_CB.id]: githubOauth,
    },

    // DOM root element (or ID)
    domRoot: "app",

    // initial app state
    initialState: {
        status: [StatusType.INFO, "running"],
        user: {},
        newNotifications: [],
        route: {},
        debug: false,
        isNavOpen: false,
        accountOpen: false,
        deleteOpinionOpen: false,
        reportOpen: false,
        report: {},
        input: "",
        entries: {},
        votes: {},
        notifications: {},
        opinions: {},
        tempOpinion: {},
        newEntry: {
            album: "",
            alias: "",
            author: "",
            category: "",
            consensus_translation: "",
            date: "",
            group: "",
            id: "",
            name: "",
            language: "en",
            romanization: "",
            wikipedia: null,
            opinions: [],
        },
        tempEntry: {},
        search: {},
    },

    // derived view declarations
    // each key specifies the name of the view and its value
    // the state path or `[path, transformer]`
    // docs here:
    // https://github.com/thi-ng/umbrella/tree/master/packages/atom#derived-views
    views: {
        json: ["", (state) => JSON.stringify(state, null, 2)],
        user: ["user", (user) => user || {}],
        newNotifications: "newNotifications",
        status: "status",
        debug: "debug",
        isNavOpen: "isNavOpen",
        accountOpen: "accountOpen",
        deleteOpinionOpen: "deleteOpinionOpen",
        reportOpen: "reportOpen",
        report: "report",
        input: "input",
        entries: "entries",
        votes: "votes",
        notifications: "notifications",
        opinions: "opinions",
        tempOpinion: "tempOpinion",
        newEntry: "newEntry",
        tempEntry: "tempEntry",
        search: "search",
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
                class: "max-w-xs mt-1 flex",
            },
            debugToggle: {
                class: "font-bold rotate-270 flex mt-5 focus:outline-none h-10",
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
