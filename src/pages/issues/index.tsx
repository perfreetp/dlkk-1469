import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import StatusTag from '@/components/StatusTag'
import { useAllIssues } from '@/store'
import { IssueItem } from '@/types'
import styles from './index.module.scss'

type FilterType = 'all' | 'pending' | 'rectifying' | 'verified' | 'closed'

const filterOptions: { key: FilterType; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待整改' },
  { key: 'rectifying', label: '整改中' },
  { key: 'verified', label: '已复核' },
  { key: 'closed', label: '已关闭' }
]

const IssuesPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const allIssues = useAllIssues()

  const stats = useMemo(() => {
    return {
      pending: allIssues.filter(i => i.status === 'pending').length,
      rectifying: allIssues.filter(i => i.status === 'rectifying').length,
      verified: allIssues.filter(i => i.status === 'verified').length,
      closed: allIssues.filter(i => i.status === 'closed').length
    }
  }, [allIssues])

  const filteredIssues = useMemo(() => {
    if (activeFilter === 'all') return allIssues
    return allIssues.filter(issue => issue.status === activeFilter)
  }, [allIssues, activeFilter])

  const handleFilterChange = (key: FilterType) => {
    setActiveFilter(key)
  }

  const handleIssueClick = (issue: IssueItem) => {
    Taro.navigateTo({
      url: `/pages/issue-detail/index?id=${issue.id}`
    })
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>问题清单</Text>
        <Text className={styles.headerSubtitle}>共 {allIssues.length} 条待处理问题</Text>

        <View className={styles.statRow}>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{stats.pending}</Text>
            <Text className={styles.statLabel}>待整改</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{stats.rectifying}</Text>
            <Text className={styles.statLabel}>整改中</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{stats.verified}</Text>
            <Text className={styles.statLabel}>已复核</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{stats.closed}</Text>
            <Text className={styles.statLabel}>已关闭</Text>
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
          className={styles.issueList}
          style={{ height: 'calc(100vh - 420rpx)' }}
        >
          {filteredIssues.length > 0 ? (
            filteredIssues.map(issue => (
              <View
                key={issue.id}
                className={styles.issueCard}
                onClick={() => handleIssueClick(issue)}
              >
                <View className={classnames(styles.severityBar, styles[issue.severity])} />

                <View className={styles.cardHeader}>
                  <Text className={styles.issueTitle}>{issue.itemName}</Text>
                  <StatusTag status={issue.severity} size="sm" />
                </View>

                <Text className={styles.orgName}>
                  🏥 {issue.orgName}
                </Text>

                <Text className={styles.issueLocation}>
                  📍 {issue.location}
                </Text>

                <Text className={styles.issueDesc}>{issue.description}</Text>

                <View className={styles.cardFooter}>
                  <View className={styles.deadline}>
                    <Text className={styles.deadlineIcon}>⏰</Text>
                    <Text className={styles.deadlineText}>
                      整改期限：{issue.rectifyDeadline}
                    </Text>
                  </View>
                  <StatusTag status={issue.status} size="sm" />
                </View>
              </View>
            ))
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>✅</Text>
              <Text className={styles.emptyText}>暂无相关问题</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  )
}

export default IssuesPage
