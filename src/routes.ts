import { Route } from "@thi.ng/router";

export const ABOUT: Route = {
    id: "about",
    match: ["about"],
};

export const CONTACT: Route = {
    id: "contact",
    match: ["contact"],
};

export const SEARCH: Route = {
    id: "search",
    match: ["search"],
};

export const ENTRY_DETAIL: Route = {
    id: "entry-detail",
    match: ["entry", "?id"],
    validate: {
        id: {
            // make sure the don't contain any uppercase
            coerce: (x) => x.toLowerCase(),
            check: (x) => x.toLowerCase() === x,
        },
    },
};

export const NEW_ENTRY: Route = {
    id: "new-entry",
    match: ["new_entry"],
};

export const SIGN_IN: Route = {
    id: "sign-in",
    match: ["sign_in"],
};

export const GITHUB_OAUTH_CB: Route = {
    id: "github-oauth-cb",
    match: ["github_oauth_cb"],
};
