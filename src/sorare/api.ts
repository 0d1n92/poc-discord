import { GraphQLClient, gql } from 'graphql-request';
import 'dotenv/config';
import Utils from './utils'
import { SignInResponse } from './dto';


export default class SorareApi {

  public Auth = async () => {
    const graphQLClient = new GraphQLClient(`${process.env.API_URL}/federation/graphql`,
    {
    headers: {
      'Content-Type': 'application/json',
    },
  });

    const mutation = `
     mutation SignInMutation($input: signInInput!) {
      signIn(input: $input) {
        currentUser {
          slug
          jwtToken(aud: "poc-sorare") {
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

    let hashPassword: string = '';

    const salt = await Utils.getSalt();

    if(salt) {
      hashPassword = await Utils.hashPassword(process.env.PSWD_SORARE, salt.toString())
    }

    const variables = {
      input: {
        email: process.env.EMAIL_SORARE,
        password: hashPassword
      },
    };

    try {
      const data = await graphQLClient.request<SignInResponse>(mutation, variables);
      if (data && data.signIn && data.signIn.currentUser) {
        const { token, expiredAt } = data.signIn.currentUser.jwtToken;
        process.env.JWT_TOKEN = token;
        process.env.JWT_TOKEN_EXPIRY = expiredAt;
      } else {
        const { errors } = data.signIn
        throw new Error('Errore auth sorare'+ errors);
      }
    } catch (error) {
      throw new Error('Errore auth sorare:' + error);
    }
  }
}