import React, { useState, useMemo } from 'react'
import { View, Text, Input, Button } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import { useAppStore } from '@/store'
import styles from './index.module.scss'

const SignaturePage: React.FC = () => {
  const router = useRouter()
  const taskId = router.params.taskId || 'task001'
  const { tasks, getTaskVerifyData, updateTaskStatus, setCurrentTaskId } = useAppStore()

  const task = useMemo(() => tasks.find(t => t.id === taskId), [tasks, taskId])
  const verifyData = useMemo(() => getTaskVerifyData(taskId), [taskId, getTaskVerifyData])
  const issues = verifyData.issues

  const [signerName, setSignerName] = useState('')
  const [hasSigned, setHasSigned] = useState(false)
  const [signature, setSignature] = useState('')

  const stats = useMemo(() => {
    let pass = 0
    let rectify = 0
    let fail = 0
    let total = 0

    verifyData.categories.forEach(category => {
      category.items.forEach(item => {
        total++
        if (item.status === 'pass') pass++
        else if (item.status === 'rectify') rectify++
        else if (item.status === 'fail') fail++
      })
    })

    return { pass, rectify, fail, total }
  }, [verifyData.categories])

  const canSubmit = signerName.trim().length > 0 && hasSigned

  const handleSign = () => {
    Taro.showActionSheet({
      itemList: ['手写签名', '一键生成签名'],
      success: (res) => {
        if (res.tapIndex === 0) {
          Taro.showToast({
            title: '请在下方区域手写签名',
            icon: 'none'
          })
          setTimeout(() => {
            setHasSigned(true)
            setSignature(signerName || '张主任')
          }, 500)
        } else {
          setHasSigned(true)
          setSignature(signerName || '张主任')
        }
        console.log('[Signature] 选择签名方式:', res.tapIndex)
      },
      fail: (err) => {
        console.error('[Signature] 选择签名方式失败:', err)
      }
    })
  }

  const handleClearSign = () => {
    setHasSigned(false)
    setSignature('')
  }

  const handleSubmit = () => {
    if (!canSubmit) {
      Taro.showToast({
        title: '请填写姓名并完成签名',
        icon: 'none'
      })
      return
    }

    Taro.showModal({
      title: '确认提交',
      content: `确认由「${signerName}」代表机构签署核验结果吗？`,
      confirmText: '确认提交',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          console.log('[Signature] 提交电子签名确认')
          Taro.showLoading({ title: '提交中...' })
          
          const newStatus = stats.fail > 0 
            ? 'rectify' 
            : stats.rectify > 0 
              ? 'rectify' 
              : 'completed'
          
          updateTaskStatus(taskId, newStatus)
          setCurrentTaskId(null)
          
          setTimeout(() => {
            Taro.hideLoading()
            
            const statusText = {
              completed: '核验通过',
              rectify: '待整改',
              pending: '待核验',
              ongoing: '进行中'
            }
            
            Taro.showToast({
              title: `${statusText[newStatus]}`,
              icon: 'success',
              duration: 2000
            })
            
            setTimeout(() => {
              Taro.switchTab({
                url: '/pages/tasks/index'
              })
            }, 2000)
          }, 1500)
        }
      }
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
      <View className={styles.content}>
        <View className={styles.card}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>🏥</Text>
            被核验机构
          </Text>
          <View className={styles.orgInfo}>
            <Text className={styles.orgName}>{task.orgName}</Text>
            <Text className={styles.orgDetail}>{task.orgType}</Text>
            <Text className={styles.orgDetail}>{task.orgAddress}</Text>
          </View>
        </View>

        <View className={styles.card}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>📊</Text>
            核验结果概览
          </Text>
          <View className={styles.summaryStats}>
            <View className={styles.statItem}>
              <Text className={`${styles.statNumber} ${styles.pass}`}>{stats.pass}</Text>
              <Text className={styles.statLabel}>通过</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={`${styles.statNumber} ${styles.rectify}`}>{stats.rectify}</Text>
              <Text className={styles.statLabel}>待整改</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={`${styles.statNumber} ${styles.fail}`}>{stats.fail}</Text>
              <Text className={styles.statLabel}>不通过</Text>
            </View>
          </View>
        </View>

        {issues.length > 0 && (
          <View className={styles.card}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.titleIcon}>⚠️</Text>
              问题清单（{issues.length}项）
            </Text>
            <View className={styles.issueList}>
              {issues.slice(0, 3).map((issue) => (
                <View key={issue.id} className={styles.issueItem}>
                  <View className={classnames(styles.issueBullet, styles[issue.severity])} />
                  <View className={styles.issueContent}>
                    <Text className={styles.issueName}>{issue.itemName}</Text>
                    <Text className={styles.issueDesc}>{issue.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View className={`${styles.card} ${styles.signSection}`}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>✍️</Text>
            机构负责人确认
          </Text>

          <View className={styles.nameInput}>
            <Text className={styles.inputLabel}>负责人姓名</Text>
            <Input
              className={styles.inputField}
              placeholder="请输入机构负责人姓名"
              value={signerName}
              onInput={(e) => setSignerName(e.detail.value)}
              maxlength={20}
            />
          </View>

          <View className={classnames(styles.signArea, hasSigned && styles.active)}>
            {hasSigned ? (
              <View className={styles.signPlaceholder}>
                <Text className={styles.signHandwriting}>{signature}</Text>
              </View>
            ) : (
              <>
                <Text className={styles.signIcon}>✏️</Text>
                <Text className={styles.signText}>点击下方按钮进行签名</Text>
              </>
            )}
          </View>

          <View className={styles.signButtons}>
            <Button 
              className={`${styles.signBtn} ${styles.signBtnOutline}`}
              onClick={handleClearSign}
            >
              清除签名
            </Button>
            <Button 
              className={`${styles.signBtn} ${styles.signBtnPrimary}`}
              onClick={handleSign}
            >
              {hasSigned ? '重新签名' : '立即签名'}
            </Button>
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <Button 
          className={`${styles.btn} ${styles.btnOutline}`}
          onClick={() => Taro.navigateBack()}
        >
          返回修改
        </Button>
        <Button 
          className={classnames(
            styles.btn,
            canSubmit ? styles.btnPrimary : styles.btnDisabled
          )}
          onClick={handleSubmit}
        >
          确认提交
        </Button>
      </View>
    </View>
  )
}

export default SignaturePage
