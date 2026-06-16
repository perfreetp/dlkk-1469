import React, { useState, useMemo } from 'react'
import { View, Text, Input, Button } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import StatusTag from '@/components/StatusTag'
import { useTaskCategories, useTaskIssues, useAppStore } from '@/store'
import styles from './index.module.scss'

const SignaturePage: React.FC = () => {
  const router = useRouter()
  const taskId = router.params.taskId || 'task001'

  const tasks = useAppStore(state => state.tasks)
  const updateTaskStatus = useAppStore(state => state.updateTaskStatus)
  const setCurrentTaskId = useAppStore(state => state.setCurrentTaskId)
  const categories = useTaskCategories(taskId)
  const issues = useTaskIssues(taskId)

  const task = useMemo(() => tasks.find(t => t.id === taskId), [tasks, taskId])

  const stats = useMemo(() => {
    let pass = 0
    let rectify = 0
    let fail = 0
    let total = 0
    categories.forEach(category => {
      category.items.forEach(item => {
        total++
        if (item.status === 'pass') pass++
        else if (item.status === 'rectify') rectify++
        else if (item.status === 'fail') fail++
      })
    })
    return { pass, rectify, fail, total }
  }, [categories])

  const [signerName, setSignerName] = useState('')
  const [hasSigned, setHasSigned] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canSubmit = signerName.trim().length > 0 && hasSigned && !isSubmitting

  const handleSignatureClick = () => {
    Taro.showToast({
      title: '签名已确认',
      icon: 'success'
    })
    setHasSigned(true)
  }

  const handleClearSignature = () => {
    setHasSigned(false)
  }

  const handleSubmit = () => {
    if (!canSubmit) {
      if (!signerName.trim()) {
        Taro.showToast({ title: '请填写负责人姓名', icon: 'none' })
      } else if (!hasSigned) {
        Taro.showToast({ title: '请完成签名确认', icon: 'none' })
      }
      return
    }

    Taro.showModal({
      title: '确认提交',
      content: `确认由「${signerName}」代表机构签署核验结果吗？`,
      confirmText: '确认提交',
      cancelText: '取消',
      success: (res) => {
        if (!res.confirm) return

        setIsSubmitting(true)
        const newStatus = stats.fail > 0
          ? 'rectify'
          : stats.rectify > 0 || issues.length > 0
            ? 'rectify'
            : 'completed'

        updateTaskStatus(taskId, newStatus)
        setCurrentTaskId(null)

        const statusText = {
          completed: '核验通过',
          rectify: '待整改',
          pending: '待核验',
          ongoing: '进行中'
        }

        setTimeout(() => {
          setIsSubmitting(false)
          Taro.showToast({
            title: statusText[newStatus],
            icon: 'success',
            duration: 1800
          })
          setTimeout(() => {
            Taro.switchTab({ url: '/pages/tasks/index' })
          }, 1800)
        }, 1200)
      }
    })
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>电子签名确认</Text>
        <Text className={styles.headerSubtitle}>请机构负责人确认核验结果并签字</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>机构信息</Text>
          <View className={styles.infoCard}>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>机构名称</Text>
              <Text className={styles.infoValue}>{task?.orgName || '-'}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>机构地址</Text>
              <Text className={styles.infoValue}>{task?.orgAddress || '-'}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>核验时间</Text>
              <Text className={styles.infoValue}>{task?.appointmentTime || '-'}</Text>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>核验结果概览</Text>
          <View className={styles.statsRow}>
            <View className={classnames(styles.statItem, styles.pass)}>
              <Text className={styles.statNumber}>{stats.pass}</Text>
              <Text className={styles.statLabel}>通过</Text>
            </View>
            <View className={classnames(styles.statItem, styles.rectify)}>
              <Text className={styles.statNumber}>{stats.rectify}</Text>
              <Text className={styles.statLabel}>待整改</Text>
            </View>
            <View className={classnames(styles.statItem, styles.fail)}>
              <Text className={styles.statNumber}>{stats.fail}</Text>
              <Text className={styles.statLabel}>不通过</Text>
            </View>
            <View className={classnames(styles.statItem, styles.total)}>
              <Text className={styles.statNumber}>{stats.total}</Text>
              <Text className={styles.statLabel}>总项数</Text>
            </View>
          </View>
        </View>

        {issues.length > 0 && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>问题清单 ({issues.length})</Text>
            <View className={styles.issueList}>
              {issues.map((issue, index) => (
                <View
                  key={issue.id}
                  className={styles.issueItem}
                  onClick={() => {
                    Taro.navigateTo({
                      url: `/pages/issue-detail/index?id=${issue.id}`
                    })
                  }}
                >
                  <View className={classnames(styles.severityIndicator, styles[issue.severity])} />
                  <View className={styles.issueContent}>
                    <View className={styles.issueNameRow}>
                      <Text className={styles.issueName}>
                        {index + 1}. {issue.itemName}
                      </Text>
                      <StatusTag status={issue.status} size="sm" />
                    </View>
                    <Text className={styles.issueLocation}>📍 {issue.location}</Text>
                    <Text className={styles.issueDesc}>{issue.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>负责人确认</Text>
          <View className={styles.formCard}>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>负责人姓名</Text>
              <Input
                className={styles.formInput}
                placeholder="请输入机构负责人姓名"
                value={signerName}
                onInput={(e) => setSignerName(e.detail.value)}
                maxlength={20}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>电子签名</Text>
              <View
                className={classnames(styles.signatureBox, hasSigned && styles.signed)}
                onClick={!hasSigned ? handleSignatureClick : undefined}
              >
                {hasSigned ? (
                  <View className={styles.signedContent}>
                    <Text className={styles.signedText}>{signerName || '已签名确认'}</Text>
                    <Text className={styles.signedDate}>
                      {new Date().toLocaleString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      }).replace(/\//g, '-')}
                    </Text>
                    <View className={styles.clearSignature} onClick={handleClearSignature}>
                      <Text>清除</Text>
                    </View>
                  </View>
                ) : (
                  <Text className={styles.signatureHint}>点击此处确认签名</Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <Button
          className={classnames(styles.submitBtn, !canSubmit && styles.disabled)}
          onClick={handleSubmit}
        >
          {isSubmitting ? '提交中...' : '确认提交'}
        </Button>
      </View>
    </View>
  )
}

export default SignaturePage
