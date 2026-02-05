import { userHandlers } from './user'
import { stockHandlers } from './stock'

export const handlers = [
  ...userHandlers,
  ...stockHandlers,
]
