import { Event } from '@structures/Event'
import CommandManager from '@managers/CommandManager'
import ErrorManager from '@managers/ErrorManager'
import type { MessageCommand } from '@structures/Command'

export default new Event('messageCreate', async (client, message) => {
  const commandManager = new CommandManager(client)
  const errorManager = new ErrorManager(client)

  if (message.author.bot) return
  if (!message.inGuild()) return
  if (!message.content.startsWith(client.config.bot.prefix)) return

  const args = message.content
    .slice(client.config.bot.prefix.length)
    .trim()
    .split(/ +/g)
  const commandName = args.shift()?.toLowerCase()
  const command = commandManager.get(commandName as string) as MessageCommand

  await client.eval.run(message)

  try {
    await command?.execute(client, message, args)
  } catch (error: any) {
    errorManager.report(error, { executer: message, isSend: true })
  }
})
