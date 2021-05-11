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

async function handleResolveRequest(request) {
  // substring to get rid of /g/
  let path = new URL(request.url).pathname.substring(3);
  console.log(request.headers['user-agent'], new Date(), path);

  if(path.charAt(path.length-1) === "/") {
    path = path.substring(0, path.length - 1);
  }

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
    let path = new URL(request.url).pathname.substring(3);

    if(path.charAt(path.length-1) === "/") {
      path = path.substring(0, path.length - 1);
    }

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
    let path = new URL(request.url).pathname.substring(3);

    if(path.charAt(path.length-1) === "/") {
      path = path.substring(0, path.length - 1);
    }

    await SHORTURLKV.delete("r_" + path);

    return new Response("OK", {status: 200});
  });
}