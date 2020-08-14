export class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string | null) {
    if (data === null) {
      return data;
    }
    return Number(data);
  }
}
