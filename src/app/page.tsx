import styles from "./page.module.css";
import {Suspense} from "react";

function MissingAuthorizationCodeFallback() {
  return <>Fail</>
}

type TokenResponse = {id_token: string, access_token: string,refresh_token: string,expires_in: number,token_type: string}

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

const getAllClients = async (token:string): Promise<string> =>  await fetch('http://localhost:3000/client',{method: "GET",   headers: {
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + token
    }}).then((response) => response.json())
    .then((data) => {
        console.log(data)
        return data.message
    })
    .catch((error) => {
        throw new Error('Failed to fetch data')
    });

export default async function Home({searchParams}: {
  searchParams: { code: string | undefined };
}) {
  const data =searchParams.code ? await getToken(searchParams.code) : null
    const client =data ? await getAllClients(data.access_token) : null

  return (
      <Suspense fallback={<MissingAuthorizationCodeFallback />}>
    <main className={styles.main}>
      It works
    </main>
      </Suspense>

  );
}
