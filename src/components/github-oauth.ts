import type { AppContext } from "../api";
import { GET_TOKEN } from "../events";

/**
 * Github OAuth callback page.
 *
 * @param ctx injected context object
 */
export function githubOauth(ctx: AppContext) {
    // TODO: make the extracting more robust
    const code = window.location.href.split("?code=")[1].split("#/")[0];
    ctx.bus.dispatch([GET_TOKEN, code]);
    return [
        "div",
        { class: "text-4xl m-auto p-6" },
        "Signing-in with Github...",
    ];
}
