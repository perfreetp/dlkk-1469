import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import TaskCard from '@/components/TaskCard'
import { taskList, getTodayTasks } from '@/data/tasks'
import { Task } from '@/types'
import styles from './index.module.scss'

type FilterType = 'all' | 'pending' | 'ongoing' | 'completed' | 'rectify'

const filterOptions: { key: FilterType; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待核验' },
  { key: 'ongoing', label: '进行中' },
  { key: 'completed', label: '已完成' },
  { key: 'rectify', label: '待整改' }
]

const TasksPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [today] = useState('2024年6月17日 星期一')

  const todayTasks = useMemo(() => getTodayTasks(), [])

  const stats = useMemo(() => {
    const all = todayTasks.length
    const completed = todayTasks.filter(t => t.status === 'completed').length
    const pending = todayTasks.filter(t => t.status === 'pending' || t.status === 'ongoing').length
    return { all, completed, pending }
  }, [todayTasks])

  const filteredTasks = useMemo(() => {
    if (activeFilter === 'all') return todayTasks
    return todayTasks.filter(task => task.status === activeFilter)
  }, [todayTasks, activeFilter])

  const handleFilterChange = (key: FilterType) => {
    setActiveFilter(key)
  }

  const onPullDownRefresh = () => {
    setTimeout(() => {
      Taro.stopPullDownRefresh()
    }, 1000)
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.greeting}>
          <Text className={styles.greetingTitle}>早上好，李协管员</Text>
          <Text className={styles.greetingSubtitle}>{today}</Text>
        </View>

        <View className={styles.statCards}>
          <View className={styles.statCard}>
            <Text className={styles.statNumber}>{stats.all}</Text>
            <Text className={styles.statLabel}>今日任务</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statNumber}>{stats.completed}</Text>
            <Text className={styles.statLabel}>已完成</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statNumber}>{stats.pending}</Text>
            <Text className={styles.statLabel}>待核验</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <ScrollView 
          scrollX 
          className={styles.filterBar}
          showScrollbar={false}
        >
          {filterOptions.map(option => (
            <View
              key={option.key}
              className={classnames(styles.filterItem, activeFilter === option.key && styles.active)}
              onClick={() => handleFilterChange(option.key)}
            >
              <Text>{option.label}</Text>
            </View>
          ))}
        </ScrollView>

        <ScrollView 
          scrollY 
          className={styles.taskList}
          style={{ height: 'calc(100vh - 480rpx)' }}
        >
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>📋</Text>
              <Text className={styles.emptyText}>暂无相关任务</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  )
}

export default TasksPage
