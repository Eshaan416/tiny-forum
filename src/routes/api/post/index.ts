import { redirect } from "@solidjs/router";
import { APIEvent } from "@solidjs/start/server";
import sql from "~/lib/db";
import { getSession } from "~/lib/session";

export async function GET() {
  /**
   * TODO(eshaan): also get the user's name in the posts
   * ```json
   * [{
   *    id: <<post_id>>,
   *    ...,
   *    user: {
   *      name: <<username>>
   *    }
   * }]
   * ```
   */
  const posts = await sql`select 
  post.*, users.name as user 
  from post 
  INNER JOIN users ON users.id = post.user_id`;
  return posts;
}

export async function POST(event: APIEvent) {
  const session = await getSession();
  const userId = session.data.id;
  const formdata = await event.request.formData();
  const title = formdata.get("title") as string;
  const content = formdata.get("content") as string;
  const tags = (formdata.getAll("tags") as string[]).map((tag) =>
    parseInt(tag)
  );

  const [post] =
    await sql`insert into post (user_id, title, content) VALUES (${userId}, ${title}, ${content}) RETURNING id`;

  for await (const tag of tags) {
    await sql`insert into post_tags (post_id, tag_id) values (${post.id}, ${tag})`;
  }

  return redirect(`/post/${post.id}`);
}
