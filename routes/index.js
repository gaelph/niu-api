//@ts-check
/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 * @typedef {import("./utils").RequestHandler} RequestHandler
 * @typedef {import("./utils").PathHandler} PathHandler
 * @typedef {import("./utils").RouteCollection} RouteCollection
 *
 * @typedef {{ routes: RouteCollection }} RouterType
 */

/** @type {RouteCollection} */
const TemperatureRecordRoute = require('./temperature_record');
const RulesRoute = require('./rule')

/** @type {RouterType} */
const Router = {
  routes: {
    ...TemperatureRecordRoute,
    ...RulesRoute
  },

}

/**
 * 
 * @param {RouteCollection} routes 
 * @param {string} path 
 * @return {PathHandler|null}
 */
function findRoutesForPath(routes, path) {
  let availablePaths = Object.keys(routes);
  let candidatePath = availablePaths.find(p => p == path);

  return candidatePath
    ? routes[candidatePath]
    : null
}

class RouterError extends Error {
  constructor(status, message) {
    super(message)

    this.status = status
  }
}

/**
 * 
 * @param {PathHandler} routes 
 * @param {string} method 
 * @return {RequestHandler}
 */
function findRouteForMethod(routes, method) {
  let availableMethods = Object.keys(routes);
  let candidateMethod = availableMethods.find(m => m.toLowerCase() == method.toLowerCase());

  return candidateMethod
    ? routes[candidateMethod]
    : null
}

/**
 * 
 * @param {Request} param0
 * @return {RequestHandler}
 * @throws {RouterError}
 */
function findMatchingRoute({ method, path }) {
  let routesForPath = findRoutesForPath(Router.routes, path);

  if (!routesForPath) {
    let error = new RouterError(404, "Not found")
    throw error
  }

  let route = findRouteForMethod(routesForPath, method)

  if (!route) {
    let error = new RouterError(405, "Bad method")
    throw error
  }

  return route
}

module.exports = {
  findMatchingRoute
}