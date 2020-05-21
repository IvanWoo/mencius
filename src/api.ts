import { EffectDef, EventBus, EventDef } from "@thi.ng/interceptors";
import type { Fn, IObjectOf, Path } from "@thi.ng/api";
import type { IView } from "@thi.ng/atom";
import type { HTMLRouterConfig, RouteMatch } from "@thi.ng/router";

// general types defined for the base app

/**
 * Function signature for main app components.
 * I.e. components representing different app states linked to router.
 */
export type AppComponent = (ctx: AppContext, ...args: any[]) => any;

/**
 * Derived view configurations.
 */
export type ViewSpec = string | Path | [string | Path, Fn<any, any>];

/**
 * Structure of the overall application config object.
 * See `src/config.ts`.
 */
export interface AppConfig {
    components: IObjectOf<AppComponent>;
    domRoot: string | Element;
    effects: IObjectOf<EffectDef>;
    events: IObjectOf<EventDef>;
    initialState: any;
    router: HTMLRouterConfig;
    ui: UIAttribs;
    views: Partial<Record<keyof AppViews, ViewSpec>>;
}

/**
 * Derived views exposed by the app.
 * Add more declarations here as needed.
 */
export interface AppViews extends Record<keyof AppViews, IView<any>> {
    route: IView<RouteMatch>;
    routeComponent: IView<any>;
    user: IView<User>;
    status: IView<Status>;
    debug: IView<boolean>;
    json: IView<string>;
    isNavOpen: IView<boolean>;
    accountOpen: IView<boolean>;
    input: IView<string>;
    entries: IView<IObjectOf<Entry>>;
    opinions: IView<IObjectOf<Opinion>>;
    tempOpinion: IView<IObjectOf<Opinion>>;
}

export interface AppContext {
    bus: EventBus;
    views: AppViews;
    ui: UIAttribs;
}

/**
 * Helper interface to pre-declare all possible keys for UI attributes
 * and so enable autocomplete & type safety.
 *
 * See `AppConfig` above and its use in `src/config.ts` and various
 * component functions.
 */
export interface UIAttribs {
    newsletterForm: any;
    characterCard: any;
    root: any;
    logo: any;
    nav: any;
    contact: any;
    debug: any;
    status: any;
}

/// app related types
export interface EntryResponse {
    success: boolean;
    error: string;
    data: Entry;
}

export interface Entry {
    album: string;
    alias: string;
    author: string;
    category: string;
    consensus_translation: string;
    date: string;
    group: string;
    id: string;
    name: string;
    language: string;
    wikipedia: Wikipedia | null;
    opinions?: Opinion[] | null;
}

export interface Wikipedia {
    pageid: number;
    ns: number;
    title: string;
    extract: string;
}

export interface Opinion {
    details: string;
    github_handler: string;
    translation: string;
    user_name: string;
    user_bio: string;
    user_avatar_url: string;
}

export interface User {
    login: string;
    avatar_url: string;
    url: string;
    html_url: string;
    type: string;
    name: string;
    company: string;
    blog: string;
    location: string;
    email: string;
    bio?: any;
    created_at: string;
    updated_at: string;
}

/**
 * Types for opinion related events payload
 */
export interface OpinionMessenger {
    id: string;
    data: Opinion | IObjectOf<Opinion>;
    userName?: string;
}

/**
 * Types for status line component
 */
export enum StatusType {
    DONE,
    INFO,
    SUCCESS,
    ERROR,
}

export interface Status extends Array<any> {
    [0]: StatusType;
    [1]: string;
}
