export interface SuccessResponse<Data> {
  message: string;
  data: Data;
}
export interface ErrorResponse<Data> {
  message: string;
  data?: Data;
}

// //  cú phápn '-?' sẽ loại bỏ cái key opitonal (hande?)
// // nó sẽ loai bỏ undefined ủa key optional
// export type NoUndefinedField<T> = {
//   [P in keyof T]-?: NoUndefinedField<NonNullable<T>[P]>
// }
