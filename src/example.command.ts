/* eslint-disable no-unused-vars */

// Slash command and Message Command
import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, Message } from 'discord.js'
import BotClient from './structures/BotClient'


module.exports = {
  name: '',
  description : '',
  aliases: [],
  isSlash: false,

  async execute(client: BotClient, message: Message, args: string[]): Promise<any> {
    
  },
  slash: {
    name: '',
    data: new SlashCommandBuilder()
      .setName('')
      .setDescription('')
      .toJSON(),
    async execute(client: BotClient, interaction: CommandInteraction): Promise<any> {

    }
  }
}

// Message command

const Discord = require('discord.js')

module.exports = {
  name: '',
  description : '',
  aliases: [],
  isSlash: false,
  async execute(client: BotClient, message: Discord.Message, args: string[]): Promise<any> {
  },
}

// Slash command
const Discord = require('discord.js')

module.exports = {
  name: '',
  description : '',
  isSlash: true,
  data: new SlashCommandBuilder()
    .setName('')
    .setDescription('')
    .toJSON(),
  async execute(client: BotClient, interaction: CommandInteraction): Promise<any> {

  }
}