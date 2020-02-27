/*
This class abstracts around the Rocketchat API.
*/

import { driver, api } from '@rocket.chat/sdk'

import Room from './Room'

type User = {
  name: string,
  pass: string,
  id?: string,
}
export default class Session {
  private readonly user: User
  private readonly host: string
  public rooms: any
  private on_dirty: Function

  public constructor(
    user: User,
    host: string,
    // TODO should be type ILogger
    log: any,
    on_dirty: Function,
  ) {
    this.rooms = {}
    this.user = user
    this.host = host
    driver.useLog(log)
    this.on_dirty = on_dirty
  }

  public openSession = async() => {
    let { user } = this
    let e = ''
    try {
      e = 'connecting'
      await driver.connect({
        host: this.host,
        useSsl: true,
      })
      e = 'logging in'
      user.id = await driver.login({
        username: this.user.name,
        password: this.user.pass,
      })
      e = 'joining rooms'
      await this.joinRooms()
      e = 'subscribing'
      await driver.subscribeToMessages()
      e = 'message callback'
      driver.reactToMessages(this.processNewMessages)
      e = 'creating client rooms'
      for (let i in driver.joinedIds)
        this.createRoom(driver.joinedIds[i])
      this.flush()
    } catch(err) {
      console.log(err,e)
    }
  }

  private joinRooms = async() => {
    let room_response = await driver.asyncCall(
      'rooms/get',
      []
    )
    let rooms : string[] = []
    for (let r in room_response) {
      let room = room_response[r]
      if (room.hasOwnProperty('name')) {
        rooms.push(room._id)
        this.createRoom(room._id, room.name)
      }
    }
  }

  public sendMessage(message: string, fromRoom: Room) {
    driver.sendToRoomId(message, fromRoom.id)
  }

  public getRoomMessages = async(room: Room, entries: number) => {
    // 
    let response = await driver.asyncCall(
      'loadHistory',
      [
        room.id,
        null,
        entries,
        // last time room got data
        room.lastUpdated,
      ]
    )
    // TODO this won't work at all lmao
    response.messages.reverse()
    for (let m in response.messages) {
      let message = response.messages[m]
      room.appendMessage(message)
    }
    this.flush()
  }

  private processNewMessages = async(err: any, message: any, _messageOptions: any) => {
    if (err) return;
    const room_id = message.rid
    // if room exists...
    if (!this.rooms.hasOwnProperty(room_id))
      this.createRoom(room_id)
    this.rooms[room_id].appendMessage(message)
    this.flush()
  }

  private createRoom(id: string, name?: string) {
    name = name || 'unknown'
    this.rooms[id] = new Room(name, id)
  }

  private flush() {
    this.on_dirty()
  }

}
