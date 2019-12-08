import { IObjectOf } from "@thi.ng/api";
import { IView, ViewTransform } from "@thi.ng/atom";
import { EffectDef, EventBus, EventDef } from "@thi.ng/interceptors";
import { HTMLRouterConfig, RouteMatch } from "@thi.ng/router";

// general types defined for the base app

/**
 * Function signature for main app components.
 * I.e. components representing different app states linked to router.
 */
export type AppComponent = (ctx: AppContext, ...args: any[]) => any;

/**
 * Derived view configurations.
 */
export type ViewSpec = string | [string, ViewTransform<any>];

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
    users: IView<IObjectOf<User>>;
    userlist: IView<User[]>;
    status: IView<Status>;
    debug: IView<number>;
    json: IView<string>;
    isNavOpen: IView<boolean>;
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
}

/// demo app related types

export interface User {
    id: number;
    name: string;
    job: string;
    img: string;
    desc: string;
    alias: string;
}

/**
 * Types for status line component
 */
export enum StatusType {
    DONE,
    INFO,
    SUCCESS,
    ERROR
}

export interface Status extends Array<any> {
    [0]: StatusType;
    [1]: string;
}
