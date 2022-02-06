interface HistoryEntryInterface {
    field: string,
    newVal: any,
    oldVal: any,
    timestamp: number,
    rollback?: Function
}

export default class HistoryService {
  _history: HistoryEntryInterface[] = []

  get history () {
    return this._history
  }

  set history (history: HistoryEntryInterface[]) {
    this._history = history
  }

  init () {
    this.history = []
  }

  addEntry (field: string, newVal: any, oldVal: any, rollback?: Function) {
    this.history.push({
      field,
      newVal,
      oldVal,
      timestamp: Date.now(),
      rollback
    })
  }

  getLastFieldModification (field: string): HistoryEntryInterface | undefined {
    let result
    for (const historyEntry of this.history.reverse()) {
      if (historyEntry.field === field) {
        result = historyEntry
        break
      }
    }
    return result
  }
}
