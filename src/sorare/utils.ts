import axios from 'axios';
import bcrypt = require("bcrypt");
import 'dotenv/config';

export default class Utils {


  public static hashPassword = async (pswd: string | undefined, salt: string): Promise<string> => {
    try {
      const hashedPassword = await bcrypt.hash(String(pswd), salt);
      return hashedPassword;
    } catch (error: any) {
      throw new Error('Errore durante l\'hash della password: ' + error.message);
    }
};

  public static getSalt= async (): Promise<string | boolean> => {
    return axios.get(`${process.env.API_URL}/api/v1//users/${process.env.EMAIL_SORARE}`)
      .then((res) => {
        return res.data.salt;
      }).catch(
        (err: any) => {
          console.log(err);
          return false;
        }
      );
  }

  public static calculatedAveragePrice(max: number, min: number, current: number) {

     const mediumPice = (min + max)/2
     const differenzaPercentuale: number = ((mediumPice - current) / mediumPice) * 100;
     if(differenzaPercentuale < 19.50) {
        return true
     }
     return false
  }

}