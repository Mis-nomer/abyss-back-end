export enum RoomTypeEnum {
  TEMP = 'temp', // Rooms that restricted to 2 users. Have
  SOLID = 'solid',
  ECHO = 'echo',
}

export enum LoggerTypeEnum {
  TRACE = 10,
  DEBUG = 20,
  INFO = 30,
  WARN = 40,
  ERROR = 50,
  FATAL = 60,
}

export enum LoggerColorEnum {
  TRACE = 'white',
  DEBUG = 'blue',
  INFO = 'green',
  WARN = 'orange',
  ERROR = 'red',
  FATAL = 'purple',
}

export enum MessageFlagEnum {
  FILE = 'file',
  COMMAND = 'command',
  LINK = 'link',
  IMAGE = 'image',
  DECORATE = 'decorate',
}
