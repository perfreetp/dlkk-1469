import React, { useMemo } from 'react'
import { View, Text, Button, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import StatusTag from '@/components/StatusTag'
import { useAppStore } from '@/store'
import styles from './index.module.scss'

const SummaryPage: React.FC = () => {
  const router = useRouter()
  const taskId = router.params.taskId || 'task001'
  const { tasks, getTaskVerifyData } = useAppStore()

  const task = useMemo(() => tasks.find(t => t.id === taskId), [tasks, taskId])
  const verifyData = useMemo(() => getTaskVerifyData(taskId), [taskId, getTaskVerifyData])
  const categories = verifyData.categories
  const issues = verifyData.issues

  const stats = useMemo(() => {
    let pass = 0
    let rectify = 0
    let fail = 0
    const total = categories.reduce((sum, cat) => sum + cat.total, 0)
    const completed = categories.reduce((sum, cat) => sum + cat.completed, 0)

    categories.forEach(category => {
      category.items.forEach(item => {
        if (item.status === 'pass') pass++
        else if (item.status === 'rectify') rectify++
        else if (item.status === 'fail') fail++
      })
    })

    return { total, completed, pass, rectify, fail }
  }, [categories])

  const conclusion = useMemo(() => {
    if (stats.fail > 0) return { type: 'error', text: '核验不通过', icon: '❌' }
    if (stats.rectify > 0 || issues.length > 0) return { type: 'warning', text: '需整改后复核', icon: '⚠️' }
    return { type: 'success', text: '核验通过', icon: '✅' }
  }, [stats, issues.length])

  const handleSign = () => {
    Taro.navigateTo({
      url: `/pages/signature/index?taskId=${taskId}`
    })
  }

  const handleBack = () => {
    Taro.switchTab({
      url: '/pages/verify/index'
    })
  }

  if (!task) {
    return (
      <View className={styles.page}>
        <View style={{ padding: '120rpx 32rpx', textAlign: 'center' }}>
          <Text>未找到任务信息</Text>
        </View>
      </View>
    )
  }

  return (
    <View className={styles.page}>
      <View className={classnames(styles.header, styles[conclusion.type])}>
        <Text className={styles.resultIcon}>{conclusion.icon}</Text>
        <Text className={styles.resultTitle}>{conclusion.text}</Text>
        <Text className={styles.resultSubtitle}>核验摘要已自动生成</Text>
      </View>

      <ScrollView 
        scrollY 
        className={styles.content}
        style={{ height: 'calc(100vh - 260rpx - 160rpx)' }}
      >
        <View className={styles.card}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>🏥</Text>
            被核验机构
          </Text>
          <View className={styles.orgInfo}>
            <View className={styles.orgIcon}>
              <Text>🏢</Text>
            </View>
            <View className={styles.orgDetail}>
              <Text className={styles.orgName}>{task.orgName}</Text>
              <Text className={styles.orgType}>{task.orgType} · {task.orgAddress}</Text>
            </View>
          </View>
        </View>

        <View className={styles.card}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>📊</Text>
            核验统计
          </Text>
          <View className={styles.statsRow}>
            <View className={styles.statCard}>
              <Text className={`${styles.statNumber} ${styles.total}`}>{stats.total}</Text>
              <Text className={styles.statLabel}>总项数</Text>
            </View>
            <View className={styles.statCard}>
              <Text className={`${styles.statNumber} ${styles.pass}`}>{stats.pass || stats.completed}</Text>
              <Text className={styles.statLabel}>通过</Text>
            </View>
            <View className={styles.statCard}>
              <Text className={`${styles.statNumber} ${styles.rectify}`}>{issues.length || stats.rectify}</Text>
              <Text className={styles.statLabel}>待整改</Text>
            </View>
            <View className={styles.statCard}>
              <Text className={`${styles.statNumber} ${styles.fail}`}>{stats.fail}</Text>
              <Text className={styles.statLabel}>不通过</Text>
            </View>
          </View>
        </View>

        <View className={styles.card}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>📋</Text>
            分类核验情况
          </Text>
          <View className={styles.categoryList}>
            {categories.map(cat => (
              <View key={cat.id} className={styles.categoryItem}>
                <View className={styles.categoryIcon}>
                  <Text>{cat.icon}</Text>
                </View>
                <View className={styles.categoryInfo}>
                  <Text className={styles.categoryName}>{cat.name}</Text>
                  <Text className={styles.categoryProgress}>
                    完成 {cat.completed}/{cat.total} 项
                  </Text>
                </View>
                <View className={styles.categoryStatus}>
                  <StatusTag 
                    status={cat.completed === cat.total ? 'pass' : 'pending'} 
                    size="sm" 
                    text={cat.completed === cat.total ? '已完成' : '进行中'}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {issues.length > 0 && (
          <View className={`${styles.card} ${styles.issueSection}`}>
            <View className={styles.issueTitleRow}>
              <Text className={styles.sectionTitle} style={{ marginBottom: 0 }}>
                <Text className={styles.titleIcon}>⚠️</Text>
                问题清单
              </Text>
              <Text className={styles.issueCount}>共 {issues.length} 项</Text>
            </View>
            <View className={styles.issueList}>
              {issues.map(issue => (
                <View key={issue.id} className={styles.issueItem}>
                  <View className={classnames(styles.issueBadge, styles[issue.severity])} />
                  <View className={styles.issueContent}>
                    <Text className={styles.issueName}>{issue.itemName}</Text>
                    <Text className={styles.issueDesc}>{issue.description}</Text>
                    <View className={styles.deadlineInfo}>
                      <Text className={styles.deadlineIcon}>⏰</Text>
                      <Text className={styles.deadlineText}>
                        整改期限：{issue.rectifyDeadline}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View className={styles.card}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>🕐</Text>
            核验时间
          </Text>
          <View className={styles.timeInfo}>
            <Text className={styles.timeLabel}>开始时间</Text>
            <Text className={styles.timeValue}>2024-06-17 09:15</Text>
          </View>
          <View className={styles.timeInfo}>
            <Text className={styles.timeLabel}>结束时间</Text>
            <Text className={styles.timeValue}>2024-06-17 10:42</Text>
          </View>
          <View className={styles.timeInfo}>
            <Text className={styles.timeLabel}>核验人员</Text>
            <Text className={styles.timeValue}>李建国、王协管</Text>
          </View>
        </View>
      </ScrollView>

      <View className={styles.bottomBar}>
        <Button 
          className={`${styles.btn} ${styles.btnOutline}`}
          onClick={handleBack}
        >
          返回修改
        </Button>
        <Button 
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={handleSign}
        >
          去签字确认
        </Button>
      </View>
    </View>
  )
}

export default SummaryPage
