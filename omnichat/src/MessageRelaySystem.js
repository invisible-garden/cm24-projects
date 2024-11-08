import { ConfigService } from "./services/ConfigService.js";
import { Client, GatewayIntentBits } from "discord.js";
import TelegramBot from "node-telegram-bot-api";
import { ethers } from "ethers";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { decrypt } from "./utils/encryption.js";

export class MessageRelaySystem {
  constructor() {
    this.configService = new ConfigService();
    this.activeConnections = new Map(); // push_channel_address -> connection
    this.clients = new Map(); // push_channel_address -> {discord, telegram, push}
  }

  async initialize() {
    try {
      // Subscribe to channel config changes
      const channelConfigSubscription = this.configService.supabase
        .channel("channel-configs")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "user_channel_configs",
          },
          this.handleChannelConfigChange.bind(this)
        )
        .subscribe();

      // Load existing configurations
      const { data: channelConfigs } = await this.configService.supabase
        .from("user_channel_configs")
        .select("*");

      // Initialize each channel
      for (const channelConfig of channelConfigs) {
        await this.initializeChannelClients(channelConfig);
      }

      this.subscriptions = {
        channelConfig: channelConfigSubscription,
      };
    } catch (error) {
      console.error("Failed to initialize system:", error);
      throw error;
    }
  }

  async initializeChannelClients(channelConfig) {
    try {
      const pushChannelAddress = channelConfig.push_channel_address;
      await this.cleanupChannelClients(pushChannelAddress);

      let discordClient, telegramBot, pushUser, pushStream;

      // Initialize Discord client if token exists
      if (channelConfig.discord_token) {
        discordClient = new Client({
          intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
          ],
        });
        await discordClient.login(decrypt(channelConfig.discord_token));
      }

      // Initialize Telegram client if token exists
      if (channelConfig.telegram_token) {
        telegramBot = new TelegramBot(decrypt(channelConfig.telegram_token), {
          polling: true,
        });
      }

      // Initialize Push client
      if (process.env.PUSH_BOT_PRIVATE_KEY) {
        const signer = new ethers.Wallet(process.env.PUSH_BOT_PRIVATE_KEY);
        pushUser = await PushAPI.initialize(signer, {
          env: process.env.PUSH_ENV || CONSTANTS.ENV.PROD,
        });

        pushStream = await pushUser.initStream([CONSTANTS.STREAM.CHAT]);
        await pushStream.connect();
      }

      // Set up handlers
      this.setupClientHandlers(
        pushChannelAddress,
        discordClient,
        telegramBot,
        pushStream,
        pushUser
      );

      // Store clients
      this.clients.set(pushChannelAddress, {
        discord: discordClient,
        telegram: telegramBot,
        push: pushUser ? { user: pushUser, stream: pushStream } : null,
      });

      // Store connection
      this.activeConnections.set(pushChannelAddress, {
        push_channel_address: channelConfig.push_channel_address,
        name: channelConfig.name,
        discord: {
          channelId: channelConfig.discord_channel_id,
        },
        telegram: {
          chatId: channelConfig.telegram_chat_id,
          threadId: channelConfig.telegram_thread_id,
        },
        push: {
          channelAddress: channelConfig.push_channel_address,
        },
      });
    } catch (error) {
      console.error(
        `Failed to initialize clients for channel ${channelConfig.push_channel_address}:`,
        error
      );
      throw error;
    }
  }

  async cleanupChannelClients(pushChannelAddress) {
    const clients = this.clients.get(pushChannelAddress);
    if (clients) {
      if (clients.discord) await clients.discord.destroy();
      if (clients.telegram) clients.telegram.stopPolling();
      if (clients.push?.stream) await clients.push.stream.disconnect();
      this.clients.delete(pushChannelAddress);
      this.activeConnections.delete(pushChannelAddress);
    }
  }

  setupClientHandlers(
    pushChannelAddress,
    discordClient,
    telegramBot,
    pushStream
  ) {
    // Discord handlers
    if (discordClient) {
      discordClient.on("messageCreate", async (message) => {
        if (message.author.bot) return;
        const connection = this.activeConnections.get(pushChannelAddress);
        if (connection && connection.discord.channelId === message.channelId) {
          await this.handleDiscordMessage(
            pushChannelAddress,
            message,
            connection
          );
        }
      });
    }

    // Telegram handlers
    if (telegramBot) {
      telegramBot.on("message", async (message) => {
        const connection = this.activeConnections.get(pushChannelAddress);
        if (
          connection &&
          connection.telegram.chatId === String(message.chat.id)
        ) {
          await this.handleTelegramMessage(
            pushChannelAddress,
            message,
            connection
          );
        }
      });
    }

    // Push handlers
    if (pushStream) {
      pushStream.on(CONSTANTS.STREAM.CHAT, async (message) => {
        const connection = this.activeConnections.get(pushChannelAddress);
        if (connection) {
          await this.handlePushMessage(pushChannelAddress, message, connection);
        }
      });
    }
  }

  async handleDiscordMessage(pushChannelAddress, message, connection) {
    try {
      const shortChannelId = message.channel.id.substring(0, 6);
      const formattedMessage = `[Discord] [#${shortChannelId}] ${message.author.username}: ${message.content}`;

      const clients = this.clients.get(pushChannelAddress);
      if (!clients?.telegram) return;

      await clients.telegram.sendMessage(
        connection.telegram.chatId,
        formattedMessage
        // { message_thread_id: parseInt(connection.telegram.threadId) } ERROR ETELEGRAM: 400 Bad Request: TOPIC_CLOSED
      );

      if (clients.push?.user) {
        await clients.push.user.chat.send(connection.push.channelAddress, {
          content: formattedMessage,
          type: "Text",
        });
      }
    } catch (error) {
      console.error(
        `Error in handleDiscordMessage for channel ${pushChannelAddress}:`,
        error.message
      );
    }
  }

  async handleTelegramMessage(pushChannelAddress, message, connection) {
    try {
      const formattedMessage = `[Telegram] [${
        message.from.username || message.from.first_name
      }]: ${message.text}`;

      // Get clients for this channel
      const clients = this.clients.get(pushChannelAddress);
      if (!clients) {
        console.error(`No clients found for channel ${pushChannelAddress}`);
        return;
      }

      // Send to Discord
      if (clients.discord && connection.discord.channelId) {
        const channel = clients.discord.channels.cache.get(
          connection.discord.channelId
        );
        if (channel) {
          await channel.send(formattedMessage);
        }
      }

      if (clients.push?.user) {
        await clients.push.user.chat.send(connection.push.channelAddress, {
          content: formattedMessage,
          type: "Text",
        });
      }
    } catch (error) {
      console.error(
        `Error in handleTelegramMessage for channel ${pushChannelAddress}:`,
        error
      );
    }
  }

  async handlePushMessage(pushChannelAddress, message, connection) {
    if (
      (message.origin === "self" && message.message.content.startsWith("[")) ||
      (message.event !== "chat.request" && message.event !== "chat.message")
    ) {
      return;
    }

    try {
      const walletAddress = message.from.split(":")[1];
      const shortWallet = `${walletAddress.substring(
        0,
        6
      )}...${walletAddress.substring(walletAddress.length - 4)}`;
      const formattedMessage = `[Push] [${shortWallet}]\n${message.message.content}`;

      if (connection.discord.channelId) {
        const channel = this.clients
          .get(pushChannelAddress)
          .discord.channels.cache.get(connection.discord.channelId);
        if (channel) {
          await channel.send(formattedMessage);
        }
      }

      if (connection.telegram.chatId) {
        // const telegramOptions = {};
        // if (connection.telegram.threadId) {
        //   telegramOptions.message_thread_id = connection.telegram.threadId;
        // } ERROR ETELEGRAM: 400 Bad Request: TOPIC_CLOSED
        await this.clients.get(pushChannelAddress).telegram.sendMessage(
          connection.telegram.chatId,
          formattedMessage
          // telegramOptions
        );
      }
    } catch (error) {
      console.error(
        `Error in handlePushMessage for channel ${pushChannelAddress}:`,
        error
      );
    }
  }

  async cleanup() {
    // Cleanup subscriptions
    if (this.subscriptions) {
      await this.subscriptions.channelConfig.unsubscribe();
    }

    // Cleanup all clients
    for (const [pushChannelAddress] of this.clients) {
      await this.cleanupChannelClients(pushChannelAddress);
    }
  }

  async handleChannelConfigChange(payload) {
    const { eventType, new: newConfig, old: oldConfig } = payload;
    const pushChannelAddress =
      newConfig?.push_channel_address || oldConfig?.push_channel_address;

    try {
      switch (eventType) {
        case "INSERT":
          await this.addChannelConnection(pushChannelAddress, newConfig);
          break;
        case "UPDATE":
          await this.updateChannelConnection(pushChannelAddress, newConfig);
          break;
        case "DELETE":
          await this.removeChannelConnection(pushChannelAddress, oldConfig);
          break;
      }
    } catch (error) {
      console.error(
        `Error handling channel config change for channel ${pushChannelAddress}:`,
        error
      );
    }
  }

  async addChannelConnection(pushChannelAddress, channelConfig) {
    try {
      const connections = this.activeConnections.get(pushChannelAddress);
      if (!connections) {
        throw new Error(
          `No active connections found for channel ${pushChannelAddress}`
        );
      }
      connections.set(channelConfig.push_channel_address, {
        push_channel_address: channelConfig.push_channel_address,
        name: channelConfig.name,
        discord: {
          channelId: channelConfig.discord_channel_id,
        },
        telegram: {
          chatId: channelConfig.telegram_chat_id,
          threadId: channelConfig.telegram_thread_id,
        },
        push: {
          channelAddress: channelConfig.push_channel_address,
        },
      });
    } catch (error) {
      console.error(
        `Error adding channel connection for channel ${pushChannelAddress}:`,
        error
      );
      throw error;
    }
  }

  async updateChannelConnection(pushChannelAddress, channelConfig) {
    try {
      await this.removeChannelConnection(pushChannelAddress, channelConfig);
      await this.addChannelConnection(pushChannelAddress, channelConfig);
    } catch (error) {
      console.error(
        `Error updating channel connection for channel ${pushChannelAddress}:`,
        error
      );
      throw error;
    }
  }

  async removeChannelConnection(pushChannelAddress, channelConfig) {
    try {
      const connections = this.activeConnections.get(pushChannelAddress);
      if (!connections) {
        throw new Error(
          `No active connections found for channel ${pushChannelAddress}`
        );
      }

      connections.delete(channelConfig.push_channel_address);
    } catch (error) {
      console.error(
        `Error removing channel connection for channel ${pushChannelAddress}:`,
        error
      );
      throw error;
    }
  }
}
