import { ActionCable } from "@sorare/actioncable";

export default class WsSorare {

    private cable: ActionCable;
    private result!: IAuctionUpdateResponse;

    constructor() {
        this.cable = new ActionCable({
        url: process.env.WS_SORARE,
        headers: {
          Authorization: `Bearer ${process.env.JWT_TOKEN}`,
          APIKEY: String(process.env.API_KEY)
        },
      });
    }

  /**
   * avvia la webSocket e crea la subscrition sorare.
   *
   * @param {string} query - Il primo valore.
   * @param {function(any): void} action - azione che voglio che faccia quanto ritorna i risultati.
   * @returns {void}
  */

   public Start = (query: string, action: (value: any) => void) => {
      const self = this;
      this.cable.subscribe(query, {
        connected() {
          console.log('connesso');
        },

        disconnected() {
          console.log('disconnesso');
        },

        rejected() {
          console.log('rifiutato');
        },

        received(data) {
          console.log('ricevuto');
          self.result = data.result;
          action(self.result)

        },
      });
  }



}