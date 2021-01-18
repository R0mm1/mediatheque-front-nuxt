import FlagService from '@/assets/ts/service/FlagService'
import HistoryService from '@/assets/ts/service/HistoryService'
import EntityModuleFlagInterface from '~/assets/ts/store/EntityModuleFlagInterface'

// For Typescript convenience
export type EntityProxyServiceInterface<Type> = Type & {
  isProxy: boolean,
  target: Type
};

export default class EntityProxyService<Entity> {
    static isProxy = Symbol('isProxy');
    static target = Symbol('target');

    protected flagService: FlagService<EntityModuleFlagInterface>;
    protected _historyService: HistoryService;

    constructor (flagService: FlagService<EntityModuleFlagInterface>, historyService: HistoryService) {
      this.flagService = flagService
      this._historyService = historyService
    }

    set historyService (historyService: HistoryService) {
      this._historyService = historyService
    }

    get historyService () {
      return this._historyService
    }

    get (target: Entity, key: string | symbol) {
      if (key === EntityProxyService.isProxy) {
        return true
      }
      if (key === EntityProxyService.target) {
        return target
      }

      if (typeof key === 'string') {
        return (target as any)[key]
      }

      return undefined
    }

    set (target: Entity, key: string, newVal: any): boolean {
      let isModified = this.flagService.flags.isModified

      if (!isModified) { // if entity has already been modified, we keep the isModified flag to true
        if (typeof (target as any)[key] === 'string') {
          isModified = ((target as any)[key] !== newVal)
        } else if (typeof (target as any)[key] === 'undefined') {
          isModified = true
        } else {
          isModified = true
        }
      }

      this.flagService.flags.isModified = isModified
      this.historyService.addEntry(key, newVal, (target as any)[key]);

      (target as any)[key] = newVal

      return true
    }
}
