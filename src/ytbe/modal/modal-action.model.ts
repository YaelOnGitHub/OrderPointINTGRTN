/** Modal Action */
export class ModalAction {
  /** Display text - Will default to action name if unspecified */
  text?: string;

  /** Action/command name */
  name?: string;

  /** Whether or not this is the primary button */
  primary?: boolean = false;

  /** Whether or not this action closes the modal */
  closes?: boolean = false;
}
