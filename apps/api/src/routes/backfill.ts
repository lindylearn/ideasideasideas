import type { Request, Response } from "express";
import { db } from "../common/db.js";
import { indexPost } from "../common/typesense.js";

export async function runBackfill(req: Request, res: Response) {
    const limit = parseInt(req.query.limit as string) || 10000;

    const posts = await db.post.findMany({
        orderBy: { updatedAt: "desc" },
        take: limit
    });

    let index = 1;
    for (const post of posts) {
        console.log(`(${index}/${posts.length}) Backfilling post ${post.url}`);

        await indexPost(post);

        index++;
    }

    console.log(`Backfill complete`);
    return res.json({ success: true });
}
