import type { AppContext } from "../api";
import { SET_OPINION } from "../events";

function row(ctx: AppContext, title: string, attribs: any, tag: string) {
    return [
        "div",
        { class: "block font-medium text-gray-800 text-lg mb-2" },
        title,
        [
            tag,
            {
                ...attribs,
                class:
                    "shadow-inner appearance-none border rounded w-full py-2 px-3 bg-gray-200 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:bg-white",
            },
        ],
    ];
}

function inputRow(ctx: AppContext, title: string, attribs: any) {
    return row(ctx, title, attribs, "input");
}

function textareaRow(ctx: AppContext, title: string, attribs: any) {
    return row(ctx, title, attribs, "textarea");
}

export function opinionInputRow(
    ctx: AppContext,
    title: string,
    key: string,
    id: string,
    attribs: any
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
    return inputRow(ctx, title, { ...attribs, oninput: cb });
}

export function opinionTextareaRow(
    ctx: AppContext,
    title: string,
    key: string,
    id: string,
    attribs: any
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
    return textareaRow(ctx, title, { ...attribs, oninput: cb });
}

export function entryInputRow(
    ctx: AppContext,
    title: string,
    key: string,
    setEvent: string,
    attribs: any
) {
    const bus = ctx.bus;
    const cb = (e: InputEvent) => {
        bus.dispatch([
            setEvent,
            { key, value: (<HTMLTextAreaElement>e.target).value },
        ]);
        // update id based on name
        key === "name"
            ? bus.dispatch([
                  setEvent,
                  {
                      key: "id",
                      value: (<HTMLTextAreaElement>(
                          e.target
                      )).value.toLowerCase(),
                  },
              ])
            : null;
    };
    return inputRow(ctx, title, { ...attribs, oninput: cb });
}
