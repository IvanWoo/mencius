import type { AppContext, Vote } from "../api";
import { StatusType, ActivityType } from "../api";
import {
    GET_ENTRY_W_ACTIVITY,
    SET_STATUS,
    ROUTE_TO_NEW_ENTRY,
} from "../events";
import { opinionCard } from "./opinion-card";
import { opinionInput } from "./opinion-input";
import { metadata } from "./metadata";
import { status } from "./status";
import { eventBtn } from "./event-btn";
import { entryHeader } from "./entry-header";
import { transduce, comp, map, add, filter } from "@thi.ng/transducers";

const getVoteSum = (ogh: string, votes: Vote[]) =>
    transduce(
        comp(
            filter((x: Vote) => x.opinion_github_handle === ogh),
            map((x) => (x.type === ActivityType.UPVOTE ? 1 : -1))
        ),
        add(0),
        votes
    );

/**
 * Single entry detail page. Triggers JSON I/O request on init if entry
 * data has not been loaded yet.
 *
 * @param ctx injected context object
 */
export function entryDetail(ctx: AppContext) {
    const views = ctx.views;
    const bus = ctx.bus;
    const id = decodeURI(ctx.views.route.deref()!.params.id);
    bus.dispatch(
        views.entries.deref()![id]
            ? [SET_STATUS, [StatusType.SUCCESS, "loaded from cache", true]]
            : [GET_ENTRY_W_ACTIVITY, id]
    );
    return () => {
        const id = decodeURI(views.route.deref()!.params.id);
        const entry = views.entries.deref()![id];
        const votes = views.votes.deref()![id];
        const sortByVotes = (a, b) =>
            getVoteSum(b.github_handle, votes) -
            getVoteSum(a.github_handle, votes);
        const user = views.user.deref()!;
        return [
            "div",
            status,
            entry && entry.id && votes
                ? [
                      "div",
                      { class: "flex flex-col" },
                      [entryHeader, entry],
                      // ["hr"],
                      [metadata, entry],
                      // sort opinions by votes
                      entry.opinions
                          .sort(sortByVotes)
                          .map((x) => [opinionCard, x]),
                      user.login &&
                      entry.opinions
                          .map((x) => x.github_handle.toLowerCase())
                          .indexOf(user.login.toLowerCase()) < 0
                          ? opinionInput
                          : [],
                  ]
                : [
                      "div",
                      [
                          "div",
                          { class: "text-4xl m-auto p-6" },
                          "no available data...",
                      ],
                      // when 404, then create new entry
                      [
                          "div",
                          { class: "flex flex-row items-top text-gray-500" },
                          [
                              eventBtn,
                              [ROUTE_TO_NEW_ENTRY, id],
                              {
                                  class: "block m-4 w-full",
                              },
                              [
                                  "div",
                                  {
                                      class:
                                          "shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded",
                                  },
                                  "CREATE",
                              ],
                          ],
                      ],
                  ],
        ];
    };
}
