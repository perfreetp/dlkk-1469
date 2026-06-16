import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.scss'

export type StatusType = 
  | 'pending' 
  | 'ongoing' 
  | 'completed' 
  | 'pass' 
  | 'fail' 
  | 'rectify'
  | 'major'
  | 'minor'
  | 'verified'
  | 'closed'

interface StatusTagProps {
  status: StatusType
  text?: string
  size?: 'sm' | 'md'
}

const statusMap: Record<StatusType, { label: string; className: string }> = {
  pending: { label: '待核验', className: 'pending' },
  ongoing: { label: '进行中', className: 'ongoing' },
  completed: { label: '已完成', className: 'completed' },
  pass: { label: '通过', className: 'pass' },
  fail: { label: '不通过', className: 'fail' },
  rectify: { label: '待整改', className: 'rectify' },
  major: { label: '重大', className: 'major' },
  minor: { label: '一般', className: 'minor' },
  verified: { label: '已复核', className: 'verified' },
  closed: { label: '已关闭', className: 'closed' }
}

const StatusTag: React.FC<StatusTagProps> = ({ status, text, size = 'sm' }) => {
  const statusInfo = statusMap[status]
  const label = text || statusInfo?.label || status

  return (
    <View className={classnames(styles.statusTag, styles[statusInfo?.className || 'pending'], styles[size])}>
      <Text className={styles.text}>{label}</Text>
    </View>
  )
}

export default StatusTag
