"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class Embed extends discord_js_1.EmbedBuilder {
    constructor(client, type) {
        if (!client.isReady())
            return;
        const EmbedJSON = {
            timestamp: new Date().toISOString(),
            footer: {
                iconURL: client.user.avatarURL() ?? undefined,
                text: client.user.username
            }
        };
        super(EmbedJSON);
        if (type === 'success')
            this.setColor('#57F287');
        else if (type === 'error')
            this.setColor('#ED4245');
        else if (type === 'warn')
            this.setColor('#FEE75C');
        else if (type === 'info')
            this.setColor('#5865F2');
        else if (type === 'default')
            this.setColor('#5865F2');
    }
    setType(type) {
        if (type === 'success')
            this.setColor('#57F287');
        else if (type === 'error')
            this.setColor('#ED4245');
        else if (type === 'warn')
            this.setColor('#FEE75C');
        else if (type === 'info')
            this.setColor('#5865F2');
        else if (type === 'default')
            this.setColor('#5865F2');
    }
}
exports.default = Embed;
