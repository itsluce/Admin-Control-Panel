/* eslint-disable */
/* tslint:disable */

/**
 * Mock Service Worker (2.10.4).
 * @see https://github.com/mswjs/msw
 * - Please do NOT modify this file.
 * - Please do NOT serve this file on production.
 */

const INTEGRITY_CHECKSUM = 'ca3b7f2cea73c08d72e0c6cbbef60e9b'
const IS_MOCKED_RESPONSE = Symbol('isMockedResponse')
const activeClientIds = new Set()

self.addEventListener('install', function () {
  self.skipWaiting()
})

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('message', async function (event) {
  const clientId = event.source.id

  if (!clientId || !event.data) {
    return
  }

  const allClients = await self.clients.matchAll({
    type: 'window',
  })

  switch (event.data.type) {
    case 'KEEPALIVE_REQUEST': {
      sendToClient(event.source, {
        type: 'KEEPALIVE_RESPONSE',
      })
      break
    }

    case 'INTEGRITY_CHECK_REQUEST': {
      sendToClient(event.source, {
        type: 'INTEGRITY_CHECK_RESPONSE',
        payload: INTEGRITY_CHECKSUM,
      })
      break
    }

    case 'MOCK_ACTIVATE': {
      activeClientIds.add(clientId)

      sendToClient(event.source, {
        type: 'MOCKING_ENABLED',
      })
      break
    }

    case 'MOCK_DEACTIVATE': {
      activeClientIds.delete(clientId)
      break
    }

    case 'CLIENT_CLOSED': {
      activeClientIds.delete(clientId)

      const remainingClients = allClients.filter((client) => {
        return client.id !== clientId
      })

      // Unregister itself when there are no more clients
      if (remainingClients.length === 0) {
        self.registration.unregister()
      }

      break
    }
  }
})

self.addEventListener('fetch', function (event) {
  const { clientId, request } = event
  const url = new URL(request.url)
  const isPassthrough = request.headers.get('msw-intention') === 'passthrough'

  // Bypass MSW completely if this is a passthrough request
  if (isPassthrough) {
    return
  }

  // Bypass MSW completely if there are no active clients
  if (activeClientIds.size === 0) {
    return
  }

  // Bypass MSW for browser extensions
  if (url.origin === self.location.origin && url.pathname === '/mockServiceWorker.js') {
    return
  }

  event.respondWith(
    handleRequest(event, clientId).catch((error) => {
      if (error.name === 'NetworkError') {
        console.warn(
          '[MSW] Successfully emulated a network error for the "%s %s" request.',
          request.method,
          request.url
        )
        return new Response(null, {
          status: 500,
          statusText: 'Network Error',
        })
      }

      throw error
    })
  )
})

async function handleRequest(event, clientId) {
  const client = await self.clients.get(clientId)
  const response = await getResponse(event, client)

  // Send back the response clone if the response is a mocked response
  if (response && response.headers.get('x-powered-by') === 'msw') {
    if (response[IS_MOCKED_RESPONSE]) {
      return response
    }

    const clonedResponse = response.clone()
    clonedResponse[IS_MOCKED_RESPONSE] = true

    return clonedResponse
  }

  return response
}

async function getResponse(event, client) {
  const { request } = event
  const clonedRequest = request.clone()

  function passthrough() {
    // Clone the request because it might've been already used
    // (i.e. its body has been read and sent to the client).
    const headers = Object.fromEntries(clonedRequest.headers.entries())

    // Remove MSW-specific request headers so the bypassed requests
    // comply with the server's CORS preflight check.
    delete headers['x-msw-intention']
    delete headers['x-msw-bypass']

    return fetch(clonedRequest, { headers })
  }

  // Bypass mocking when the client is not present in the list of active clients
  if (!client) {
    return passthrough()
  }

  // Bypass initial page load requests (i.e. static assets).
  // The absence of the immediate/parent client in the map of the active clients means
  // that MSW hasn't been activated for this client. Usually, this happens on the initial
  // page load or hard reload.
  if (!activeClientIds.has(client.id)) {
    return passthrough()
  }

  // Bypass requests with the explicit bypass header.
  // Such requests can be issued by "ctx.fetch()" or "req.passthrough()".
  if (request.headers.get('x-msw-bypass') === 'true') {
    return passthrough()
  }

  // Notify the client that a request has been intercepted.
  const requestId = crypto.randomUUID()

  client.postMessage({
    type: 'REQUEST',
    payload: {
      id: requestId,
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      cache: request.cache,
      mode: request.mode,
      credentials: request.credentials,
      destination: request.destination,
      integrity: request.integrity,
      redirect: request.redirect,
      referrer: request.referrer,
      referrerPolicy: request.referrerPolicy,
      body: await request.text(),
      bodyUsed: request.bodyUsed,
      keepalive: request.keepalive,
    },
  })

  return new Promise((resolve, reject) => {
    addEventListener('message', function handler(event) {
      if (event.source !== client) {
        return
      }

      if (!event.data || event.data.type !== 'RESPONSE') {
        return
      }

      if (event.data.payload.requestId !== requestId) {
        return
      }

      removeEventListener('message', handler)

      if (event.data.type === 'RESPONSE') {
        const message = event.data.payload

        if (message.type === 'NETWORK_ERROR') {
          const networkError = new Error(message.error.message)
          networkError.name = message.error.name

          // Rejecting a "respondWith" promise causes the request to error.
          reject(networkError)
          return
        }

        const response = new Response(message.body, message)

        response.headers.set('x-powered-by', 'msw')

        resolve(response)
      }
    })
  })
}

async function sendToClient(client, message) {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel()

    channel.port1.onmessage = (event) => {
      if (event.data && event.data.error) {
        return reject(event.data.error)
      }

      resolve(event.data)
    }

    client.postMessage(message, [channel.port2])
  })
}