export class Button {
    customId;
    execute;
    type = 1 /* InteractionType.Button */;
    constructor(customId, execute) {
        this.customId = customId;
        this.execute = execute;
    }
}
export class SelectMenu {
    customId;
    execute;
    type = 2 /* InteractionType.Select */;
    constructor(customId, execute) {
        this.customId = customId;
        this.execute = execute;
    }
}
export class ContextMenu {
    customId;
    data;
    execute;
    type = 3 /* InteractionType.ContextMenu */;
    constructor(customId, data, execute) {
        this.customId = customId;
        this.data = data;
        this.execute = execute;
    }
}
export class Modal {
    customId;
    execute;
    type = 4 /* InteractionType.Modal */;
    constructor(customId, execute) {
        this.customId = customId;
        this.execute = execute;
    }
}
export class AutoComplete {
    customId;
    execute;
    type = 5 /* InteractionType.AutoComplete */;
    constructor(customId, execute) {
        this.customId = customId;
        this.execute = execute;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW50ZXJhY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9JbnRlcmFjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFVQSxNQUFNLE9BQU8sTUFBTTtJQUdSO0lBQ0E7SUFIRixJQUFJLGtDQUFpRDtJQUM1RCxZQUNTLFFBQTJCLEVBQzNCLE9BQTZEO1FBRDdELGFBQVEsR0FBUixRQUFRLENBQW1CO1FBQzNCLFlBQU8sR0FBUCxPQUFPLENBQXNEO0lBQ25FLENBQUM7Q0FDTDtBQUVELE1BQU0sT0FBTyxVQUFVO0lBR1o7SUFDQTtJQUhGLElBQUksa0NBQWlEO0lBQzVELFlBQ1MsUUFBMkIsRUFDM0IsT0FBb0U7UUFEcEUsYUFBUSxHQUFSLFFBQVEsQ0FBbUI7UUFDM0IsWUFBTyxHQUFQLE9BQU8sQ0FBNkQ7SUFDMUUsQ0FBQztDQUNMO0FBRUQsTUFBTSxPQUFPLFdBQVc7SUFHYjtJQUNBO0lBQ0E7SUFKRixJQUFJLHVDQUEyRDtJQUN0RSxZQUNTLFFBQTJCLEVBQzNCLElBQXFCLEVBQ3JCLE9BRU47UUFKTSxhQUFRLEdBQVIsUUFBUSxDQUFtQjtRQUMzQixTQUFJLEdBQUosSUFBSSxDQUFpQjtRQUNyQixZQUFPLEdBQVAsT0FBTyxDQUViO0lBQ0EsQ0FBQztDQUNMO0FBRUQsTUFBTSxPQUFPLEtBQUs7SUFHUDtJQUNBO0lBSEYsSUFBSSxpQ0FBK0M7SUFDMUQsWUFDUyxRQUEyQixFQUMzQixPQUFrRTtRQURsRSxhQUFRLEdBQVIsUUFBUSxDQUFtQjtRQUMzQixZQUFPLEdBQVAsT0FBTyxDQUEyRDtJQUN4RSxDQUFDO0NBQ0w7QUFFRCxNQUFNLE9BQU8sWUFBWTtJQUdkO0lBQ0E7SUFIRixJQUFJLHdDQUE2RDtJQUN4RSxZQUNTLFFBQTJCLEVBQzNCLE9BQW1FO1FBRG5FLGFBQVEsR0FBUixRQUFRLENBQW1CO1FBQzNCLFlBQU8sR0FBUCxPQUFPLENBQTREO0lBQ3pFLENBQUM7Q0FDTCJ9