import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import VerifyCategoryCard from '@/components/VerifyCategoryCard'
import CheckItem from '@/components/CheckItem'
import { useAppStore } from '@/store'
import styles from './index.module.scss'

const VerifyPage: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { currentTaskId, tasks, getTaskVerifyData } = useAppStore()
  
  const taskId = currentTaskId || 'task001'
  const currentTask = useMemo(() => tasks.find(t => t.id === taskId), [tasks, taskId])
  const verifyData = useMemo(() => getTaskVerifyData(taskId), [taskId, getTaskVerifyData])
  const categories = verifyData.categories

  const overallProgress = useMemo(() => {
    const total = categories.reduce((sum, cat) => sum + cat.total, 0)
    const completed = categories.reduce((sum, cat) => sum + cat.completed, 0)
    return { total, completed, percent: total > 0 ? Math.round((completed / total) * 100) : 0 }
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
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>🏥</Text>
          <Text className={styles.emptyTitle}>暂无进行中的核验任务</Text>
          <Text className={styles.emptyDesc}>请先在"任务"页面选择一个任务开始核验</Text>
        </View>
      </View>
    )
  }

  return (
    <View className={styles.page}>
      <View className={styles.currentOrg}>
        <View className={styles.orgHeader}>
          <Text className={styles.orgName}>{currentTask.orgName}</Text>
          <View className={styles.orgType}>
            <Text>{currentTask.orgType}</Text>
          </View>
        </View>
        <View className={styles.progressSection}>
          <View className={styles.progressLabel}>
            <Text>核验进度</Text>
            <Text>{overallProgress.completed}/{overallProgress.total} 项 ({overallProgress.percent}%)</Text>
          </View>
          <View className={styles.progressBar}>
            <View 
              className={styles.progressFill} 
              style={{ width: `${overallProgress.percent}%` }}
            />
          </View>
        </View>
      </View>

      <ScrollView 
        scrollY 
        className={styles.content}
        style={{ height: 'calc(100vh - 320rpx - 160rpx)' }}
      >
        <View className={styles.categoryList}>
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
        </View>
      </ScrollView>

      <View className={styles.bottomBar}>
        <Button 
          className={classnames(styles.btn, styles.btnOutline)}
          onClick={handleViewSummary}
        >
          查看摘要
        </Button>
        <Button 
          className={classnames(
            styles.btn, 
            isAllCompleted ? styles.btnPrimary : styles.btnDisabled
          )}
          onClick={handleSubmit}
        >
          {isAllCompleted ? '提交核验' : `还差 ${overallProgress.total - overallProgress.completed} 项`}
        </Button>
      </View>
    </View>
  )
}

export default VerifyPage
