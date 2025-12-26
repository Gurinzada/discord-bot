import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

dotenv.config();
const TARGET_USER_ID = "288740443665989632";
const M = "505889750452928513"
const ONE_WEEK_TIMEOUT = 7 * 24 * 60 * 60 * 1000;
const LOGCHANNEL = "731972228110876682";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once("ready", () => {
  console.log(`Bot online como ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (!message.guild) return; 

  if (message.author.id === (TARGET_USER_ID) || message.author.id === M) {
    try {
      const botMessage = "Bye bye 🖕";
      await message.reply(botMessage);

      if (!message.member) {
        console.log("Membro não encontrado no cache");
        return;
      }

      if (
        message.member.communicationDisabledUntilTimestamp &&
        message.member.communicationDisabledUntilTimestamp > Date.now()
      ) {
        console.log(`${message.author.tag} já está em timeout`);
        return;
      }

      await message.member.timeout(
        ONE_WEEK_TIMEOUT,
        "Castigo automático de 1 semana kkkkkk"
      );
      console.log(`${message.author.tag} castigado por 1 semana kkkkkk`);

      const logChannel = message.guild.channels.cache.get(LOGCHANNEL);
      if (logChannel) {
        await logChannel.send(
          `${message.author.tag} castigado por 1 semana kkkkkk`
        );
      }
    } catch (error) {
      console.log("Erro ao aplicar castigo:", error);
    }
  }


  if (message.author.id === (M)) {
    await message.reply("Xiuuuu 🤫");
  }

});

client.on("voiceStateUpdate", async (oldState, newState) => {
  if (newState.member.id === M && newState.channel && !oldState.channel) {
    try {
      await newState.setMute(true, `Auto-mute do usuário ${newState.member.user.tag}`);
      console.log(`${newState.member.user.tag} foi mutado automaticamente ao entrar no canal de voz`);

      const logChannel = newState.guild.channels.cache.get(LOGCHANNEL);
      if (logChannel) {
        await logChannel.send(
          `${newState.member.user.tag} foi mutado automaticamente ao entrar em ${newState.channel.name}`
        );
      }
    } catch (error) {
      console.log("Erro ao mutar usuário:", error);
    }
  }
});


client.login(process.env.TOKEN_DISCORD_BOT);
