import Logger from '../utils/Logger'
import BaseManager from './BaseManager'
import mongoose from 'mongoose'
import path from 'path'
import fs from 'fs'
import BotClient from '../structures/BotClient'

/**
 * @extends {BaseManager}
 */
export default class DatabaseManager extends BaseManager {
  private logger: Logger
  public readonly type: string

  constructor(client: BotClient) {
    super(client)

    this.logger = new Logger('DatabaseManager')
    this.type = client.config.database.type
  }

  async load(schemaPath = path.join(__dirname, '../schemas')) {
    this.logger.debug('Using MongoDB...')
    mongoose.connect(
      this.client.config.database.url,
      this.client.config.database.options
    )

    this.client.db = mongoose.connection

    this.loadSchemas(schemaPath)
  }

  private loadSchemas(schemaPath: string) {
    this.logger.debug('Loading schemas...')

    const schemaFolder = fs.readdirSync(schemaPath)

    try {
      schemaFolder.forEach((schemaFile) => {
        try {
          if (schemaFile.startsWith('example')) return
          if (!schemaFile.endsWith('.ts'))
            return this.logger.warn(
              `Not a TypeScript file ${schemaFile}. Skipping.`
            )

          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const { default: schema } = require(`../schemas/${schemaFile}`) as {
            default: mongoose.Model<any>
          }

          this.client.schemas.set(schema.modelName, schema)
        } catch (error: any) {
          this.logger.error(
            `Error loading schema ${schemaFile}.\n` + error.stack
          )
        } finally {
          this.logger.debug(
            `Succesfully loaded schemas. count: ${this.client.schemas.size}`
          )
        }
      })
    } catch (error: any) {
      this.logger.error('Error fetching folder list.\n' + error.stack)
    }
  }
}
