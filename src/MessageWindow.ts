import Room from './Room'
import blessed from 'blessed'

export default class ChatWindow {
  private _room: Room
  private messageWidget: blessed.Widgets.BoxElement
  private statusWidget: blessed.Widgets.BoxElement
  private consoleWidget: blessed.Widgets.TextboxElement
  private onConsoleSubmitCallback: (data: {input: string, clientRoom: Room }) => void

  constructor(
    room: Room,
    parent: blessed.Widgets.Node,
    onConsoleSubmit: (data: {input: string, clientRoom: Room }) => void,
  ) {
    this._room = room
    this.messageWidget = blessed.box({
      parent: parent,
      width: '100%',
      height: '100%-2',
      bg: '#222222',
      tags: true,
      mouse: true,
      scrollable: true,
      alwaysScroll: true,
      scrollbar: {
        style: { bg: 'white' },
        track: { bg: 'black' }
      },
      padding: {
          left: 2,
          right: 2,
          top: 1,
          bottom: 1,
      }
    })
    this.statusWidget = blessed.box({
        parent: parent,
        width: '100%',
        height: 1,
        top: '100%-2',
        bg: 'grey',
        fg: 'black',
        padding: {left: 1},
        content: ' #CHANNEL',
    })
    this.consoleWidget = blessed.textbox({
        parent: parent,
        bg: '#222222',
        width: '100%-1',
        top: '100%-1',
        inputOnFocus: true,
        padding: { left: 2 }
    })
    this.onConsoleSubmitCallback = onConsoleSubmit
    this.consoleWidget.on('submit', this.onConsoleSubmit)
    this.consoleWidget.focus()
  }

  private onConsoleSubmit = (input: string) => {
    let clientRoom = this._room
    this.onConsoleSubmitCallback({
      input,
      clientRoom,
    })
    this.consoleWidget.clearValue()
    this.consoleWidget.focus()
  }

  public clear() {
    this.messageWidget.setContent('')
  }

  public get room(): Room {
    return this._room;
  }

  public setStatus(status: any) {
    let str : string = ''
    for (let prop in status)
        str += ' ' + prop + ': ' + status[prop]
    this.statusWidget.setContent(`ROOM: ${this.room.name} (${this.room.id}) STATUS: ${str}`)
  }

  public appendMessages(m: string) {
    this.messageWidget.setContent(this.messageWidget.content + m + '\n')
    this.messageWidget.setScrollPerc(100)
  }

  public changeRoom(room: Room) {
    this._room = room
    this.setStatus({ event: 'Changed Room' })
  }
}

