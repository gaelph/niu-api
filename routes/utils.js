//@ts-check
/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 * @typedef {(req: Request, res: Response) => void} RequestHandler
 */

/**
 * @typedef {Object} RouteComponent
 * @property {string} path
 * @property {RequestHandler} [get]
 * @property {RequestHandler} [post]
 * @property {RequestHandler} [patch]
 * @property {RequestHandler} [del]
 */

/**
 * @typedef {Object} PathHandler
 * @property {RequestHandler} [get]
 * @property {RequestHandler} [post]
 * @property {RequestHandler} [patch]
 * @property {RequestHandler} [del]
 */

/**
 * @typedef {Object<string,PathHandler>} RouteCollection
 */

/**
 * 
 * @param {string} path 
 * @param {RequestHandler} handler 
 * @return {{path: string, get: RequestHandler}}
 */
function get(path, handler) {
    return {
      path,
      get: handler
    }
  }

/**
 * 
 * @param {string} path 
 * @param {RequestHandler} handler 
 * @return {{path: string, post: RequestHandler}}
 */
function post(path, handler) {
    return {
      path,
      post: handler
    }
  }

function patch(path, handler) {
  return {
    path,
    patch: handler
  }
}

function del(path, handler) {
  return {
    path,
    del: handler
  }
}

/**
 * 
 * @param  {RouteComponent[]} components 
 * @return {RouteCollection}
 */
function route(...components) {
  let route = components.reduce(
    /**
     * @param {RouteCollection} acc
     * @param {RouteComponent} component
     */
    (acc, component) => {
    if (!acc[component.path]) {
      acc[component.path] = {}
    }

    const handler = acc[component.path]
    component.get && (
      acc[component.path] = {...handler, get: component.get}
    )

    component.post && (
      acc[component.path] = {...handler, post: component.post}
    )

    component.patch && (
      acc[component.path] = {...handler, patch: component.get}
    )

    component.del && (
      acc[component.path] = {...handler, del: component.post}
    )

    return acc
  },
  /** @type {RouteCollection} */
  {})

  return route
}

module.exports = {
  get, post, route
}