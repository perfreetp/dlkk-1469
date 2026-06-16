import { VerifyCategory, VerifyItem, CheckPoint } from '@/types'

const generateCheckPoints = (names: string[]): CheckPoint[] => {
  return names.map((name, index) => ({
    id: `cp_${index}`,
    name,
    checked: false,
    result: 'na' as const
  }))
}

export const verifyCategories: VerifyCategory[] = [
  {
    id: 'cat001',
    name: '机构标识',
    icon: '🏥',
    total: 2,
    completed: 1,
    items: [
      {
        id: 'item001',
        name: '门头名称核对',
        categoryId: 'cat001',
        categoryName: '机构标识',
        description: '核对机构门头名称与执业登记申报名称是否一致',
        requirement: '机构门头悬挂的名称必须与《医疗机构执业许可证》核准的名称完全一致',
        status: 'pass',
        photos: ['https://picsum.photos/id/1036/400/300'],
        remark: '门头名称与申报名称一致，字体清晰',
        checkPoints: generateCheckPoints([
          '门头名称与申报名称一致',
          '名称字号规范清晰',
          '悬挂位置醒目',
          '无擅自增删名称字样'
        ])
      },
      {
        id: 'item002',
        name: '执业许可证公示',
        categoryId: 'cat001',
        categoryName: '机构标识',
        description: '检查《医疗机构执业许可证》是否在醒目位置公示',
        requirement: '必须在诊疗场所醒目位置悬挂《医疗机构执业许可证》正本',
        status: 'pending',
        photos: [],
        remark: '',
        checkPoints: generateCheckPoints([
          '执业许可证正本悬挂醒目',
          '证照在有效期内',
          '诊疗科目与许可一致',
          '法定代表人/主要负责人一致'
        ])
      }
    ]
  },
  {
    id: 'cat002',
    name: '诊疗区域',
    icon: '📐',
    total: 4,
    completed: 0,
    items: [
      {
        id: 'item003',
        name: '诊疗区域与平面图相符',
        categoryId: 'cat002',
        categoryName: '诊疗区域',
        description: '逐项检查实际诊疗区域布局与申报平面图是否相符',
        requirement: '实际诊疗区域布局、面积、功能分区应与申报平面图一致',
        status: 'pending',
        photos: [],
        remark: '',
        checkPoints: generateCheckPoints([
          '总体布局与平面图一致',
          '诊疗科目科室设置齐全',
          '各功能分区合理',
          '通道流线符合要求'
        ])
      },
      {
        id: 'item004',
        name: '诊室设置',
        categoryId: 'cat002',
        categoryName: '诊疗区域',
        description: '检查各诊室设置是否符合规范',
        requirement: '每诊室净面积不少于10平方米，诊桌、诊椅、诊察床等基本设施齐全',
        status: 'pending',
        photos: [],
        remark: '',
        checkPoints: generateCheckPoints([
          '诊室面积达标',
          '基本设施齐全',
          '诊疗环境整洁',
          '隐私保护设施完善'
        ])
      },
      {
        id: 'item005',
        name: '治疗室设置',
        categoryId: 'cat002',
        categoryName: '诊疗区域',
        description: '检查治疗室设置是否符合规范',
        requirement: '治疗室独立设置，分区明确，设施齐全',
        status: 'pending',
        photos: [],
        remark: '',
        checkPoints: generateCheckPoints([
          '治疗室独立设置',
          '清洁区/污染区分区明确',
          '治疗台/柜设施齐全',
          '消毒设施到位'
        ])
      },
      {
        id: 'item006',
        name: '药房设置',
        categoryId: 'cat002',
        categoryName: '诊疗区域',
        description: '检查药房/药柜设置是否符合规范',
        requirement: '药房与诊疗面积相适应，药品分类存放，阴凉冷藏设施齐全',
        status: 'pending',
        photos: [],
        remark: '',
        checkPoints: generateCheckPoints([
          '药房/药柜设置规范',
          '药品分类存放',
          '阴凉冷藏设施齐全',
          '特殊药品管理到位'
        ])
      }
    ]
  },
  {
    id: 'cat003',
    name: '设备核验',
    icon: '🩺',
    total: 3,
    completed: 0,
    items: [
      {
        id: 'item007',
        name: '基本诊疗设备',
        categoryId: 'cat003',
        categoryName: '设备核验',
        description: '核验主要诊疗设备是否到位且能正常使用',
        requirement: '基本设备按申报清单配齐，设备状态良好能正常使用',
        status: 'pending',
        photos: [],
        remark: '',
        checkPoints: generateCheckPoints([
          '诊察床配置齐全',
          '血压计/听诊器到位',
          '体温计/压舌板等耗材',
          '急救设备状态良好'
        ])
      },
      {
        id: 'item008',
        name: '专科设备',
        categoryId: 'cat003',
        categoryName: '设备核验',
        description: '核验专科诊疗设备是否到位',
        requirement: '各诊疗科目所需专科设备按申报清单配备到位',
        status: 'pending',
        photos: [],
        remark: '',
        checkPoints: generateCheckPoints([
          '专科设备配备齐全',
          '设备处于正常可用状态',
          '设备定期检测合格',
          '设备操作规程公示'
        ])
      },
      {
        id: 'item009',
        name: '消毒设备',
        categoryId: 'cat003',
        categoryName: '设备核验',
        description: '核验消毒设备设施是否齐全',
        requirement: '消毒设备设施齐全，能满足诊疗消毒需求',
        status: 'pending',
        photos: [],
        remark: '',
        checkPoints: generateCheckPoints([
          '高压灭菌设备到位',
          '消毒药械齐全有效',
          '洗手设施完善',
          '消毒记录完整'
        ])
      }
    ]
  },
  {
    id: 'cat004',
    name: '人员核验',
    icon: '👨‍⚕️',
    total: 2,
    completed: 0,
    items: [
      {
        id: 'item010',
        name: '执业人员在岗情况',
        categoryId: 'cat004',
        categoryName: '人员核验',
        description: '抽查执业人员在岗情况及岗位匹配度',
        requirement: '在岗医务人员均具备相应执业资格，执业范围与岗位匹配',
        status: 'pending',
        photos: [],
        remark: '',
        checkPoints: generateCheckPoints([
          '医师在岗且执业范围相符',
          '护士在岗且注册有效',
          '医技人员资质齐全',
          '人员配备满足诊疗需求'
        ])
      },
      {
        id: 'item011',
        name: '人员资质公示',
        categoryId: 'cat004',
        categoryName: '人员核验',
        description: '检查医务人员资质是否按规定公示',
        requirement: '医务人员信息（姓名、职务/职称、执业范围）在醒目位置公示',
        status: 'pending',
        photos: [],
        remark: '',
        checkPoints: generateCheckPoints([
          '医务人员信息公示',
          '照片/姓名/职称齐全',
          '执业范围标注清晰',
          '公示位置醒目'
        ])
      }
    ]
  },
  {
    id: 'cat005',
    name: '消防通道',
    icon: '🚒',
    total: 3,
    completed: 0,
    items: [
      {
        id: 'item012',
        name: '消防通道畅通',
        categoryId: 'cat005',
        categoryName: '消防通道',
        description: '检查消防通道是否畅通',
        requirement: '疏散通道、安全出口保持畅通，无堵塞、无占用',
        status: 'pending',
        photos: [],
        remark: '',
        checkPoints: generateCheckPoints([
          '疏散通道畅通无阻',
          '安全出口畅通',
          '应急照明正常',
          '疏散指示标志清晰'
        ])
      },
      {
        id: 'item013',
        name: '消防设施配置',
        categoryId: 'cat005',
        categoryName: '消防通道',
        description: '检查消防设施配置是否齐全有效',
        requirement: '按规定配置消防器材，定期检查，状态良好',
        status: 'pending',
        photos: [],
        remark: '',
        checkPoints: generateCheckPoints([
          '灭火器配置齐全',
          '灭火器在有效期内',
          '消火栓设施完好',
          '消防标识清晰'
        ])
      },
      {
        id: 'item014',
        name: '消防安全管理',
        categoryId: 'cat005',
        categoryName: '消防通道',
        description: '检查消防安全管理制度落实情况',
        requirement: '消防安全管理制度健全，定期开展消防演练',
        status: 'pending',
        photos: [],
        remark: '',
        checkPoints: generateCheckPoints([
          '消防安全制度健全',
          '消防责任人明确',
          '定期开展消防培训',
          '消防演练记录完整'
        ])
      }
    ]
  },
  {
    id: 'cat006',
    name: '感染防控',
    icon: '🦠',
    total: 3,
    completed: 0,
    items: [
      {
        id: 'item015',
        name: '消毒隔离制度',
        categoryId: 'cat006',
        categoryName: '感染防控',
        description: '检查消毒隔离制度落实情况',
        requirement: '消毒隔离制度健全并有效落实',
        status: 'pending',
        photos: [],
        remark: '',
        checkPoints: generateCheckPoints([
          '消毒隔离制度健全',
          '消毒操作规范执行',
          '消毒记录完整',
          '医疗废物分类处置'
        ])
      },
      {
        id: 'item016',
        name: '医疗废物处置',
        categoryId: 'cat006',
        categoryName: '感染防控',
        description: '检查医疗废物分类收集和处置情况',
        requirement: '医疗废物分类收集，存放规范，处置合规',
        status: 'pending',
        photos: [],
        remark: '',
        checkPoints: generateCheckPoints([
          '医疗废物分类收集',
          '专用包装袋/容器',
          '暂存场所符合要求',
          '转移联单制度执行'
        ])
      },
      {
        id: 'item017',
        name: '手卫生设施',
        categoryId: 'cat006',
        categoryName: '感染防控',
        description: '检查手卫生设施配置情况',
        requirement: '诊疗区域手卫生设施齐全，洗手/手消毒设备配备到位',
        status: 'pending',
        photos: [],
        remark: '',
        checkPoints: generateCheckPoints([
          '洗手设施配置齐全',
          '手消液配备到位',
          '干手用品齐全',
          '手卫生标识清晰'
        ])
      }
    ]
  }
]

export const getVerifyItemById = (id: string): VerifyItem | undefined => {
  for (const category of verifyCategories) {
    const item = category.items.find(item => item.id === id)
    if (item) return item
  }
  return undefined
}

export const getCategoryById = (id: string): VerifyCategory | undefined => {
  return verifyCategories.find(cat => cat.id === id)
}
