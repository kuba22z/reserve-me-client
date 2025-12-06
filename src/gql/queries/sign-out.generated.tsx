import * as Types from '@/gql/__generated__/types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type SignOutQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type SignOutQuery = { readonly __typename?: 'Query', readonly logout: number };


export const SignOutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"signOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<SignOutQuery, SignOutQueryVariables>;