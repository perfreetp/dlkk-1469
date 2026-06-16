import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import StatusTag from '../StatusTag'
import { Task } from '@/types'
import styles from './index.module.scss'

interface TaskCardProps {
  task: Task
  onClick?: () => void
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      Taro.navigateTo({
        url: `/pages/org-detail/index?id=${task.id}`
      })
    }
  }

  return (
    <View className={styles.taskCard} onClick={handleClick}>
      <View className={styles.cardHeader}>
        <View className={styles.routeBadge}>
          <Text className={styles.routeText}>第{task.routeIndex}站</Text>
        </View>
        <StatusTag status={task.status} size="sm" />
      </View>

      <View className={styles.orgInfo}>
        <Text className={styles.orgName}>{task.orgName}</Text>
        <Text className={styles.orgType}>{task.orgType}</Text>
      </View>

      <View className={styles.detailRow}>
        <Text className={styles.icon}>📍</Text>
        <Text className={styles.detailText}>{task.orgAddress}</Text>
      </View>

      <View className={styles.detailRow}>
        <Text className={styles.icon}>⏰</Text>
        <Text className={styles.detailText}>预约时间：{task.appointmentTime.slice(11)}</Text>
      </View>

      <View className={styles.cardFooter}>
        <View className={styles.contactInfo}>
          <Text className={styles.contactText}>联系人：{task.contactPerson}</Text>
          <Text className={styles.contactText}>{task.contactPhone}</Text>
        </View>
        <View className={styles.arrowBtn}>
          <Text className={styles.arrowText}>查看详情</Text>
          <Text className={styles.arrowIcon}>›</Text>
        </View>
      </View>
    </View>
  )
}

export default TaskCard
