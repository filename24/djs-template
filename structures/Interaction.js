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
