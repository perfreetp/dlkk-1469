import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Task, VerifyCategory, VerifyItem, IssueItem } from '@/types'
import { taskList } from '@/data/tasks'
import { verifyCategories as defaultCategories } from '@/data/verify-items'
import { issueList } from '@/data/issues'

interface TaskVerifyData {
  categories: VerifyCategory[]
  issues: IssueItem[]
}

interface AppState {
  currentTaskId: string | null
  tasks: Task[]
  taskVerifyData: Record<string, TaskVerifyData>
  setCurrentTaskId: (taskId: string | null) => void
  getCurrentTask: () => Task | undefined
  getTaskVerifyData: (taskId: string) => TaskVerifyData
  updateVerifyItem: (taskId: string, itemId: string, updates: Partial<VerifyItem>) => void
  updateCheckPoint: (taskId: string, itemId: string, checkPointId: string, checked: boolean) => void
  addPhoto: (taskId: string, itemId: string, photo: string) => void
  removePhoto: (taskId: string, itemId: string, index: number) => void
  addIssue: (taskId: string, issue: Omit<IssueItem, 'id' | 'createdAt' | 'handler'>) => void
  updateIssueStatus: (issueId: string, status: IssueItem['status']) => void
  updateTaskStatus: (taskId: string, status: Task['status']) => void
  getAllIssues: () => IssueItem[]
  getIssuesByTaskId: (taskId: string) => IssueItem[]
  resetTaskVerifyData: (taskId: string) => void
}

const initializeTaskVerifyData = (): Record<string, TaskVerifyData> => {
  const data: Record<string, TaskVerifyData> = {}
  taskList.forEach(task => {
    data[task.id] = {
      categories: JSON.parse(JSON.stringify(defaultCategories)),
      issues: issueList.filter(issue => issue.taskId === task.id)
    }
  })
  return data
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentTaskId: null,
      tasks: [...taskList],
      taskVerifyData: initializeTaskVerifyData(),

      setCurrentTaskId: (taskId) => set({ currentTaskId: taskId }),

      getCurrentTask: () => {
        const { currentTaskId, tasks } = get()
        return tasks.find(t => t.id === currentTaskId)
      },

      getTaskVerifyData: (taskId) => {
        const { taskVerifyData } = get()
        if (!taskVerifyData[taskId]) {
          const newData: TaskVerifyData = {
            categories: JSON.parse(JSON.stringify(defaultCategories)),
            issues: issueList.filter(issue => issue.taskId === taskId)
          }
          set(state => ({
            taskVerifyData: {
              ...state.taskVerifyData,
              [taskId]: newData
            }
          }))
          return newData
        }
        return taskVerifyData[taskId]
      },

      updateVerifyItem: (taskId, itemId, updates) => set(state => {
        const taskData = state.taskVerifyData[taskId]
        if (!taskData) return state

        const newCategories = taskData.categories.map(category => ({
          ...category,
          items: category.items.map(item => {
            if (item.id === itemId) {
              return { ...item, ...updates }
            }
            return item
          })
        }))

        const updatedCategories = newCategories.map(category => {
          const completed = category.items.filter(item => item.status !== 'pending').length
          return { ...category, completed, total: category.items.length }
        })

        return {
          taskVerifyData: {
            ...state.taskVerifyData,
            [taskId]: {
              ...taskData,
              categories: updatedCategories
            }
          }
        }
      }),

      updateCheckPoint: (taskId, itemId, checkPointId, checked) => set(state => {
        const taskData = state.taskVerifyData[taskId]
        if (!taskData) return state

        const newCategories = taskData.categories.map(category => ({
          ...category,
          items: category.items.map(item => {
            if (item.id === itemId) {
              const newCheckPoints = item.checkPoints.map(cp => {
                if (cp.id === checkPointId) {
                  return {
                    ...cp,
                    checked,
                    result: (checked ? 'pass' : 'na') as 'pass' | 'fail' | 'na'
                  }
                }
                return cp
              })
              return { ...item, checkPoints: newCheckPoints }
            }
            return item
          })
        }))

        return {
          taskVerifyData: {
            ...state.taskVerifyData,
            [taskId]: {
              ...taskData,
              categories: newCategories
            }
          }
        }
      }),

      addPhoto: (taskId, itemId, photo) => set(state => {
        const taskData = state.taskVerifyData[taskId]
        if (!taskData) return state

        const newCategories = taskData.categories.map(category => ({
          ...category,
          items: category.items.map(item => {
            if (item.id === itemId) {
              const newPhotos = [...item.photos, photo].slice(0, 9)
              return { ...item, photos: newPhotos }
            }
            return item
          })
        }))

        return {
          taskVerifyData: {
            ...state.taskVerifyData,
            [taskId]: {
              ...taskData,
              categories: newCategories
            }
          }
        }
      }),

      removePhoto: (taskId, itemId, index) => set(state => {
        const taskData = state.taskVerifyData[taskId]
        if (!taskData) return state

        const newCategories = taskData.categories.map(category => ({
          ...category,
          items: category.items.map(item => {
            if (item.id === itemId) {
              const newPhotos = item.photos.filter((_, i) => i !== index)
              return { ...item, photos: newPhotos }
            }
            return item
          })
        }))

        return {
          taskVerifyData: {
            ...state.taskVerifyData,
            [taskId]: {
              ...taskData,
              categories: newCategories
            }
          }
        }
      }),

      addIssue: (taskId, issue) => set(state => {
        const taskData = state.taskVerifyData[taskId]
        const tasks = state.tasks
        const task = tasks.find(t => t.id === taskId)
        
        const newIssue: IssueItem = {
          ...issue,
          id: `issue_${Date.now()}`,
          createdAt: new Date().toLocaleString('zh-CN', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }).replace(/\//g, '-'),
          handler: '李协管员'
        }

        const newIssues = taskData 
          ? [...taskData.issues, newIssue]
          : [newIssue]

        const updatedTasks = tasks.map(t => {
          if (t.id === taskId && t.status === 'completed') {
            return { ...t, status: 'rectify' as const }
          }
          return t
        })

        return {
          tasks: updatedTasks,
          taskVerifyData: {
            ...state.taskVerifyData,
            [taskId]: {
              ...taskData,
              categories: taskData?.categories || JSON.parse(JSON.stringify(defaultCategories)),
              issues: newIssues
            }
          }
        }
      }),

      updateIssueStatus: (issueId, status) => set(state => {
        const newTaskVerifyData = { ...state.taskVerifyData }
        
        Object.keys(newTaskVerifyData).forEach(taskId => {
          newTaskVerifyData[taskId] = {
            ...newTaskVerifyData[taskId],
            issues: newTaskVerifyData[taskId].issues.map(issue => {
              if (issue.id === issueId) {
                return { ...issue, status }
              }
              return issue
            })
          }
        })

        return { taskVerifyData: newTaskVerifyData }
      }),

      updateTaskStatus: (taskId, status) => set(state => {
        const newTasks = state.tasks.map(task => {
          if (task.id === taskId) {
            return { ...task, status }
          }
          return task
        })

        return { tasks: newTasks }
      }),

      getAllIssues: () => {
        const { taskVerifyData } = get()
        const allIssues: IssueItem[] = []
        Object.values(taskVerifyData).forEach(data => {
          allIssues.push(...data.issues)
        })
        return allIssues
      },

      getIssuesByTaskId: (taskId) => {
        const { taskVerifyData } = get()
        return taskVerifyData[taskId]?.issues || []
      },

      resetTaskVerifyData: (taskId) => set(state => {
        return {
          taskVerifyData: {
            ...state.taskVerifyData,
            [taskId]: {
              categories: JSON.parse(JSON.stringify(defaultCategories)),
              issues: issueList.filter(issue => issue.taskId === taskId)
            }
          }
        }
      })
    }),
    {
      name: 'medical-verify-storage'
    }
  )
)
