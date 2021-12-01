const Logger = require('../utils/Logger')
const BaseManager = require('./BaseManager')
const mongoose = require('mongoose')
const quick = require('quick.db')
const path = require('path')
const fs = require('fs')

/**
 * @extends {BaseManager}
 */
class DatabaseManager extends BaseManager {
  /**
   * DatabaseManager constructor
   * @param {import('../structures/BotClient')} client 
   */
  constructor (client) {
    super(client)

    this.logger = new Logger('DatabaseManager')
    this.type = client.config.database.type
  }
  

  load(schemaPath = path.join(__dirname, '../schemas')) {
    switch (this.type) {
    case 'mongodb': {
      this.logger.debug('Using MongoDB...')
      mongoose.connect(this.client.config.database.url, this.client.config.database.options).then(async (database)=> {
        
        this.client.db = database
  
        this.logger.info('Connected to MongoDB!')
      })
  
      break
    }
  
    case 'quick.db' || 'sqlite': {
      this.logger.debug('Using SQLite(quick.db)...')
      this.client.db = new quick
  
      this.logger.info('Connected to SQLite!')
      break
    }
    default:
      return this.logger.error('Invalid database type:' + this.type)
    }

    this.loadSchemas(schemaPath)
  }

  loadSchemas(schemaPath) {
    this.logger.debug('Loading schemas...')

    let schemaFolder = fs.readdirSync(schemaPath)

    try {
      schemaFolder.forEach(schemaFile => {
        try {
          if(schemaFile.startsWith('example')) return
          if(!schemaFile.endsWith('.js')) return this.logger.warn(`Not a Javascript file ${schemaFile}. Skipping.`)

          let schema = require(`../schemas/${schemaFile}`)

          this.client.schemas.set(schema.modelName, schema)
        } catch (error) {
          this.logger.error(`Error loading schema ${schemaFile}.\n` + error.stack)
        } finally {
          this.logger.debug(`Succesfully loaded schemas. count: ${this.client.schemas.size}`)
        }
      })
    } catch (error) {
      this.logger.error('Error fetching folder list.\n' + error.stack)
    }
  }
}

module.exports = DatabaseManager