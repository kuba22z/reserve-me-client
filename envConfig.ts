import { strict as assert } from 'assert'

assert.ok(process.env.SERVER_URL)
export const EnvVariables = {
  serverUrl: process.env.SERVER_URL,
}
