import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { ethers } from "ethers";
import { ConfigService } from "./services/ConfigService.js";
import fs from "fs";

export class PushBot {
  constructor() {
    this.configService = new ConfigService();
  }

  async initialize() {
    try {
      // Initialize Push client with bot credentials
      const signer = new ethers.Wallet(process.env.PUSH_BOT_PRIVATE_KEY);
      this.pushUser = await PushAPI.initialize(signer, {
        env: process.env.PUSH_ENV || CONSTANTS.ENV.PROD,
      });

      // Initialize stream for receiving messages
      this.stream = await this.pushUser.initStream([CONSTANTS.STREAM.CHAT]);

      // Set up message handler
      this.stream.on(CONSTANTS.STREAM.CHAT, this.handleMessage.bind(this));

      // Connect to stream
      await this.stream.connect();

      console.log("PushBot initialized successfully");
    } catch (error) {
      console.error("Failed to initialize PushBot:", error);
      throw error;
    }
  }

  async handleMessage(message) {
    if (message.event !== "chat.request") return;

    const messageContent = message.message.content;
    try {
      const command = messageContent.split(" ")[0].toLowerCase();
      const args = messageContent.split(" ").slice(1);
      switch (command) {
        case "/create-channel":
          await this.handleCreateChannel(message, args);
          break;
        case "/add-token-telegram":
          await this.handleAddTelegramToken(message, args);
          break;
        case "/add-token-discord":
          await this.handleAddDiscordToken(message, args);
          break;
        case "/add-config-discord":
          await this.handleAddDiscordConfig(message, args);
          break;
        case "/add-config-telegram":
          await this.handleAddTelegramConfig(message, args);
          break;
        case "/help":
          await this.handleHelpCommand(message);
          break;
        default:
          await this.sendResponse(
            message.from,
            "Unknown command. Use /help to see available commands."
          );
      }
    } catch (error) {
      console.error("Error handling message:", error);
      await this.sendResponse(message.from, `Error: ${error.message}`);
    }
  }

  async handleAddTelegramToken(message, args) {
    try {
      if (!args[0] || !args[1]) {
        await this.sendResponse(
          message.from,
          "Please provide the Telegram bot token and chat id."
        );
        return;
      }

      await this.configService.updateChannelConfig(args[1], {
        telegram: { token: args[0] },
      });

      await this.sendResponse(
        message.from,
        "Telegram token successfully added!"
      );
    } catch (error) {
      console.error("Error adding Telegram token:", error);
      await this.sendResponse(message.from, `Error: ${error.message}`);
    }
  }

  async handleAddDiscordToken(message, args) {
    try {
      if (!args[0] || !args[1]) {
        await this.sendResponse(
          message.from,
          "Please provide the Discord bot token and channel id."
        );
        return;
      }

      await this.configService.updateChannelConfig(args[1], {
        discord: { token: args[0] },
      });

      await this.sendResponse(
        message.from,
        "Discord token successfully added!"
      );
    } catch (error) {
      console.error("Error adding Discord token:", error);
      await this.sendResponse(message.from, `Error: ${error.message}`);
    }
  }

  async handleAddDiscordConfig(message, args) {
    try {
      if (args.length < 3) {
        await this.sendResponse(
          message.from,
          "Please provide the Discord bot token, channel id and channel name."
        );
        return;
      }
      await this.configService.updateChannelConfig(args[0], {
        discord: { token: args[1], channelId: args[2] },
      });
      await this.sendResponse(
        message.from,
        "Discord config added successfully"
      );
    } catch (error) {
      console.error("Error adding Discord config:", error);
      await this.sendResponse(message.from, `Error adding Discord config`);
    }
  }

  async handleAddTelegramConfig(message, args) {
    try {
      if (args.length < 3) {
        await this.sendResponse(
          message.from,
          "Please provide the Telegram bot token, chat id and thread id."
        );
        return;
      }
      const defaultThreadId = "1";
      await this.configService.updateChannelConfig(args[0], {
        telegram: {
          token: args[1],
          chatId: args[2],
          threadId: args[3] || defaultThreadId,
        },
      });
      await this.sendResponse(
        message.from,
        "Telegram config added successfully"
      );
    } catch (error) {
      console.error("Error adding Telegram config:", error);
      await this.sendResponse(message.from, `Error adding Telegram config`);
    }
  }

  async handleHelpCommand(message) {
    const helpText = `Available commands:

/create-channel <group-name> - Create a new channel, returns the channel id
/add-token-telegram <channel-id> <token>  - Add your Telegram bot token and chat id
/add-token-discord <channel-id> <token>  - Add your Discord bot token and channel id
/add-config-discord <channel-id> <token> <discord-channel-id> - Add your Discord bot token and channel id
/add-config-telegram <channel-id> <token> <telegram-chat-id> <telegram-thread-id> - Add your Telegram bot token and chat id
/create-config - Create a new channel sending all configuration
/help - Show this help message

For more information, visit our documentation at [URL]`;

    await this.sendResponse(message.from, helpText);
  }

  async handleCreateChannel(message, args) {
    try {
      if (args.length < 1) {
        await this.sendResponse(
          message.from,
          "Please provide a name for the channel. Usage: /create-channel <channel_name>"
        );
        return;
      }

      const channelName = args.join(" ");
      const groupDescription = "Channel created via OmniPushBot";

      // Create Push Protocol group
      const groupImage = fs.readFileSync("./pushImage.txt", "base64");
      const newGroup = await this.pushUser.chat.group.create(channelName, {
        description: groupDescription,
        image: groupImage,
        admins: [message.from],
        private: false,
      });

      // Save channel configuration to database
      await this.configService.addChannelConfig(message.from, {
        name: 2,
        discord: {
          channelId: null, // Will be set later when user configures Discord
        },
        telegram: {
          chatId: null, // Will be set later when user configures Telegram
        },
        push: {
          channelAddress: newGroup.chatId,
        },
      });

      setTimeout(() => {
        this.sendResponse(
          message.from,
          `Channel "${channelName}" created successfully! Channel ID: ${newGroup.chatId}\n\nUse /add-token-telegram <token> <channel-id> and /add-token-discord <token> <channel-id> to configure your channels.`
        );
      }, 10000);
    } catch (error) {
      console.error("Error creating channel:", error);
      await this.sendResponse(
        message.from,
        `Failed to create channel: ${error.message}`
      );
    }
  }

  async sendResponse(recipient, content) {
    try {
      await this.pushUser.chat.send(recipient, {
        content,
        type: "Text",
      });
    } catch (error) {
      console.error("Error sending response:", error);
    }
  }

  async cleanup() {
    if (this.stream) {
      await this.stream.disconnect();
    }
  }
}
