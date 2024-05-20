// import { useMutation } from '@apollo/client'
// import * as AddTodoTypes from './__generated__/AddTodo'
// import { GetAllTodos } from '../__generated__/GetAllTodos'
// import { getClient } from '@/gql/client'
// import { UpdateLocationDocument } from '@/gql/queries/update-location.generated'
// import { GetLocationDocument } from '@/gql/queries/get-location.generated'
//
// export function updateLocation() {
//   const { data, errors } = await getClient().mutate({
//     mutation: UpdateLocationDocument,
//     variables: { location: { id: 1, city: 'my New213213 City' } },
//     update(cache, { data }) {
//       const newTodoFromResponse = data?.updateLocation
//       const existingTodos = cache.readQuery<GetAllTodos>({
//         query: GetLocationDocument,
//       })
//
//       if (existingTodos && newTodoFromResponse) {
//         cache.writeQuery({
//           query: GetLocationDocument,
//           data: {
//             locations: {
//               edges: [
//                 ...existingTodos?.todos.edges,
//                 { __typename: 'TodosEdge', node: newTodoFromResponse },
//               ],
//             },
//           },
//         })
//       }
//     },
//   })
//   const [mutate, { data, error }] = useMutation<
//     AddTodoTypes.AddTodo,
//     AddTodoTypes.AddTodoVariables
//   >(ADD_TODO, {
//     update(cache, { data }) {},
//   })
//   return { mutate, data, error }
// }
//
// const updateLocation = async () => {
//   return data
// }
