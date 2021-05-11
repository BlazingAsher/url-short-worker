addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
})

async function handleRequest(request) {
  // substring to get rid of /g/
  let path = new URL(request.url).pathname.substring(3);
  console.log(request.headers['user-agent'], new Date(), path);

  if(path.charAt(path.length-1) === "/") {
    path = path.substring(0, path.length - 1);
  }

  const dest = await SHORTURLKV.get(path);
  if(dest === null) {
    return new Response('The requested URL is unavailable. Please verify your request and try again.', {status: 404});
  }
  else {
    return new Response(null, {status: 307, headers: {location: dest}});
  }

}