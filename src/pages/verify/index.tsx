import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import VerifyCategoryCard from '@/components/VerifyCategoryCard'
import CheckItem from '@/components/CheckItem'
import { useCurrentTask, useTaskCategories, useAppStore } from '@/store'
import styles from './index.module.scss'

const VerifyPage: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const currentTask = useCurrentTask()
  const currentTaskId = useAppStore(state => state.currentTaskId)
  const categories = useTaskCategories(currentTaskId || '')

  const taskId = currentTaskId || 'task001'

  const overallProgress = useMemo(() => {
    const total = categories.reduce((sum, cat) => sum + cat.total, 0)
    const completed = categories.reduce((sum, cat) => sum + cat.completed, 0)
    return {
      total,
      completed,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }, [categories])

  const isAllCompleted = overallProgress.total > 0 && overallProgress.completed === overallProgress.total

  const handleCategoryClick = (categoryId: string) => {
    setExpandedId(expandedId === categoryId ? null : categoryId)
  }

  const handleViewSummary = () => {
    Taro.navigateTo({
      url: `/pages/summary/index?taskId=${taskId}`
    })
  }

  const handleSubmit = () => {
    if (!isAllCompleted) {
      Taro.showModal({
        title: '提示',
        content: `还有 ${overallProgress.total - overallProgress.completed} 项未完成核验，确定提交吗？`,
        confirmText: '确定提交',
        cancelText: '继续核验',
        success: (res) => {
          if (res.confirm) {
            Taro.navigateTo({
              url: `/pages/signature/index?taskId=${taskId}`
            })
          }
        }
      })
    } else {
      Taro.navigateTo({
        url: `/pages/signature/index?taskId=${taskId}`
      })
    }
  }

  if (!currentTask) {
    return (
      <View className={styles.page}>
        <View className={styles.header}>
          <Text className={styles.headerTitle}>现场核验</Text>
        </View>
        <View style={{ padding: '120rpx 32rpx', textAlign: 'center' }}>
          <Text style={{ color: '#86909c', fontSize: 28 }}>请先从「任务列表」选择机构并开始核验</Text>
        </View>
      </View>
    )
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>现场核验</Text>

        <View className={styles.orgInfo}>
          <View className={styles.orgInfoLeft}>
            <Text className={styles.orgName}>{currentTask.orgName}</Text>
            <View className={styles.orgMeta}>
              <Text className={styles.metaIcon}>📍</Text>
              <Text className={styles.metaText}>{currentTask.orgAddress}</Text>
            </View>
            <View className={styles.orgMeta}>
              <Text className={styles.metaIcon}>⏰</Text>
              <Text className={styles.metaText}>预约时间：{currentTask.appointmentTime}</Text>
            </View>
          </View>
        </View>

        <View className={styles.progressSection}>
          <View className={styles.progressHeader}>
            <Text className={styles.progressLabel}>核验总进度</Text>
            <Text className={styles.progressPercent}>{overallProgress.percent}%</Text>
          </View>
          <View className={styles.progressBarOuter}>
            <View
              className={styles.progressBarInner}
              style={{ width: `${overallProgress.percent}%` }}
            />
          </View>
          <View className={styles.progressDetail}>
            <Text className={styles.detailText}>
              已完成 {overallProgress.completed} / {overallProgress.total} 项
            </Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <ScrollView
          scrollY
          className={styles.categoryList}
          style={{ height: 'calc(100vh - 560rpx - 160rpx)' }}
        >
          {categories.map(category => (
            <View key={category.id}>
              <VerifyCategoryCard
                category={category}
                expanded={expandedId === category.id}
                onClick={() => handleCategoryClick(category.id)}
              />
              {expandedId === category.id && (
                <View className={styles.expandedSection}>
                  <Text className={styles.sectionTitle}>检查项目</Text>
                  {category.items.map(item => (
                    <CheckItem
                      key={item.id}
                      item={item}
                      onClick={() => {
                        Taro.navigateTo({
                          url: `/pages/verify-item/index?id=${item.id}&taskId=${taskId}`
                        })
                      }}
                    />
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>

      <View className={styles.bottomBar}>
        <Button
          className={`${styles.btn} ${styles.btnOutline}`}
          onClick={handleViewSummary}
        >
          查看摘要
        </Button>
        <Button
          className={classnames(styles.btn, styles.btnPrimary)}
          onClick={handleSubmit}
        >
          提交核验
        </Button>
      </View>
    </View>
  )
}

export default VerifyPage
