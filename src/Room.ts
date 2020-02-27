export default class Room {
  private _name: string
  private _id: string
  private readonly messages: any[]

  public constructor(name: string, id: string) {
    this._name = name
    this._id = id
    this.messages = []
  }

  public appendMessage(message: any) {
    this.messages.push(message)
  }

  public get name(): string {
    return this._name;
  }

  public get id(): string {
    return this._id;
  }

  public get lastUpdated(): any {
    if (this.messages.length > 0)
      return this.messages[this.messages.length - 1].ts
    else
      return { '$date': new Date().getTime()/1000 }
  }

  public getMessages() {
    let message_string = ''
    for (let m in this.messages) {
      let message = this.messages[m]
      let name = message.u.name
      if (!name) name = message.u.username
      if (message.alias) name = message.alias
      let str = '{blue-fg}' +
        `[${name} ` +
        '{/}' +
        '{grey-fg}' +
        `@${message.u.username}` +
        '{/}' +
        '{blue-fg}]{/}'
      if (message.file)
        str += ` {magenta-fg}${message.file.name}(${message.file.type}){/}`
      str += ` ${message.msg}\n`
      message_string += str
    }
    return message_string
  }
}
