import { iterator } from "@thi.ng/transducers";
import { parse, TagFactories } from "@thi.ng/hiccup-markdown";

// custom tag factories (passed to parser)
const CUSTOM_TAGS: Partial<TagFactories> = {
    li: (children) => ["li.list-disc.ml-4", ...children],
    blockquote: (xs) => [
        "blockquote.text-purple-600.ml-6.pl-4.border-l-4.border-purple-900",
        ...xs,
    ],
    code: (body) => ["code.bg-gray-200", body],
    codeblock: (lang, body) => [
        "pre.text-xs.bg-purple-100.p-2.overflow-x-scroll",
        { lang: lang || "code" },
        ["code", body],
    ],
    link: (href, body) => [
        "a.font-bold.text-purple-900.hover:bg-purple-900.hover:text-white.transition.duration-300.ease-in-out",
        { href, target: "_blank" },
        body,
    ],
    strike: (body) => ["del.line-through.bg-red-200", body],
    table: (xs) => ["table.table-auto", ["tbody", ...xs]],
    tr: (i, xs) => [i % 2 === 0 ? "tr" : "tr.bg-gray-100", ...xs],
    td: (i, xs) => [i < 1 ? "th.px-4.py-2" : "td.border.px-4.py-2", ...xs],
};

// TODO: fix double new-line hack when https://github.com/thi-ng/umbrella/issues/156 resolve
export function parser(src: string) {
    return [...iterator(parse(CUSTOM_TAGS), src + "\n\n")];
}
