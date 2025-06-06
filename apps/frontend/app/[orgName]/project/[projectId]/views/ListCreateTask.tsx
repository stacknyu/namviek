import { ETaskFilterGroupByType } from '@/features/TaskFilter/context'
import useOutsideClick from '@/hooks/useOutsideClick'
import { useServiceTaskAdd } from '@/hooks/useServiceTaskAdd'
import { useUser } from '@auth-client'
import { Task, TaskPriority } from '@prisma/client'
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState, KeyboardEvent } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'

interface IListCreateTaskProps {
  type: ETaskFilterGroupByType
  groupId: string
}

export default function ListCreateTask({
  type,
  groupId
}: IListCreateTaskProps) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLInputElement>(null)
  const { taskCreateOne } = useServiceTaskAdd()
  const { projectId } = useParams()
  const { user } = useUser()

  const handleClickOutside = () => {
    if (visible) {
      setVisible(false)
      ref.current && (ref.current.value = '')
    }
  }

  useOutsideClick(ref, handleClickOutside)

  useEffect(() => {
    if (ref.current) {
      const inp = ref.current

      visible && inp.focus()
    }
  }, [visible])

  const onKeyup = (ev: KeyboardEvent<HTMLInputElement>) => {
    const key = ev.key
    const target = ev.target as HTMLInputElement
    const userId = user?.id;

    if (key.toLowerCase() === 'escape') {
      setVisible(false)
      target.value = ''
      return
    }

    if (key !== 'Enter') return

    const value = target.value

    const data: Partial<Task> = {
      dueDate: new Date(),
      title: value,
      projectId
    }

    if (userId) {
      data.assigneeIds = [userId]
    }

    if (type === ETaskFilterGroupByType.STATUS) {
      data.taskStatusId = groupId
    }

    if (type === ETaskFilterGroupByType.ASSIGNEE && groupId) {
      data.assigneeIds = [groupId]
    }

    if (type === ETaskFilterGroupByType.PRIORITY) {
      data.priority = groupId as TaskPriority
    }

    taskCreateOne(data)

    target.value = ''
  }

  return (
    <div
      onClick={() => {
        setVisible(true)
      }}
      className={`cursor-pointer group px-3 py-2 text-sm rounded-b-md flex items-center justify-between ${
        visible ? 'bg-gray-50 dark:bg-gray-800' : ''
      }`}>
      <div className="flex items-center gap-2 w-full">
        <AiOutlinePlus
          className={`text-gray-500 shrink-0 ${
            visible ? 'text-indigo-500' : ''
          }`}
        />
        <span
          className={`text-gray-400 cursor-pointer group-hover:text-gray-500 ${
            visible ? 'hidden' : ''
          }`}
          onClick={() => setVisible(true)}>
          Create new task
        </span>
        <input
          ref={ref}
          onKeyUp={onKeyup}
          placeholder="Input task name and press Enter to create"
          className={`bg-transparent outline-none w-full ${
            visible ? '' : 'hidden'
          }`}
        />
      </div>
    </div>
  )
}
