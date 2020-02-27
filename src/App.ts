import blessed from 'blessed'

import Room from './Room'
import Session from './Session'
import MessageWindow from './MessageWindow'
import CONFIG from '../rocket_config.json'

enum AppState {
    LOGIN,
    MAIN,
}

const HOST = CONFIG.ROCKET_HOST

export default class App {
    private screen: blessed.Widgets.Screen
    private sidebar: blessed.Widgets.BoxElement
    private messageWindow?: MessageWindow
    private mainWindow: blessed.Widgets.BoxElement
    private session: Session

    public constructor(
        screen: blessed.Widgets.Screen,
        username: string,
        password: string,
    ) {
        this.screen = screen
        const logger = {
            debug: (log: any) => this.updateStatusBar({log}),
            info: (log: any) => this.updateStatusBar({log}),
            warn: (log: any) => this.updateStatusBar({log}),
            warning: (log: any) => this.updateStatusBar({log}),
            error: (log: any) => this.updateStatusBar({log}),
        }
        let sidebarWidth = 40
        this.mainWindow = blessed.textbox({
            parent: this.screen,
            width: '100%-' + sidebarWidth,
            left: sidebarWidth,
            bg: 'blue',
        })
        this.sidebar = blessed.box({
            parent: screen,
            mouse: true,
            scrollable: true,
            width: sidebarWidth,
            height: '100%',
            bg: 'black',
            padding: { left: 1 }
        })
        this.session = new Session(
          {
            name: username,
            pass: password,
          },
          HOST,
          logger,
          this.render,
        )
        this.initialize()
    }

    private initialize = async() => {
      await this.session.openSession()
      let room
      for (let r in this.session.rooms) {
        room = this.session.rooms[r]
        break
      }
      this.messageWindow = new MessageWindow(
        room,
        this.mainWindow,
        this.parseConsoleInput,
      )
    }

    private parseConsoleInput = (data: {input: string, clientRoom: Room }) => {
      let { input, clientRoom, } = data
      if (input[0] !== ':') {
        // SEND MESSAGE
        this.session.sendMessage(input, clientRoom)
        this.render()
        return
      }
      else input = input.substr(1)
      if (input === 'q') return process.exit(0);
      let input_arr = input.split(' ')
      // change room
      if (input_arr[0] === 'cr') {
        if (!input_arr[1])
          console.log('oops')
        let room_name = input_arr[1]
        // get room by name
        for (let r in this.session.rooms) {
          let room = this.session.rooms[r]
          if (room.name === room_name)
            if (this.messageWindow) {
              this.session.getRoomMessages(room, 100)
              this.messageWindow.changeRoom(room)
            }
        }
      }
      this.render()
    }

    private render = () => {
      let { sidebar, messageWindow, session } = this
      sidebar.setContent('')
      if (messageWindow) messageWindow.clear()
      for (let r in session.rooms) {
        let room : Room = session.rooms[r]
        sidebar.setContent(sidebar.getContent() + `${room.name}\n`)
        if (messageWindow && messageWindow.room.id === room.id) {
          messageWindow.appendMessages(room.getMessages())
        }
      }
      this.screen.render()
    }

    private updateStatusBar(status: any) {
      let { messageWindow } = this
      if (messageWindow)
        messageWindow.setStatus(status)
    }
}
