import type { AppContext } from "../api";
import { GET_TOKEN } from "../events";

/**
 * Github OAuth callback page. Triggers JSON I/O request on init if entry
 * data has not been loaded yet.
 *
 * @param ctx injected context object
 */
export function githubOauth(ctx: AppContext) {
    // TODO: make the extracting more robust
    const code = window.location.href.split("?code=")[1].split("#/")[0];
    ctx.bus.dispatch([GET_TOKEN, code]);
    return () => {
        return [
            "div",
            { class: "text-4xl m-auto p-6" },
            "Signing-in with Github...",
        ];
    };
}
