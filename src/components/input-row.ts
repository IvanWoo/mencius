import type { AppContext } from "../api";
import { SET_OPINION } from "../events";

function inputRow(ctx: AppContext, title: string, value: any, cb: any) {
    return [
        "div",
        { class: "block font-medium text-gray-800 text-lg mb-2" },
        title,
        [
            "input",
            {
                class:
                    "shadow-inner appearance-none border rounded w-full py-2 px-3 bg-gray-200 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:bg-white",
                value,
                oninput: cb,
            },
        ],
    ];
}

export function opinionInputRow(
    ctx: AppContext,
    title: string,
    value: any,
    id: string,
    key: string
) {
    const bus = ctx.bus;
    const cb = (e: InputEvent) =>
        bus.dispatch([
            SET_OPINION,
            {
                id,
                key,
                value: (<HTMLTextAreaElement>e.target).value,
            },
        ]);
    return inputRow(ctx, title, value, cb);
}
