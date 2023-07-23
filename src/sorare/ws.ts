import { ActionCable } from "@sorare/actioncable";

export default class WsSorare {

    public cable: ActionCable;

    constructor() {
        this.cable = new ActionCable({
        url: process.env.WS_SORARE,
        headers: {
          Authorization: `Bearer ${process.env.JWT_TOKEN}`,
          APIKEY: String(process.env.API_KEY)
        },
      });

      this.Start();
    }

    public Start = () => {
      this.cable.subscribe('aCardWasUpdated { id }', {
      connected() {
        console.log('connected');
      },

      disconnected() {
        console.log('disconnected');
      },

      rejected() {
        console.log('rejected');
      },

      received(data) {
        console.log('received');
        console.log(data);
      },
  });


  }

}