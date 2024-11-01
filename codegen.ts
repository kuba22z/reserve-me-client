//https://medium.com/@kitagolda/react-next-js-working-with-multiple-graphql-endpoints-and-automatic-type-generation-via-apollo-8b294d7a76a4
//https://the-guild.dev/graphql/codegen/plugins/typescript/typescript-react-apollo
// codegen.ts

import { CodegenConfig } from '@graphql-codegen/cli'
import { EnvVariables } from './envConfig'

const config: CodegenConfig = {
  overwrite: true,
  schema: `${EnvVariables.serverUrl}/graphql`,
  watch: false,
  generates: {
    'src/gql/__generated__/types.tsx': {
      documents: 'src/**/*.{tsx,gql,graphql}',
      plugins: [
        'typescript',
        // 'typescript-react-apollo', // TODO this plugin generates a document which is exported and it collides with gql/queries's typed-document
        // 'typescript-operations',
      ],
    },
    'gql/queries': {
      documents: 'src/gql/queries/*.graphql',
      preset: 'near-operation-file',
      presetConfig: {
        extension: '.generated.tsx',
        baseTypesPath: '~@/gql/__generated__/types',
      },
      plugins: ['typescript-operations', 'typed-document-node'],
    },
    'src/gql/__generated__/graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
  config: {
    constEnums: true,
    immutableTypes: true,
    avoidOptionals: true,
  },
}

export default config
