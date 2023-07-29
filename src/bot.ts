import 'dotenv/config';
import { Client, GatewayIntentBits, Message, EmbedBuilder, TextChannel, Channel} from 'discord.js';
import SorareApi from './sorare/api';
import WsSorare from './sorare/ws';
import * as QUERY from "./sorare/queries/WsQueries";
import Utils from './sorare/utils';


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

    this.sorareApi = new SorareApi();
    this.client.channels.cache.get(String(process.env.CHANNEL_ID));
    this.onInit();
  }
  private async onInit() {
      this.client.on('ready', async () => {
      console.log(`Logged in as ${this.client.user!.tag}`);
      await this.sorareApi.Auth();
      const ws = new WsSorare(this.client);
      await ws.Start(QUERY.ACART_UPDATE) ;
      this.client.on('messageCreate', (msg: Message) => this.handleMessage(msg));

    });
  }

  private handleMessage = (msg: Message) => {
    if (msg.content === 'ping') {
      msg.reply('pong');
    }
  }

}
