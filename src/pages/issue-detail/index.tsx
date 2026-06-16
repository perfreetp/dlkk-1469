import React, { useState, useEffect } from 'react'
import { View, Text, Image, Textarea, ScrollView, Button } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import StatusTag from '@/components/StatusTag'
import { useAppStore } from '@/store'
import { IssueItem } from '@/types'
import styles from './index.module.scss'

const statusFlow: { key: IssueItem['status']; label: string; next: IssueItem['status'] | null }[] = [
  { key: 'pending', label: '待整改', next: 'rectifying' },
  { key: 'rectifying', label: '整改中', next: 'verified' },
  { key: 'verified', label: '已复核', next: 'closed' },
  { key: 'closed', label: '已关闭', next: null }
]

const IssueDetailPage: React.FC = () => {
  const router = useRouter()
  const issueId = router.params.id || ''

  const taskVerifyData = useAppStore(state => state.taskVerifyData)
  const updateIssue = useAppStore(state => state.updateIssue)
  const updateIssueStatus = useAppStore(state => state.updateIssueStatus)

  const issue = (() => {
    for (const data of Object.values(taskVerifyData)) {
      const found = data.issues.find(i => i.id === issueId)
      if (found) return found
    }
    return undefined
  })()

  const [rectifyPhotos, setRectifyPhotos] = useState<string[]>([])
  const [rectifyNote, setRectifyNote] = useState('')

  useEffect(() => {
    if (issue) {
      setRectifyPhotos(issue.rectifyPhotos || [])
      setRectifyNote(issue.rectifyNote || '')
    }
  }, [issue?.id])

  if (!issue) {
    return (
      <View className={styles.page}>
        <View className={styles.empty}>
          <Text>未找到问题信息</Text>
        </View>
      </View>
    )
  }

  const currentFlow = statusFlow.find(s => s.key === issue.status)
  const nextStatus = currentFlow?.next
  const nextLabel = nextStatus ? statusFlow.find(s => s.key === nextStatus)?.label : ''

  const handleAddPhoto = () => {
    Taro.chooseImage({
      count: 9 - rectifyPhotos.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        setRectifyPhotos(prev => [...prev, ...res.tempFilePaths].slice(0, 9))
      }
    })
  }

  const handleDeletePhoto = (index: number) => {
    setRectifyPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    updateIssue(issueId, {
      rectifyPhotos,
      rectifyNote
    })
    Taro.showToast({ title: '已保存', icon: 'success', duration: 1000 })
  }

  const handleStatusChange = () => {
    if (!nextStatus) return

    const confirmText = {
      rectifying: '确认开始整改？',
      verified: '确认已复核通过？',
      closed: '确认关闭此问题？'
    }

    Taro.showModal({
      title: '状态变更',
      content: confirmText[nextStatus] || `确认变更为「${nextLabel}」？`,
      confirmText: '确认',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          updateIssue(issueId, {
            status: nextStatus,
            rectifyPhotos,
            rectifyNote
          })
          Taro.showToast({
            title: `已变更为「${nextLabel}」`,
            icon: 'success',
            duration: 1200
          })
          setTimeout(() => {
            Taro.navigateBack()
          }, 1200)
        }
      }
    })
  }

  const statusIndex = statusFlow.findIndex(s => s.key === issue.status)

  return (
    <View className={styles.page}>
      <ScrollView
        scrollY
        className={styles.content}
        style={{ height: nextStatus ? 'calc(100vh - 180rpx)' : '100vh' }}
      >
        <View className={styles.header}>
          <View className={styles.titleRow}>
            <Text className={styles.title}>{issue.itemName}</Text>
            <StatusTag status={issue.severity} size="sm" />
          </View>
          <Text className={styles.orgName}>🏥 {issue.orgName}</Text>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>问题信息</Text>
          <View className={styles.infoCard}>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>问题位置</Text>
              <Text className={styles.infoValue}>📍 {issue.location}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>严重程度</Text>
              <StatusTag status={issue.severity} size="sm" />
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>整改期限</Text>
              <Text className={styles.infoValue}>⏰ {issue.rectifyDeadline}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>当前状态</Text>
              <StatusTag status={issue.status} size="sm" />
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>创建时间</Text>
              <Text className={styles.infoValue}>{issue.createdAt}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>处理人</Text>
              <Text className={styles.infoValue}>{issue.handler}</Text>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>问题描述</Text>
          <Text className={styles.descText}>{issue.description}</Text>
          {issue.photoUrl && (
            <Image className={styles.evidencePhoto} src={issue.photoUrl} mode="widthFix" />
          )}
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>整改进度</Text>
          <View className={styles.stepBar}>
            {statusFlow.map((step, index) => (
              <View
                key={step.key}
                className={classnames(
                  styles.stepItem,
                  index <= statusIndex && styles.stepActive,
                  index === statusIndex && styles.stepCurrent
                )}
              >
                <View className={styles.stepDot}>
                  {index <= statusIndex && <Text className={styles.stepCheck}>✓</Text>}
                </View>
                <Text className={styles.stepLabel}>{step.label}</Text>
                {index < statusFlow.length - 1 && (
                  <View className={classnames(styles.stepLine, index < statusIndex && styles.stepLineActive)} />
                )}
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>整改照片</Text>
          <View className={styles.photoGrid}>
            {rectifyPhotos.map((photo, index) => (
              <View key={`${photo}-${index}`} className={styles.photoItem}>
                <Image
                  className={styles.photoImg}
                  src={photo}
                  mode="aspectFill"
                  onClick={() => Taro.previewImage({ current: photo, urls: rectifyPhotos })}
                />
                <View className={styles.photoDelete} onClick={() => handleDeletePhoto(index)}>
                  <Text>×</Text>
                </View>
              </View>
            ))}
            {rectifyPhotos.length < 9 && (
              <View className={styles.photoAdd} onClick={handleAddPhoto}>
                <Text className={styles.photoAddIcon}>+</Text>
                <Text className={styles.photoAddText}>添加照片</Text>
              </View>
            )}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>整改说明</Text>
          <Textarea
            className={styles.noteInput}
            placeholder="请输入整改说明（选填）"
            value={rectifyNote}
            onInput={(e) => setRectifyNote(e.detail.value)}
            maxlength={500}
          />
        </View>

        <View className={styles.saveRow}>
          <Button className={styles.saveBtn} onClick={handleSave}>
            保存
          </Button>
        </View>
      </ScrollView>

      {nextStatus && (
        <View className={styles.bottomBar}>
          <Button
            className={classnames(styles.actionBtn, styles[`action_${nextStatus}`])}
            onClick={handleStatusChange}
          >
            推进为「{nextLabel}」
          </Button>
        </View>
      )}
    </View>
  )
}

export default IssueDetailPage
