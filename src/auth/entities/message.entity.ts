export class Message {
  message: string;

  constructor(partial: Partial<Message>) {
    Object.assign(this, partial);
  }
}
