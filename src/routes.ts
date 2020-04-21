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
            check: (x) => !/[A-Z]/.test(x),
        },
    },
};
