import { HydraCollection, HydraItem } from '~/assets/ts/models/HydraInterfaces'

export interface Editor{
  id?: number;
  name?: string;
}

export interface EditorItem extends Editor, HydraItem{}

export interface EditorCollection extends HydraCollection<Editor>{}
