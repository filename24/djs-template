import { Event } from "../structures/Event"
import CommandManager from '../managers/CommandManager'
import ErrorManager from '../managers/ErrorManager'

export default new Event('messageCreate', async (client, message) => {
  let commandManager = new CommandManager(client)
  let errorManager = new ErrorManager(client)

  if (message.author.bot) return
  if (message.channel.type === 'DM') return
  if (!message.content.startsWith(client.config.bot.prefix)) return

  let args = message.content.slice(client.config.bot.prefix.length).trim().split(/ +/g)
  let commandName = args.shift()?.toLowerCase()
  let command = commandManager.get(commandName as string)

  await client.dokdo.run(message)
  try {
    // @ts-ignore
    await command?.execute(client, message, args)

  } catch (error: any) {
    errorManager.report(error, { executer: message })
  }
})