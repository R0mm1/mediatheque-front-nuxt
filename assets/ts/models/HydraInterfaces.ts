export interface HydraItem{
  '@context': string
  '@id': string
  '@type': string
}

type HydraCollectionMember<Type> = {
  '@id': string
  '@type': string
} & Type

export interface HydraCollection<Type> extends HydraItem{
  'hydra:member': HydraCollectionMember<Type>[]
}
