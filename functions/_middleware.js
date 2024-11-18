export async function onRequest({ request, next }) {
  // Get the URL from the request
  const url = new URL(request.url);

  // Log the current path (optional, for debugging)
  console.log('Request path:', url);

  // If it's a static file (has extension), serve it normally
  if (url.pathname.match(/\.[a-zA-Z0-9]+$/)) {
    console.log('%c [ static file ]-10', 'font-size:13px; background:pink; color:#bf2c9f;');
    return next();
  }
  if (url.pathname.includes('/assets/')) {
    return next();
  }

  // For your SPA routes
  if (url.pathname.startsWith('/xp')) {
    try {
      // Try the original request first
      const response = await next();
      console.log(
        '%c [ response ]-18',
        'font-size:13px; background:pink; color:#bf2c9f;',
        response,
      );

      // If page not found, serve index.html
      if (response.status === 404) {
        const indexResponse = await fetch(new URL('/', request.url));
        return new Response(indexResponse.body, {
          headers: {
            ...response.headers,
            'content-type': 'text/html;charset=UTF-8',
          },
          status: 200,
        });
      }
      return response;
    } catch (error) {
      console.error('Error handling request:', error);
      return new Response('Server Error', { status: 500 });
    }
  }

  // For all other routes, continue normally
  return next();
}
