import { AppContext } from "../api";
import { newsletterForm } from "./newsletter-form";
import { characterCard } from "./character-card";
import { redirect } from "./utils";

import {
    CODE,
    INTEGRATION,
    FORUM,
    SERVICES,
} from "@thi.ng/hiccup-carbon-icons";

/**
 * Landing page component.
 *
 * @param ctx injected context object
 */
export function about(ctx: AppContext) {
    redirect();
    return [
        "div",
        [
            "div",
            { class: "flex flex-col flex-grow justify-center p-12" },
            ["div", { class: "flex items-center" }],
            [
                "div",
                { class: "text-sm text-gray-600 leading-relaxed" },
                [
                    "「门修斯」是安东尼·吉登斯（Anthony Giddens）社会学代表作之⼀《⺠族-国家与暴⼒》（The Nation-State and Violence, 1985）某中译本⾥对“孟⼦”英译“Mencius”的回译，因错得极富戏剧性⽽⼴为⼈知，后来便成为了⼀个典故式词汇，专⽤来指代⼈名地名作品名等专有名词的错译。",

                    "笑笑容易，避免错译却并没有想象中的简单。要做到正确⽆误的翻译，译者除了需要拥有良好的外语及⺟语⽔平之外，也必须对所译作品涉及的领域有着相当程度的熟悉，但在资讯的诞⽣不断加速化、资讯的整合愈发跨⽂化跨领域的今天，想达到这⼀点的⻔槛是越来越⾼。仅凭官⽅发布的专有名词翻译规范⼿册，早已⽆法应对每秒都在不断诞⽣着的层出不穷的各语种专有词汇，⽽⽹络上的各种百科，也⼤多仅仅将重点放在词条对象的属性和相关资讯上，并没有为词条本身的译法留下显⽽易⻅的讨论和修正的空间。在这样的⼀个情况下，专有名词的翻译对于译者、作者的⼯作以及读者的理解和交流来说都造成了不⼩的问题，也导致了不少错译和误读⻓期难以得到修正。",

                    "为解决这个问题，我们发起了开源项⽬「⻔修斯⽹」。在这个平台上，⼤家不但可以依据各⾃掌握的客观论据，为各专有名词提出⾃⼰的译法，也可以对他⼈提出的译法给出意⻅和建议。⽽⼤家对某词条提出的各种不同译法，会通过⽤户投票的⽅式排列次序并决定出动态的最优解。⽽后随着⾃定义列表甚⾄是细化到某作品某章节词汇汇总等功能的最终完善，相信本平台不但会对专业译者的⼯作有所帮助，对于编辑、作者等⽂字类⼯作者或读者，甚⾄是外语学习者⽽⾔，也会是⼀个⾮常有参考价值的辅助⼯具。",

                    "⽬前，因⼈⼒及⽹站定位所限，本平台涵盖的词条仅涉及⼈名和书影⾳游戏绘画装置概念等各类作品名，未来是否会对涵盖范围进⾏扩充，还将视具体情况⽽定。",

                    "同时，本⽹站为⾮盈利性开源⽹站，我们相信众⼈的智慧能够孕育出最令⼈意想不到的美好成果，所以在第⼀阶段仅仅完成了⽹站最基本层⾯功能的架构，更进⼀步的优化以及更多功能的增添和完善，还期待着未来⼤家能够共同探讨携⼿完成。",

                    "在这样⼀个全球性反智的⼤⽓候下，就让我们⼀起来做⼀些开放性的、具有⻓远意义的实事，也算是抵抗⼀下荒谬时代的滚滚⻋轮，或是个⼈微不⾜道的焦虑和抑郁吧。",
                ].map((content) => ["p", { class: "mb-4" }, content]),
            ],
            newsletterForm,
        ],
        [
            "div",
            { class: "bg-gray-100 border-t-2" },
            [
                "div",
                { class: "flex flex-wrap" },
                [
                    // attribs: string, keyword: string, description: string, icon: any
                    [
                        "sm:border-r sm:border-b",
                        "开放的数据",
                        "所有的词条以及相关翻译都以开源的形式保存于 Github",
                        CODE,
                    ],
                    [
                        "border-t-2 sm:border-t-0 sm:border-l sm:border-b",
                        "便利的工具",
                        "应对每时每刻不断诞⽣着的层出不穷的各语种专有词汇",
                        SERVICES,
                    ],
                    [
                        "border-t-2 sm:border-r sm:border-t",
                        "互助的社群",
                        "通过⽤户投票的⽅式排列次序并决定出动态的最优翻译",
                        FORUM,
                    ],
                    [
                        "border-t-2 sm:border-l sm:border-t",
                        "大家的探索",
                        "相信众⼈的智慧能够孕育出最令⼈意想不到的美好成果",
                        INTEGRATION,
                    ],
                ].map((content) => [characterCard, ...content]),
            ],
        ],
    ];
}
