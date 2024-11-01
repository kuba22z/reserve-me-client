import { EnvVariables } from '../../envConfig'

export class GraphqlConfig {
  public static readonly graphqlUri: string = `${EnvVariables.serverUrl}/graphql`
}
