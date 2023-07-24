import { EmbedBuilder } from 'discord.js';
export default class Embed extends EmbedBuilder {
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
        else
            this.setColor(type);
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
        else
            this.setColor(type);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW1iZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvRW1iZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBa0IsTUFBTSxZQUFZLENBQUE7QUFJekQsTUFBTSxDQUFDLE9BQU8sT0FBTyxLQUFNLFNBQVEsWUFBWTtJQUM3QyxZQUFZLE1BQWlCLEVBQUUsSUFBZTtRQUM1QyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRTtZQUFFLE9BQU07UUFFN0IsTUFBTSxTQUFTLEdBQWM7WUFDM0IsU0FBUyxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFO1lBQ25DLE1BQU0sRUFBRTtnQkFDTixPQUFPLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxTQUFTO2dCQUM3QyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRO2FBQzNCO1NBQ0YsQ0FBQTtRQUVELEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUVoQixJQUFJLElBQUksS0FBSyxTQUFTO1lBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTthQUMzQyxJQUFJLElBQUksS0FBSyxPQUFPO1lBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTthQUM5QyxJQUFJLElBQUksS0FBSyxNQUFNO1lBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTthQUM3QyxJQUFJLElBQUksS0FBSyxNQUFNO1lBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTthQUM3QyxJQUFJLElBQUksS0FBSyxTQUFTO1lBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTs7WUFDaEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUMxQixDQUFDO0lBRUQsT0FBTyxDQUFDLElBQWU7UUFDckIsSUFBSSxJQUFJLEtBQUssU0FBUztZQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUE7YUFDM0MsSUFBSSxJQUFJLEtBQUssT0FBTztZQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUE7YUFDOUMsSUFBSSxJQUFJLEtBQUssTUFBTTtZQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUE7YUFDN0MsSUFBSSxJQUFJLEtBQUssTUFBTTtZQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUE7YUFDN0MsSUFBSSxJQUFJLEtBQUssU0FBUztZQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUE7O1lBQ2hELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDMUIsQ0FBQztDQUNGIn0=