import * as Types from '@/gql/__generated__/types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type GetLoginUrlQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetLoginUrlQuery = { readonly __typename?: 'Query', readonly login: string };


export const GetLoginUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getLoginUrl"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"}}]}}]} as unknown as DocumentNode<GetLoginUrlQuery, GetLoginUrlQueryVariables>;