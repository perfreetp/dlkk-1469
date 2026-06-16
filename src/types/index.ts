export interface Task {
  id: string
  orgName: string
  orgAddress: string
  orgType: string
  appointmentTime: string
  routeIndex: number
  status: 'pending' | 'ongoing' | 'completed' | 'rectify'
  verifyItems: VerifyItem[]
  contactPerson: string
  contactPhone: string
  businessScope: string
  floorPlanUrl: string
}

export interface VerifyCategory {
  id: string
  name: string
  icon: string
  total: number
  completed: number
  items: VerifyItem[]
}

export interface VerifyItem {
  id: string
  name: string
  categoryId: string
  categoryName: string
  description: string
  requirement: string
  status: 'pending' | 'pass' | 'fail' | 'rectify'
  photos: string[]
  remark: string
  checkPoints: CheckPoint[]
}

export interface CheckPoint {
  id: string
  name: string
  checked: boolean
  result: 'pass' | 'fail' | 'na'
}

export interface IssueItem {
  id: string
  taskId: string
  orgName: string
  itemName: string
  location: string
  description: string
  photoUrl: string
  severity: 'major' | 'minor'
  rectifyDeadline: string
  status: 'pending' | 'rectifying' | 'verified' | 'closed'
  createdAt: string
  handler: string
  rectifyPhotos?: string[]
  rectifyNote?: string
}

export interface UserInfo {
  name: string
  department: string
  position: string
  avatar: string
  phone: string
}

export interface VerifySummary {
  taskId: string
  orgName: string
  verifyTime: string
  totalItems: number
  passItems: number
  failItems: number
  rectifyItems: number
  conclusion: 'pass' | 'fail' | 'rectify'
  issues: string[]
  signature?: string
}
