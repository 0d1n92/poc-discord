import { GraphQLClient, gql } from 'graphql-request';
import 'dotenv/config';
import Utils from './utils'

export default class SorareApi {

  public Auth = async () => {
    const graphQLClient = new GraphQLClient(`${process.env.API_URL}/federation/graphql`);

    // Definizione della mutation SignInMutation
    const mutation = gql`
    mutation SignInMutation($input: signInInput!) {
      signIn(input: $input) {
        currentUser {
          slug
          jwtToken(aud: "poc-discord") {
            token
            expiredAt
          }
        }
        errors {
          message
        }
      }
    }
  `;

    // Parametri per la mutation
    const variables = {
      input: {
        email: process.env.EMAIL_SORARE,
        password: process.env.PSWD_SORARE
      },
    };

    let hashPassword: string = '';

    const salt = await Utils.getSalt();

    if(salt) {
      hashPassword = Utils.hashPassword(process.env.PSWD_SORARE_API, salt.toString())
    }

    try {
      const data = await graphQLClient.request(mutation, variables);

      console.log('Risposta della mutation SignInMutation:', data);
      // Puoi gestire i dati ricevuti e inviarli a un canale specifico di Discord per notificare gli utenti, ecc.
    } catch (error) {
      console.error('Errore durante la richiesta:', error);
    }



  }




}