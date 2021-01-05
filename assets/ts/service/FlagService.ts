export default class FlagService<FlagInterface> {
    _initialState: FlagInterface;
    flags: FlagInterface;

    constructor (flags: FlagInterface) {
      this._initialState = { ...flags }
      this.flags = flags
    }

    reset () {
      this.flags = { ...this._initialState }
    }
}
