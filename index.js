addEventListener('fetch', event => {
  const { request } = event;
  if(request.method === "POST") {
    event.respondWith(handleModifyRequest(event.request));
  }
  else if(request.method === "DELETE") {
    event.respondWith(handleDeleteRequest(event.request));
  }
  else {
    event.respondWith(handleResolveRequest(event.request));
  }
})

async function authorize(request, cb) {
  const suppliedKey = request.headers.get('x-access-token');
  const apiToken = await SHORTURLKV.get("accesstoken");

  if(suppliedKey !== apiToken)
    return new Response("Unauthorized.", {status:401});
  else
    return cb(request);
}

function retrievePath(url) {
  // substring to get rid of /g/, change the 3 to 1 if you are running at the root
  let path = new URL(request.url).pathname.substring(3);
  return path.charAt(path.length-1) === "/" ? path.substring(0, path.length - 1) : path;
}

async function handleResolveRequest(request) {
  const path = retrievePath(request.url);

  const dest = await SHORTURLKV.get("r_" + path);
  if(dest === null) {
    return new Response('The requested URL is unavailable. Please verify your request and try again.', {status: 404});
  }
  else {
    return new Response(null, {status: 307, headers: {location: dest}});
  }
}

async function handleModifyRequest(request) {
  return authorize(request, async () => {
    const path = retrievePath(request.url);

    const newInfo = await request.json();
    if(!newInfo["dest"]){
      return new Response("Request missing \"dest\" property.", {status:400});
    }

    await SHORTURLKV.put("r_" + path, newInfo["dest"]);

    return new Response("OK", {status: 200});
  });

}

async function handleDeleteRequest(request) {
  return authorize(request, async () => {
    const path = retrievePath(request.url);

    await SHORTURLKV.delete("r_" + path);

    return new Response("OK", {status: 200});
  });
}