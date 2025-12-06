import * as Types from '@/gql/__generated__/types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type GetTokenQueryVariables = Types.Exact<{
  tokenRequest: Types.TokenRequestDto;
}>;


export type GetTokenQuery = { readonly __typename?: 'Query', readonly accessToken: { readonly __typename?: 'TokenDto', readonly accessToken: string, readonly expiresIn: number, readonly tokenType: string, readonly refreshToken?: string | null, readonly idToken: string, readonly groups: ReadonlyArray<Types.CognitoGroupDto> } };


export const GetTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tokenRequest"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TokenRequestDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tokenRequest"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tokenRequest"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"expiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"tokenType"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"idToken"}},{"kind":"Field","name":{"kind":"Name","value":"groups"}}]}}]}}]} as unknown as DocumentNode<GetTokenQuery, GetTokenQueryVariables>;