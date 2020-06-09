import type { AppContext, User, Opinion, Vote, VoteMessenger } from "../api";
import { ActivityType } from "../api";
import { eventBtn } from "./event-btn";
import { CREATE_VOTE, DELETE_VOTE } from "../events";
import {} from "@thi.ng/hiccup-carbon-icons";

const voteSum = (vs: Vote[], op: Opinion, type: string) =>
    vs.filter(
        (x) => x.opinion_github_handler === op.github_handler && x.type === type
    ).length;

const upvoteSum = (vs: Vote[], op: Opinion) =>
    voteSum(vs, op, ActivityType.UPVOTE);

const downvoteSum = (vs: Vote[], op: Opinion) =>
    voteSum(vs, op, ActivityType.DOWNVOTE);

const myVote = (user: User, vs: Vote[], op: Opinion, type: string) =>
    vs.filter(
        (x) =>
            x.opinion_github_handler === op.github_handler &&
            x.type === type &&
            x.github_handler == user.login
    );

const myUpvote = (user: User, vs: Vote[], op: Opinion) =>
    myVote(user, vs, op, ActivityType.UPVOTE);

const myDownvote = (user: User, vs: Vote[], op: Opinion) =>
    myVote(user, vs, op, ActivityType.DOWNVOTE);

function createBtn(
    ctx: AppContext,
    id: string,
    user: User,
    opinion: Opinion,
    type: ActivityType,
    attribs: any,
    content: string
) {
    const voteLock = ctx.views.voteLock.deref()!;
    return [
        eventBtn,
        [
            CREATE_VOTE,
            <VoteMessenger>{
                id,
                data: {
                    entry_id: id,
                    opinion_github_handler: opinion.github_handler,
                    github_handler: user.login,
                    type,
                },
            },
        ],
        {
            class:
                "block transition ease-in-out duration-700 focus:outline-none disabled:opacity-50",
            disabled: voteLock,
        },
        ["div", { ...attribs }, content],
    ];
}

function deleteBtn(
    ctx: AppContext,
    mv: Vote,
    opinion: Opinion,
    attribs: any,
    content: string
) {
    const voteLock = ctx.views.voteLock.deref()!;
    return [
        eventBtn,
        [
            DELETE_VOTE,
            <VoteMessenger>{
                id: mv.entry_id,
                data: mv,
                voteID: mv.id,
            },
        ],
        {
            class:
                "block transition ease-in-out duration-700 focus:outline-none disabled:opacity-50",
            disabled: voteLock,
        },
        ["div", { ...attribs }, content],
    ];
}

export function voteZone(ctx: AppContext, opinion: Opinion) {
    const views = ctx.views;
    const id = decodeURI(ctx.views.route.deref()!.params.id);
    const user = views.user.deref()!;
    const votes = ctx.views.votes.deref()![id];
    return [
        "div",
        votes != undefined
            ? [
                  "div",
                  { class: "flex flex-row items-center mt-4 space-x-2" },
                  myUpvote(user, votes, opinion).length > 0
                      ? [
                            deleteBtn,
                            myUpvote(user, votes, opinion)[0],
                            opinion,
                            {
                                class:
                                    "hover:bg-transparent bg-purple-300 hover:text-purple-700 text-white font-semibold py-2 px-4 border hover:border-purple-500 border-transparent rounded",
                            },
                            "👍 " + upvoteSum(votes, opinion),
                        ]
                      : [
                            createBtn,
                            id,
                            user,
                            opinion,
                            ActivityType.UPVOTE,
                            {
                                class:
                                    "bg-transparent hover:bg-purple-300 text-purple-700 font-semibold hover:text-white py-2 px-4 border border-purple-500 hover:border-transparent rounded",
                            },
                            "👍 " + upvoteSum(votes, opinion),
                        ],
                  myDownvote(user, votes, opinion).length > 0
                      ? [
                            deleteBtn,
                            myDownvote(user, votes, opinion)[0],
                            opinion,
                            {
                                class:
                                    "hover:bg-transparent bg-purple-300 hover:text-purple-700 text-white font-semibold py-2 px-4 border hover:border-purple-500 border-transparent rounded",
                            },
                            "👎 " + downvoteSum(votes, opinion),
                        ]
                      : [
                            createBtn,
                            id,
                            user,
                            opinion,
                            ActivityType.DOWNVOTE,
                            {
                                class:
                                    "bg-transparent hover:bg-purple-300 text-purple-700 font-semibold hover:text-white py-2 px-4 border border-purple-500 hover:border-transparent rounded focus:outline-none",
                            },
                            "👎 " + downvoteSum(votes, opinion),
                        ],
              ]
            : [],
    ];
}
