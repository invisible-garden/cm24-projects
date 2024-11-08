import { encrypt, decrypt } from "../utils/encryption.js";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

export class ConfigService {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
  }

  async getUserChannelConfigs(userId) {
    const { data, error } = await this.supabase
      .from("user_channel_configs")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;
    if (!data) return [];

    return data.map((channel) => ({
      push_channel_address: channel.push_channel_address,
      name: channel.name,
      discord: {
        channelId: channel.discord_channel_id,
      },
      telegram: {
        chatId: channel.telegram_chat_id,
        threadId: channel.telegram_thread_id,
      },
      push: {
        channelAddress: channel.push_channel_address,
      },
    }));
  }

  async addChannelConfig(userId, channelConfig) {
    const { error } = await this.supabase.from("user_channel_configs").insert({
      user_id: userId,
      name: channelConfig.name,
      discord_channel_id: channelConfig.discord.channelId,
      telegram_chat_id: channelConfig.telegram.chatId,
      telegram_thread_id: channelConfig.telegram.threadId,
      push_channel_address: channelConfig.push.channelAddress,
    });

    if (error) throw error;
  }

  async updateChannelConfig(pushChannelAddress, channelConfig) {
    // Create update object with only the fields that are provided
    const updateData = {};

    if (channelConfig.name) {
      updateData.name = channelConfig.name;
    }

    if (channelConfig.discord) {
      if (channelConfig.discord.token) {
        updateData.discord_token = encrypt(channelConfig.discord.token);
      }
      if (channelConfig.discord.channelId) {
        updateData.discord_channel_id = channelConfig.discord.channelId.trim();
      }
    }

    if (channelConfig.telegram) {
      if (channelConfig.telegram.token) {
        updateData.telegram_token = encrypt(channelConfig.telegram.token);
      }
      if (channelConfig.telegram.chatId) {
        updateData.telegram_chat_id = channelConfig.telegram.chatId.trim();
      }
      if (channelConfig.telegram.threadId) {
        updateData.telegram_thread_id = channelConfig.telegram.threadId.trim();
      }
    }

    const { error } = await this.supabase
      .from("user_channel_configs")
      .update(updateData)
      .eq("push_channel_address", pushChannelAddress);

    if (error) throw error;
  }

  async removeChannelConfig(pushChannelAddress) {
    const { error } = await this.supabase
      .from("user_channel_configs")
      .delete()
      .eq("push_channel_address", pushChannelAddress);

    if (error) throw error;
  }

  async getChannelConfig(pushChannelAddress) {
    const { data, error } = await this.supabase
      .from("user_channel_configs")
      .select("*")
      .eq("push_channel_address", pushChannelAddress)
      .single();

    if (error) throw error;
    if (!data) throw new Error("Channel configuration not found");

    return {
      push_channel_address: data.push_channel_address,
      name: data.name,
      discord: {
        channelId: data.discord_channel_id,
      },
      telegram: {
        chatId: data.telegram_chat_id,
        threadId: data.telegram_thread_id,
      },
      push: {
        channelAddress: data.push_channel_address,
      },
    };
  }
}
