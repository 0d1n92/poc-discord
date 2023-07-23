import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import SorareApi from './functions/sorare/api';

const sorareApi: SorareApi = new SorareApi();
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	],
});

client.on('ready', () => {
	console.log(`Logged in as ${client.user!.tag}`);
  sorareApi.Auth()

});

client.on('messageCreate', (msg) => {
	if (msg.content === 'ping') {
		msg.reply('pong');
	}
});

client.login(process.env.TOKEN);
