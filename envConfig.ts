// TODO comment this out and fix the error
// const projectDir = process.cwd()
// loadEnvConfig(projectDir)

export const EnvVariables = {
  serverUrl: process.env.SERVER_URL ?? 'http://localhost:8080',
}
