/* eslint-disable no-unused-vars */
// @ts-ignore
// @ts-nocheck

// Slash command and Message Command
import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, Message } from 'discord.js'
import BotClient from './structures/BotClient'

export default {
  name: '',
  description: '',
  aliases: [],
  isSlash: false,

  async execute(
    client: BotClient,
    message: Message,
    args: string[]
  ): Promise<any> {},
  slash: {
    name: '',
    data: new SlashCommandBuilder().setName('').setDescription('').toJSON(),
    async execute(
      client: BotClient,
      interaction: CommandInteraction
    ): Promise<any> {}
  }
}

// Message command

import Discord from 'discord.js'

export default {
  name: '',
  description: '',
  aliases: [],
  isSlash: false,
  async execute(
    client: BotClient,
    message: Discord.Message,
    args: string[]
  ): Promise<any> {}
}

// Slash command
import Discord from 'discord.js'

export default {
  name: '',
  description: '',
  isSlash: true,
  data: new SlashCommandBuilder().setName('').setDescription('').toJSON(),
  async execute(
    client: BotClient,
    interaction: CommandInteraction
  ): Promise<any> {}
}
