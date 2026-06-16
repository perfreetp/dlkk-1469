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
  updateVerifyItem: (taskId: string, itemId: string, updates: Partial<VerifyItem>) => void
  updateCheckPoint: (taskId: string, itemId: string, checkPointId: string, checked: boolean) => void
  addPhoto: (taskId: string, itemId: string, photo: string) => void
  removePhoto: (taskId: string, itemId: string, index: number) => void
  upsertIssue: (taskId: string, issue: Omit<IssueItem, 'id' | 'createdAt' | 'handler'>) => void
  updateIssue: (issueId: string, updates: Partial<IssueItem>) => void
  updateTaskStatus: (taskId: string, status: Task['status']) => void
  resetTaskVerifyData: (taskId: string) => void
}

const initData = (): Record<string, TaskVerifyData> => {
  const data: Record<string, TaskVerifyData> = {}
  taskList.forEach(task => {
    const taskIssues = issueList
      .filter(issue => issue.taskId === task.id)
      .map(issue => ({
        ...issue,
        location: issue.location || '现场核查',
        rectifyPhotos: issue.rectifyPhotos || [],
        rectifyNote: issue.rectifyNote || ''
      }))
    data[task.id] = {
      categories: JSON.parse(JSON.stringify(defaultCategories)),
      issues: taskIssues
    }
  })
  return data
}

const recalcCategoryProgress = (categories: VerifyCategory[]) => {
  return categories.map(category => ({
    ...category,
    completed: category.items.filter(item => item.status !== 'pending').length,
    total: category.items.length
  }))
}

const nowStr = () =>
  new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(/\//g, '-')

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentTaskId: null,
      tasks: [...taskList],
      taskVerifyData: initData(),

      setCurrentTaskId: (taskId) => set({ currentTaskId: taskId }),

      updateVerifyItem: (taskId, itemId, updates) => set(state => {
        const taskData = state.taskVerifyData[taskId]
        if (!taskData) return state

        const newCategories = recalcCategoryProgress(
          taskData.categories.map(category => ({
            ...category,
            items: category.items.map(item =>
              item.id === itemId ? { ...item, ...updates } : item
            )
          }))
        )

        return {
          taskVerifyData: {
            ...state.taskVerifyData,
            [taskId]: { ...taskData, categories: newCategories }
          }
        }
      }),

      updateCheckPoint: (taskId, itemId, checkPointId, checked) => set(state => {
        const taskData = state.taskVerifyData[taskId]
        if (!taskData) return state

        const newCategories = taskData.categories.map(category => ({
          ...category,
          items: category.items.map(item => {
            if (item.id !== itemId) return item
            return {
              ...item,
              checkPoints: item.checkPoints.map(cp =>
                cp.id === checkPointId
                  ? { ...cp, checked, result: checked ? 'pass' : 'na' as const }
                  : cp
              )
            }
          })
        }))

        return {
          taskVerifyData: {
            ...state.taskVerifyData,
            [taskId]: { ...taskData, categories: newCategories }
          }
        }
      }),

      addPhoto: (taskId, itemId, photo) => set(state => {
        const taskData = state.taskVerifyData[taskId]
        if (!taskData) return state

        const newCategories = taskData.categories.map(category => ({
          ...category,
          items: category.items.map(item => {
            if (item.id !== itemId) return item
            const newPhotos = [...item.photos, photo].slice(0, 9)
            return { ...item, photos: newPhotos }
          })
        }))

        return {
          taskVerifyData: {
            ...state.taskVerifyData,
            [taskId]: { ...taskData, categories: newCategories }
          }
        }
      }),

      removePhoto: (taskId, itemId, index) => set(state => {
        const taskData = state.taskVerifyData[taskId]
        if (!taskData) return state

        const newCategories = taskData.categories.map(category => ({
          ...category,
          items: category.items.map(item => {
            if (item.id !== itemId) return item
            const newPhotos = item.photos.filter((_, i) => i !== index)
            return { ...item, photos: newPhotos }
          })
        }))

        return {
          taskVerifyData: {
            ...state.taskVerifyData,
            [taskId]: { ...taskData, categories: newCategories }
          }
        }
      }),

      upsertIssue: (taskId, issue) => set(state => {
        const taskData = state.taskVerifyData[taskId] || {
          categories: JSON.parse(JSON.stringify(defaultCategories)),
          issues: []
        }

        const existing = taskData.issues.find(
          i => i.taskId === issue.taskId && i.itemName === issue.itemName
        )

        let newIssues: IssueItem[]

        if (existing) {
          newIssues = taskData.issues.map(i =>
            i.id === existing.id
              ? {
                  ...i,
                  location: issue.location || i.location,
                  description: issue.description || i.description,
                  severity: issue.severity || i.severity,
                  rectifyDeadline: issue.rectifyDeadline || i.rectifyDeadline,
                  photoUrl: issue.photoUrl || i.photoUrl,
                  status: 'pending' as const
                }
              : i
          )
        } else {
          const newIssue: IssueItem = {
            ...issue,
            id: `issue_${Date.now()}`,
            createdAt: nowStr(),
            handler: '李协管员',
            rectifyPhotos: [],
            rectifyNote: ''
          }
          newIssues = [...taskData.issues, newIssue]
        }

        const updatedTasks = state.tasks.map(t =>
          t.id === taskId && t.status === 'completed'
            ? { ...t, status: 'rectify' as const }
            : t
        )

        return {
          tasks: updatedTasks,
          taskVerifyData: {
            ...state.taskVerifyData,
            [taskId]: { ...taskData, issues: newIssues }
          }
        }
      }),

      updateIssue: (issueId, updates) => set(state => {
        const newTaskVerifyData = { ...state.taskVerifyData }
        Object.keys(newTaskVerifyData).forEach(taskId => {
          newTaskVerifyData[taskId] = {
            ...newTaskVerifyData[taskId],
            issues: newTaskVerifyData[taskId].issues.map(issue =>
              issue.id === issueId ? { ...issue, ...updates } : issue
            )
          }
        })
        return { taskVerifyData: newTaskVerifyData }
      }),

      updateTaskStatus: (taskId, status) => set(state => ({
        tasks: state.tasks.map(task =>
          task.id === taskId ? { ...task, status } : task
        )
      })),

      resetTaskVerifyData: (taskId) => set(state => ({
        taskVerifyData: {
          ...state.taskVerifyData,
          [taskId]: {
            categories: JSON.parse(JSON.stringify(defaultCategories)),
            issues: issueList
              .filter(issue => issue.taskId === taskId)
              .map(issue => ({
                ...issue,
                location: issue.location || '现场核查',
                rectifyPhotos: issue.rectifyPhotos || [],
                rectifyNote: issue.rectifyNote || ''
              }))
          }
        }
      }))
    }),
    {
      name: 'medical-verify-storage-v3'
    }
  )
)

export const useCurrentTask = () =>
  useAppStore(state => {
    if (!state.currentTaskId) return undefined
    return state.tasks.find(t => t.id === state.currentTaskId)
  })

export const useTaskCategories = (taskId: string) =>
  useAppStore(state => state.taskVerifyData[taskId]?.categories || [])

export const useTaskIssues = (taskId: string) =>
  useAppStore(state => state.taskVerifyData[taskId]?.issues || [])

export const useAllIssues = () =>
  useAppStore(state => {
    const all: IssueItem[] = []
    Object.values(state.taskVerifyData).forEach(data => {
      all.push(...data.issues)
    })
    return all
  })

export const useVerifyItem = (taskId: string, itemId: string) =>
  useAppStore(state => {
    const categories = state.taskVerifyData[taskId]?.categories || []
    for (const cat of categories) {
      const item = cat.items.find(i => i.id === itemId)
      if (item) return item
    }
    return undefined
  })
