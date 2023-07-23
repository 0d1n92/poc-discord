export interface SignInResponse {
  signIn: {
    currentUser: {
      jwtToken: {
        token: string;
        expiredAt: string;
      };
    };
    errors: {
      message: string;
    }[];
  };
}