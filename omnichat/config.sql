create table user_channel_configs (
  id push_channel_address text primary key,
  user_id text not null, -- public key Web3
  name text not null,
  discord_token text,
  telegram_token text,
  discord_channel_id text,
  telegram_chat_id text,
  telegram_thread_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Índices para melhor performance
-- create index idx_base_configs_user_id on user_base_configs(user_id);
-- create index idx_channel_configs_user_id on user_channel_configs(user_id);