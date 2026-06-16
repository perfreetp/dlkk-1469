import { Task } from '@/types'

export const taskList: Task[] = [
  {
    id: 'task001',
    orgName: '康泰综合门诊部',
    orgAddress: '朝阳区建国路88号SOHO现代城1层',
    orgType: '综合门诊部',
    appointmentTime: '2024-06-17 09:00',
    routeIndex: 1,
    status: 'ongoing',
    contactPerson: '张主任',
    contactPhone: '138****1234',
    businessScope: '内科、外科、妇科、检验科、医学影像科',
    floorPlanUrl: 'https://picsum.photos/id/1036/750/500',
    verifyItems: []
  },
  {
    id: 'task002',
    orgName: '仁爱中医诊所',
    orgAddress: '海淀区中关村大街27号中关村大厦2层',
    orgType: '中医诊所',
    appointmentTime: '2024-06-17 10:30',
    routeIndex: 2,
    status: 'pending',
    contactPerson: '李大夫',
    contactPhone: '139****5678',
    businessScope: '中医科、针灸科、推拿科',
    floorPlanUrl: 'https://picsum.photos/id/1039/750/500',
    verifyItems: []
  },
  {
    id: 'task003',
    orgName: '益康口腔门诊部',
    orgAddress: '西城区金融街15号金融街购物中心3层',
    orgType: '口腔门诊部',
    appointmentTime: '2024-06-17 14:00',
    routeIndex: 3,
    status: 'pending',
    contactPerson: '王院长',
    contactPhone: '137****9012',
    businessScope: '口腔科、口腔修复专业、口腔正畸专业',
    floorPlanUrl: 'https://picsum.photos/id/1044/750/500',
    verifyItems: []
  },
  {
    id: 'task004',
    orgName: '明视眼科诊所',
    orgAddress: '东城区东直门外大街48号东方银座1层',
    orgType: '眼科诊所',
    appointmentTime: '2024-06-17 15:30',
    routeIndex: 4,
    status: 'pending',
    contactPerson: '陈医生',
    contactPhone: '136****3456',
    businessScope: '眼科、医学验光配镜',
    floorPlanUrl: 'https://picsum.photos/id/1015/750/500',
    verifyItems: []
  },
  {
    id: 'task005',
    orgName: '博康体检中心',
    orgAddress: '丰台区南三环西路16号搜宝商务中心5层',
    orgType: '体检中心',
    appointmentTime: '2024-06-17 08:30',
    routeIndex: 0,
    status: 'completed',
    contactPerson: '刘主任',
    contactPhone: '135****7890',
    businessScope: '内科、外科、妇科、眼科、耳鼻喉科、检验科、影像科',
    floorPlanUrl: 'https://picsum.photos/id/1018/750/500',
    verifyItems: []
  },
  {
    id: 'task006',
    orgName: '和美妇科诊所',
    orgAddress: '石景山区古城大街1号古城星座2层',
    orgType: '妇科诊所',
    appointmentTime: '2024-06-16 09:00',
    routeIndex: 0,
    status: 'rectify',
    contactPerson: '赵院长',
    contactPhone: '134****2345',
    businessScope: '妇科专业、计划生育专业',
    floorPlanUrl: 'https://picsum.photos/id/1082/750/500',
    verifyItems: []
  }
]

export const getTaskById = (id: string): Task | undefined => {
  return taskList.find(task => task.id === id)
}

export const getTodayTasks = (): Task[] => {
  return taskList.filter(task => task.appointmentTime.startsWith('2024-06-17'))
}
