import styles from "./page.module.css";
import {Suspense} from "react";
import {getClient} from "@/gql/client";
import {GetTokenDocument} from "@/gql/queries/get-token.generated";
import {GetClientsDocument} from "@/gql/queries/get-clients.generated";

function MissingAuthorizationCodeFallback() {
  return <>Fail</>
}

type TokenResponse = { access_token: string,refresh_token: string,expires_in: number,token_type:string }


const getTokenGraphql=  async (authorizationCode: string) => {
    // return useQuery(GetTokenDocument,{
    //     context: {
    //     headers: {
    //         'Content-type': 'application/json',
    //             'Access-Control-Allow-Origin': '*'
    //     }
    // },variables: {code: authorizationCode}
    // }).data
    const {data,error,errors,networkStatus} = await getClient().query({
        query: GetTokenDocument, variables: {code: authorizationCode}
    })
    return data
}
const getToken = async (authorizationCode: string): Promise<TokenResponse> =>  await fetch('http://localhost:3000/auth',{method: "POST",   headers: {
    'Content-type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },body: JSON.stringify({code: authorizationCode})}).then((response) => response.json())
    .then((data) => {
      console.log(data.id_token);
      return data
    })
    .catch((error) => {
      console.error(error);
      throw new Error('Failed to fetch data')
    });

const getAllClients = async (token:string) =>  await fetch('http://localhost:3000/client',{method: "GET",   headers: {
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + token
    }}).then((response) => response.json())
    .then((data) => {
        return data
    })
    .catch((error) => {
        throw new Error('Failed to fetch data')
    });

const getAllClientsGraphql = async (token:string) =>  {
    const {data,error,errors,networkStatus} = await getClient().query({
        query: GetClientsDocument, context: { headers: {authorization: 'Bearer ' + token}}
    })
    console.log(data.clientsByGroup)
    return data.clientsByGroup
};

export default async function Home({searchParams}: {
  searchParams: { code: string | undefined };
}) {
  const data = searchParams.code ? getTokenGraphql(searchParams.code).then(a => a ? getAllClientsGraphql(a.accessToken.access_token): null) : null
    const client = await data;

  return (
      <Suspense fallback={<MissingAuthorizationCodeFallback />}>
    <main className={styles.main}>
      It works
    </main>
      </Suspense>

  );
}
