import { ActionCable } from "@sorare/actioncable";
import { Channel, Client, DMChannel, EmbedBuilder, Message, TextChannel } from "discord.js";
import Utils from './utils';


export default class WsSorare {

    public cable: ActionCable;
    public client: Client;


    constructor(client: Client) {
        this.client = client;
        this.cable = new ActionCable({
        url: process.env.WS_SORARE,
        headers: {
          Authorization: `Bearer ${process.env.JWT_TOKEN}`,
          APIKEY: String(process.env.API_KEY)
        },
      });
    }

   public Start = (query: string): Promise<AuctionUpdateResponse> | null => {
    const self = this;
    return new Promise<AuctionUpdateResponse>((resolve, reject) => {
      this.cable.subscribe(query, {
        connected() {
          console.log('connesso');
        },

        disconnected() {
          console.log('disconnesso');
        },

        rejected() {
          console.log('rifiutato');
          reject(new Error('Connessione rifiutata'));
        },

        received(data) {
          console.log('ricevuto');
          const response: AuctionUpdateResponse = data.result;
          if(response?.data.tokenAuctionWasUpdated && response?.data.tokenAuctionWasUpdated.nfts[0].priceRange) {
            const {min, max} = response?.data.tokenAuctionWasUpdated.nfts[0].priceRange;

            if(Utils.calculatedAveragePrice( Number(min), Number(max), Number(response.data.tokenAuctionWasUpdated.currentPrice))) {

              self.printACard(response.data.tokenAuctionWasUpdated)

          }
        }

          return resolve(response);
        },
      });
    });
  }

  private printACard = async (card: TokenAuction)  => {
      const {pictureUrl, name, slug} = card.nfts[0]
        const embed = new EmbedBuilder()
      .setTitle(name)
      .setURL(`https://sorare.com/football/cards/${slug}`)
      .setImage(pictureUrl);

    const channel = this.client.channels.cache.get(String(process.env.CHANNEL_ID));
     if (channel instanceof TextChannel || channel instanceof DMChannel) {
    try {
          await (channel as TextChannel | DMChannel).send({ embeds: [embed] });
        } catch (error) {
          console.error('Errore nell\'invio del messaggio:', error);
        }
      } else {
        console.error(`Il canale con ID ${process.env.CHANNEL_ID} non è un TextChannel o un DMChannel.`);
      }
  }

}