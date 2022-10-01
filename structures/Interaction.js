"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoComplete = exports.Modal = exports.ContextMenu = exports.SelectMenu = exports.Button = void 0;
class Button {
    customId;
    execute;
    type = 1 /* InteractionType.Button */;
    constructor(customId, execute) {
        this.customId = customId;
        this.execute = execute;
    }
}
exports.Button = Button;
class SelectMenu {
    customId;
    execute;
    type = 2 /* InteractionType.Select */;
    constructor(customId, execute) {
        this.customId = customId;
        this.execute = execute;
    }
}
exports.SelectMenu = SelectMenu;
class ContextMenu {
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
exports.ContextMenu = ContextMenu;
class Modal {
    customId;
    execute;
    type = 4 /* InteractionType.Modal */;
    constructor(customId, execute) {
        this.customId = customId;
        this.execute = execute;
    }
}
exports.Modal = Modal;
class AutoComplete {
    customId;
    execute;
    type = 5 /* InteractionType.AutoComplete */;
    constructor(customId, execute) {
        this.customId = customId;
        this.execute = execute;
    }
}
exports.AutoComplete = AutoComplete;
