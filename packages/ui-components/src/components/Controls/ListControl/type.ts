import { Dispatch, SetStateAction } from 'react'

export interface ListItemValue {
  id: string
  disabled?: boolean
  icon?: string
  title: string
}

export type FormikFunc = (field: string, value: any) => void
export type ListOnChange = Dispatch<SetStateAction<ListItemValue>> | ((val: ListItemValue) => void)
export type ListOnMultiChange = Dispatch<SetStateAction<ListItemValue[]>>

export interface ListContextProps {
  name?: string
  multiple?: boolean
  disabled?: boolean
  readOnly?: boolean
  visible: boolean
  placeholder: string
  setVisible: Dispatch<SetStateAction<boolean>>
  value: ListItemValue | ListItemValue[]
  onChange?: ListOnChange
  onMultiChange?: ListOnMultiChange
  onFormikChange?: FormikFunc
}
