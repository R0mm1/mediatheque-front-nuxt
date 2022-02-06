class EventService {
  private static service: EventService

  private callbacks: { event: string, callback: Function }[] = []

  private constructor () {
  }

  static getService () {
    if (typeof EventService.service === 'undefined') {
      EventService.service = new EventService()
    }
    return EventService.service
  }

  on (event: string, execute: Function) {
    this.callbacks.push({
      event,
      callback: execute
    })
  }

  trigger (event: string) {
    this.callbacks.forEach((callback) => {
      if (callback.event === event) {
        callback.callback()
      }
    })
  }
}

export default EventService
