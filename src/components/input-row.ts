import type { AppContext } from "../api";
import { SET_OPINION, SET_NEW_ENTRY } from "../events";

function inputRow(
    ctx: AppContext,
    title: string,
    value: any,
    placeholder: string,
    cb: any
) {
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
                placeholder,
                oninput: cb,
            },
        ],
    ];
}

export function opinionInputRow(
    ctx: AppContext,
    title: string,
    value: any,
    placeholder: string,
    key: string,
    id: string
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
    return inputRow(ctx, title, value, placeholder, cb);
}

export function entryInputRow(
    ctx: AppContext,
    title: string,
    value: any,
    placeholder: string,
    key: string
) {
    const bus = ctx.bus;
    const cb = (e: InputEvent) => {
        bus.dispatch([
            SET_NEW_ENTRY,
            { key, value: (<HTMLTextAreaElement>e.target).value },
        ]);
        // update id based on name
        key === "name"
            ? bus.dispatch([
                  SET_NEW_ENTRY,
                  {
                      key: "id",
                      value: (<HTMLTextAreaElement>(
                          e.target
                      )).value.toLowerCase(),
                  },
              ])
            : null;
    };
    return inputRow(ctx, title, value, placeholder, cb);
}
