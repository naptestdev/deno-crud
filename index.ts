import {
  MongoClient,
  ObjectId,
} from "https://deno.land/x/mongo@v0.30.0/mod.ts";

import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
import { opine } from "https://deno.land/x/opine@2.2.0/mod.ts";

interface PostSchema {
  _id: ObjectId;
  content: string;
}

const client = new MongoClient();

await client.connect(config().MONGODB_URI);
console.log("Connected to mongodb database");

const db = client.database("deno-crud");
const Post = db.collection<PostSchema>("posts");

const app = opine();

app.get("/", async (req, res) => {
  if (req.query.content) {
    const inserted = await Post.insertOne({
      content: req.query.content.trim(),
    });

    res.send(inserted);
  } else {
    const existingPosts = await Post.find().toArray();

    res.send(existingPosts);
  }
});

app.listen(8000, () =>
  console.log("Server has started on http://localhost:8000 🚀")
);
