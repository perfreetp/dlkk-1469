import React, { useMemo } from 'react'
import { View, Text, Button, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import StatusTag from '@/components/StatusTag'
import { useTaskCategories, useTaskIssues, useAppStore } from '@/store'
import styles from './index.module.scss'

const SummaryPage: React.FC = () => {
  const router = useRouter()
  const taskId = router.params.taskId || 'task001'

  const tasks = useAppStore(state => state.tasks)
  const categories = useTaskCategories(taskId)
  const issues = useTaskIssues(taskId)

  const task = useMemo(() => tasks.find(t => t.id === taskId), [tasks, taskId])

  const stats = useMemo(() => {
    let pass = 0
    let rectify = 0
    let fail = 0
    let pending = 0
    const total = categories.reduce((sum, cat) => sum + cat.total, 0)
    const completed = categories.reduce((sum, cat) => sum + cat.completed, 0)

    categories.forEach(category => {
      category.items.forEach(item => {
        if (item.status === 'pass') pass++
        else if (item.status === 'rectify') rectify++
        else if (item.status === 'fail') fail++
        else pending++
      })
    })

    return { total, completed, pass, rectify, fail, pending }
  }, [categories])

  const conclusion = useMemo(() => {
    if (stats.fail > 0) return { type: 'error', text: '核验不通过', icon: '❌' }
    if (stats.rectify > 0 || issues.length > 0) return { type: 'warning', text: '需整改后复核', icon: '⚠️' }
    if (stats.pending > 0) return { type: 'pending', text: '核验进行中', icon: '⏳' }
    return { type: 'success', text: '核验通过', icon: '✅' }
  }, [stats, issues.length])

  const handleBack = () => {
    Taro.navigateBack()
  }

  const handleSignature = () => {
    Taro.navigateTo({
      url: `/pages/signature/index?taskId=${taskId}`
    })
  }

  return (
    <View className={styles.page}>
      <View className={classnames(styles.resultHeader, styles[conclusion.type])}>
        <Text className={styles.resultIcon}>{conclusion.icon}</Text>
        <Text className={styles.resultText}>{conclusion.text}</Text>
        <Text className={styles.orgName}>{task?.orgName || ''}</Text>
      </View>

      <ScrollView
        scrollY
        className={styles.content}
        style={{ height: 'calc(100vh - 320rpx - 160rpx)' }}
      >
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>核验统计</Text>
          <View className={styles.statsGrid}>
            <View className={classnames(styles.statCard, styles.pass)}>
              <Text className={styles.statNumber}>{stats.pass}</Text>
              <Text className={styles.statLabel}>通过项</Text>
            </View>
            <View className={classnames(styles.statCard, styles.rectify)}>
              <Text className={styles.statNumber}>{stats.rectify}</Text>
              <Text className={styles.statLabel}>待整改</Text>
            </View>
            <View className={classnames(styles.statCard, styles.fail)}>
              <Text className={styles.statNumber}>{stats.fail}</Text>
              <Text className={styles.statLabel}>不通过</Text>
            </View>
            <View className={classnames(styles.statCard, styles.total)}>
              <Text className={styles.statNumber}>{stats.total}</Text>
              <Text className={styles.statLabel}>总项数</Text>
            </View>
          </View>
          <View className={styles.progressRow}>
            <Text className={styles.progressLabel}>核验完成度</Text>
            <View className={styles.progressBarOuter}>
              <View
                className={styles.progressBarInner}
                style={{
                  width: `${stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%`
                }}
              />
            </View>
            <Text className={styles.progressText}>
              {stats.completed}/{stats.total} ({stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%)
            </Text>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>分类核验情况</Text>
          <View className={styles.categoryList}>
            {categories.map(cat => {
              let pass = 0, rectify = 0, fail = 0
              cat.items.forEach(item => {
                if (item.status === 'pass') pass++
                else if (item.status === 'rectify') rectify++
                else if (item.status === 'fail') fail++
              })
              return (
                <View key={cat.id} className={styles.categoryItem}>
                  <View className={styles.categoryIcon}>
                    <Text>{cat.icon}</Text>
                  </View>
                  <View className={styles.categoryInfo}>
                    <Text className={styles.categoryName}>{cat.name}</Text>
                    <View className={styles.categoryStats}>
                      {pass > 0 && <Text className={styles.catPass}>通过 {pass}</Text>}
                      {rectify > 0 && <Text className={styles.catRectify}>整改 {rectify}</Text>}
                      {fail > 0 && <Text className={styles.catFail}>驳回 {fail}</Text>}
                      <Text className={styles.catTotal}>共 {cat.total} 项</Text>
                    </View>
                  </View>
                  <View className={styles.categoryStatus}>
                    <StatusTag
                      status={cat.completed === cat.total ? 'pass' : 'pending'}
                      size="sm"
                      text={cat.completed === cat.total ? '已完成' : `${cat.completed}/${cat.total}`}
                    />
                  </View>
                </View>
              )
            })}
          </View>
        </View>

        {issues.length > 0 && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>
              问题清单
              <Text className={styles.issueCount}>({issues.length}项)</Text>
            </Text>
            <View className={styles.issueList}>
              {issues.map((issue, index) => (
                <View key={issue.id} className={styles.issueItem}>
                  <View className={styles.issueHeader}>
                    <View className={styles.issueIndex}>
                      <Text>{index + 1}</Text>
                    </View>
                    <View className={styles.issueInfo}>
                      <Text className={styles.issueName}>{issue.itemName}</Text>
                      <View className={styles.issueMeta}>
                        <Text className={styles.issueLocation}>📍 {issue.location}</Text>
                        <StatusTag status={issue.severity} size="sm" />
                      </View>
                    </View>
                    <StatusTag status={issue.status} size="sm" />
                  </View>
                  <Text className={styles.issueDesc}>{issue.description}</Text>
                  <View className={styles.issueFooter}>
                    <Text className={styles.deadline}>
                      整改期限：{issue.rectifyDeadline}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>核验信息</Text>
          <View className={styles.infoList}>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>机构名称</Text>
              <Text className={styles.infoValue}>{task?.orgName || '-'}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>核验人员</Text>
              <Text className={styles.infoValue}>李协管员、张审批员</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>核验日期</Text>
              <Text className={styles.infoValue}>
                {new Date().toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                }).replace(/\//g, '-')}
              </Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>完成时间</Text>
              <Text className={styles.infoValue}>
                {stats.total > 0 && stats.completed === stats.total
                  ? new Date().toLocaleString('zh-CN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    }).replace(/\//g, '-')
                  : '核验进行中'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className={styles.bottomBar}>
        <Button className={`${styles.btn} ${styles.btnOutline}`} onClick={handleBack}>
          返回核验
        </Button>
        <Button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSignature}>
          签字确认
        </Button>
      </View>
    </View>
  )
}

export default SummaryPage
