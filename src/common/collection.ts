export class Collection<T> {
  constructor(public readonly items: T[], public readonly totalCount: number) {}
}
