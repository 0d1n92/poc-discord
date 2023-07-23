import 'dotenv/config';
import { Client, GatewayIntentBits, Message } from 'discord.js';
import SorareApi from './sorare/api';
import WsSorare from './sorare/ws';

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

    this.sorareApi = new SorareApi();

    this.onInit();

    this.client.on('messageCreate', (msg: Message) => this.handleMessage(msg));

    this.client.login(process.env.TOKEN);
  }

  private async onInit() {
      this.client.on('ready', async () => {
      console.log(`Logged in as ${this.client.user!.tag}`);
      await this.sorareApi.Auth();
      const ws = new WsSorare();
      await ws.Start();
    });
  }

  private handleMessage = (msg: Message) => {
    if (msg.content === 'ping') {
      msg.reply('pong');
    }
  }

}
