import type { AppContext } from "../api";
import { GET_TOKEN } from "../events";
import { status } from "./status";

/**
 * Github OAuth callback page.
 *
 * @param ctx injected context object
 */
export function githubOauth(ctx: AppContext) {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    ctx.bus.dispatch([GET_TOKEN, code]);
    return [
        "div",
        status,
        ["div", { class: "text-4xl m-auto p-6" }, "Signing-in with Github..."],
    ];
}
