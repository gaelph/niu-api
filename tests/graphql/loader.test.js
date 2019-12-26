const fs = require('fs')
const path = require('path')
const loader = require('../../src/graphql/loader')

describe('GraphQL schema loader', () => {
  it('loads all schemas in the passed array', () => {
    const baseSchemaPath = path.resolve(__dirname, '../../src/graphql/base.graphql')
    const ruleSchemaPath = path.resolve(__dirname, '../../src/domains/rule/schema.graphql')

    let result = loader.load([
      baseSchemaPath,
      ruleSchemaPath
    ])

    const base = fs.readFileSync(baseSchemaPath, 'utf8').toString('utf8')
    const rule = fs.readFileSync(ruleSchemaPath).toString('utf8')

    expect(result.startsWith(base)).toBe(true)
    expect(result.endsWith(rule)).toBe(true)
  })

  it('throws if a path is falsy', () => {
    try {
      loader.load([null])

      expect(false).toBe(true)
    }
    catch (error) {
      expect(error.message).toBe('Cannot read a file without a path')
    }
  })

  it('throws if a file does\'t have a .graphql extension', () => {
    try {
      loader.load([
        path.resolve(__dirname, './index.js')
      ])

      expect(false).toBe(true)
    }
    catch (error) {
      expect(error.message).toBe("Invalid file extension. Expected '.graphql'")
    }
  })

  it('throws if a file does not exist', () => {

    const p = path.resolve(__dirname, './non-existing-file.graphql')
    try {
      loader.load([p])

      expect(false).toBe(true)
    }
    catch (error) {
      expect(error.message).toBe(`Invalid file path. ${p} not found`)
    }
    
  })
})