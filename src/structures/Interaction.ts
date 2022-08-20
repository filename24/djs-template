import {
  AutocompleteInteraction,
  ButtonInteraction,
  ContextMenuCommandInteraction,
  ModalSubmitInteraction,
  SelectMenuInteraction
} from 'discord.js'
import { BaseInteractionFunction, InteractionData } from '@types'
import { InteractionType } from '@utils/Constants'

export class Button {
  public type: InteractionType.Button = InteractionType.Button
  constructor(
    public name: string,
    public execute: BaseInteractionFunction<ButtonInteraction<'cached'>>
  ) {}
}

export class SelectMenu {
  public type: InteractionType.Select = InteractionType.Select
  constructor(
    public name: string,
    public execute: BaseInteractionFunction<SelectMenuInteraction<'cached'>>
  ) {}
}

export class ContextMenu {
  public type: InteractionType.ContextMenu = InteractionType.ContextMenu
  constructor(
    public name: string,
    public data: InteractionData,
    public execute: BaseInteractionFunction<
      ContextMenuCommandInteraction<'cached'>
    >
  ) {}
}

export class Modal {
  public type: InteractionType.Modal = InteractionType.Modal
  constructor(
    public name: string,
    public execute: BaseInteractionFunction<ModalSubmitInteraction<'cached'>>
  ) {}
}

export class AutoComplete {
  public type: InteractionType.AutoComplete = InteractionType.AutoComplete
  constructor(
    public name: string,
    public execute: BaseInteractionFunction<AutocompleteInteraction<'cached'>>
  ) {}
}

export type BaseInteraction =
  | Button
  | SelectMenu
  | ContextMenu
  | Modal
  | AutoComplete
