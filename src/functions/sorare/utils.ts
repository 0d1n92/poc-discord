import axios from 'axios';
import bcrypt = require("bcrypt");
import 'dotenv/config';

export default class Utils {

  public static hashPassword = (pswd: string | undefined, salt: string): string => bcrypt.hashSync(String(pswd), salt);

  public static getSalt= async (): Promise<string | boolean> => {
    return axios.get(`${process.env.API_URL}/api/v1//users/${process.env.EMAIL_SORARE}`)
      .then((res) => {
        console.log(res);
        return res.data.salt;
      }).catch(
        (err) => {
          console.log(err);
          return false;
        }
      );
  }

}