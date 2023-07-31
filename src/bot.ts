import 'dotenv/config';
import { Client, GatewayIntentBits, Message, EmbedBuilder, TextChannel, Channel, DMChannel} from 'discord.js';
import SorareApi from './sorare/api';
import WsSorare from './sorare/ws';
import * as QUERY from "./sorare/queries/wsQueries";
import Helper from './utils/helper';
import WeiConverter from './utils/weiConvert';
import { IAuctionUpdateResponse, ITokenAuction } from './sorare/dto/IAuctionUpdateResponse';

export default class Bot {
  private client: Client;
  private sorareApi: SorareApi;

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
    this.client.login(process.env.TOKEN);

    this.sorareApi = SorareApi.getInstance();
    this.client.channels.cache.get(String(process.env.CHANNEL_ID));
    this.onInit();
  }
  private async onInit() {
      this.client.on('ready', async () => {
      console.log(`Logged in as ${this.client.user!.tag}`);
      await this.sorareApi.Auth();
      const ws = new WsSorare();
      await ws.Start(QUERY.ACART_UPDATE, this.notifyAuctionACard) ;
      this.client.on('messageCreate', (msg: Message) => this.handleMessage(msg));

    });
  }

//#region controlla se i risultati della ws non sono nulli e se il prezzo della carta soddisfa i requisiti per essere stampata
  private  notifyAuctionACard = async (value: IAuctionUpdateResponse) => {
    const tokenAuctionWasUpdated = value?.data.tokenAuctionWasUpdated;

    if (tokenAuctionWasUpdated && tokenAuctionWasUpdated.nfts[0]?.priceRange) {
        const { min, max } = tokenAuctionWasUpdated.nfts[0].priceRange;
        const parsedMin = Number(min);
        const parsedMax = Number(max);

        const [isInRage, mediumPrice, differencePercentage] = Helper.calculatedAveragePrice(parsedMin, parsedMax, Number(tokenAuctionWasUpdated.currentPrice));

        if (isInRage) this.printACard(tokenAuctionWasUpdated, mediumPrice, differencePercentage);
    }
  }

//#endregion


//#region stampa la carta nel canale
  private async printACard(card: ITokenAuction, mediumPrice: number, differencePercentage: number) {
    const { pictureUrl, name, slug , priceRange} = card.nfts[0];
    const embed = new EmbedBuilder()
        .setTitle(name)
        .setURL(`https://sorare.com/football/cards/${slug}`)
        .setImage(pictureUrl)
        .addFields(
            { name: 'Min Val Eth', value: String(new WeiConverter(priceRange.min).call()),},
            { name: 'Average Price Eth', value: String(new WeiConverter(String(mediumPrice)).call()) },
          )
        ;

    const channel = this.client.channels.cache.get(String(process.env.CHANNEL_ID));

    if (channel && (channel instanceof TextChannel || channel instanceof DMChannel)) {
        try {
            await channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Errore nell\'invio del messaggio:', error);
        }
    } else {
        console.error(`Il canale con ID ${process.env.CHANNEL_ID} non è un TextChannel o un DMChannel o non esiste.`);
    }
  }
//#endregion


  private handleMessage = (msg: Message) => {
    if (msg.content === 'ping') {
      msg.reply('pong');
    }
  }


}
