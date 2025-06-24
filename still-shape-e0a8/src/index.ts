import { fromHono } from "chanfana";
import { Hono } from "hono";
import { TaskCreate } from "./endpoints/taskCreate";
import { TaskDelete } from "./endpoints/taskDelete";
import { TaskFetch } from "./endpoints/taskFetch";
import { TaskList } from "./endpoints/taskList";

// Start a Hono app
const app = new Hono();

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/",
});

// Register OpenAPI endpoints
openapi.get("/api/tasks", TaskList);
openapi.post("/api/tasks", TaskCreate);
openapi.get("/api/tasks/:taskSlug", TaskFetch);
openapi.delete("/api/tasks/:taskSlug", TaskDelete);

// Export the Hono app
export default app;


// index.js
// export default {
// 	async fetch(request: any, env: any) {
// 	  const url = new URL(request.url);
// 	  const key = url.pathname.slice(1);
  
// 	  if (request.method == 'PUT') {
// 		await env.MY_BUCKET.put(key, request.body);
// 		return new Response(`Put ${key} successfully!`);
// 	  }
// 	  else if (request.method == 'GET') {
// 		const value = await env.MY_BUCKET.get(key);
  
// 		if (value === null) {
// 		  return new Response('Object Not Found', { status: 404 });
// 		}
  
// 		return new Response(value.body);
// 	  }
// 	  else if (request.method == 'DELETE') {
// 		await env.MY_BUCKET.delete(key);
// 		return new Response('Deleted!', { status: 200 });
// 	  }
// 	}
// };
