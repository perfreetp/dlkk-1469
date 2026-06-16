import { IssueItem } from '@/types'

export const issueList: IssueItem[] = [
  {
    id: 'issue001',
    taskId: 'task006',
    orgName: '和美妇科诊所',
    itemName: '消防通道堵塞',
    description: '二楼西侧安全出口被杂物堵塞，疏散通道宽度不足1.2米，存在消防安全隐患。',
    photoUrl: 'https://picsum.photos/id/1082/400/300',
    severity: 'major',
    rectifyDeadline: '2024-06-24',
    status: 'rectifying',
    createdAt: '2024-06-16 10:30',
    handler: '王协管'
  },
  {
    id: 'issue002',
    taskId: 'task006',
    orgName: '和美妇科诊所',
    itemName: '医疗废物暂存不规范',
    description: '医疗废物暂存点无明显警示标识，未做到分类存放，感染性废物与损伤性废物混放。',
    photoUrl: 'https://picsum.photos/id/1039/400/300',
    severity: 'minor',
    rectifyDeadline: '2024-06-24',
    status: 'rectifying',
    createdAt: '2024-06-16 11:15',
    handler: '王协管'
  },
  {
    id: 'issue003',
    taskId: 'task001',
    orgName: '康泰综合门诊部',
    itemName: '执业人员资质公示不全',
    description: '部分医师执业范围未公示，3名新进护士资质信息未及时更新。',
    photoUrl: 'https://picsum.photos/id/1044/400/300',
    severity: 'minor',
    rectifyDeadline: '2024-06-20',
    status: 'pending',
    createdAt: '2024-06-17 09:45',
    handler: '李审批'
  },
  {
    id: 'issue004',
    taskId: 'task005',
    orgName: '博康体检中心',
    itemName: '消毒记录不完整',
    description: '口腔科消毒灭菌记录缺漏，近一个月高压灭菌设备运行日志不完整。',
    photoUrl: 'https://picsum.photos/id/1015/400/300',
    severity: 'minor',
    rectifyDeadline: '2024-06-19',
    status: 'verified',
    createdAt: '2024-06-17 08:50',
    handler: '张联合'
  },
  {
    id: 'issue005',
    taskId: 'task005',
    orgName: '博康体检中心',
    itemName: '急救设备状态检查',
    description: '急救车内部分药品过期，需立即更换并建立定期检查制度。',
    photoUrl: 'https://picsum.photos/id/1018/400/300',
    severity: 'major',
    rectifyDeadline: '2024-06-18',
    status: 'closed',
    createdAt: '2024-06-17 09:20',
    handler: '张联合'
  }
]

export const getIssueById = (id: string): IssueItem | undefined => {
  return issueList.find(issue => issue.id === id)
}

export const getIssuesByTaskId = (taskId: string): IssueItem[] => {
  return issueList.filter(issue => issue.taskId === taskId)
}

export const getIssuesByStatus = (status: IssueItem['status']): IssueItem[] => {
  return issueList.filter(issue => issue.status === status)
}
