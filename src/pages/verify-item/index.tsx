import React, { useState, useMemo } from 'react'
import { View, Text, Image, Button, Textarea, ScrollView, Input } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import dayjs from 'dayjs'
import { useAppStore } from '@/store'
import styles from './index.module.scss'

const VerifyItemPage: React.FC = () => {
  const router = useRouter()
  const itemId = router.params.id || 'item001'
  const taskId = router.params.taskId || 'task001'
  
  const { 
    getTaskVerifyData, 
    updateCheckPoint, 
    updateVerifyItem,
    addPhoto,
    removePhoto,
    addIssue,
    tasks
  } = useAppStore()

  const verifyData = useMemo(() => getTaskVerifyData(taskId), [taskId, getTaskVerifyData])
  
  const item = useMemo(() => {
    for (const category of verifyData.categories) {
      const found = category.items.find(i => i.id === itemId)
      if (found) return found
    }
    return undefined
  }, [verifyData.categories, itemId])

  const task = useMemo(() => tasks.find(t => t.id === taskId), [tasks, taskId])

  const [remark, setRemark] = useState(item?.remark || '')
  const [photos, setPhotos] = useState<string[]>(item?.photos || [])
  const [showRectifyModal, setShowRectifyModal] = useState(false)
  const [rectifyLocation, setRectifyLocation] = useState('')
  const [rectifyDeadline, setRectifyDeadline] = useState(
    dayjs().add(7, 'day').format('YYYY-MM-DD')
  )
  const [rectifyDescription, setRectifyDescription] = useState('')
  const [rectifySeverity, setRectifySeverity] = useState<'major' | 'minor'>('minor')

  const handleCheckToggle = (checkPointId: string, checked: boolean) => {
    updateCheckPoint(taskId, itemId, checkPointId, checked)
  }

  const handleAddPhoto = () => {
    Taro.chooseImage({
      count: 9 - photos.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        res.tempFilePaths.forEach(photo => {
          addPhoto(taskId, itemId, photo)
        })
        setPhotos([...photos, ...res.tempFilePaths].slice(0, 9))
        console.log('[VerifyItem] 新增照片:', res.tempFilePaths.length, '张')
      },
      fail: (err) => {
        console.error('[VerifyItem] 选择图片失败:', err)
      }
    })
  }

  const handleDeletePhoto = (index: number) => {
    removePhoto(taskId, itemId, index)
    const newPhotos = photos.filter((_, i) => i !== index)
    setPhotos(newPhotos)
  }

  const handleSubmitResult = (result: 'pass' | 'fail' | 'rectify') => {
    if (!item) return

    if (result === 'rectify') {
      setShowRectifyModal(true)
      return
    }

    const resultText = {
      pass: '核验通过',
      fail: '核验不通过',
      rectify: '需整改'
    }

    Taro.showModal({
      title: '确认提交',
      content: `确定将本项核验结果设为「${resultText[result]}」吗？`,
      confirmText: '确认提交',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          updateVerifyItem(taskId, itemId, {
            status: result,
            remark,
            photos
          })
          
          console.log('[VerifyItem] 提交核验结果:', result)
          Taro.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1500
          })
          setTimeout(() => {
            Taro.navigateBack()
          }, 1500)
        }
      }
    })
  }

  const handleSaveRectify = () => {
    if (!item) return
    
    if (!rectifyLocation.trim()) {
      Taro.showToast({
        title: '请填写问题位置',
        icon: 'none'
      })
      return
    }
    
    if (!rectifyDescription.trim()) {
      Taro.showToast({
        title: '请填写整改说明',
        icon: 'none'
      })
      return
    }

    addIssue(taskId, {
      taskId,
      orgName: task?.orgName || '',
      itemName: item.name,
      description: rectifyDescription,
      photoUrl: photos[0] || '',
      severity: rectifySeverity,
      rectifyDeadline,
      status: 'pending'
    })

    updateVerifyItem(taskId, itemId, {
      status: 'rectify',
      remark,
      photos
    })

    setShowRectifyModal(false)

    Taro.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 1500
    })
    
    setTimeout(() => {
      Taro.navigateBack()
    }, 1500)
  }

  if (!item) {
    return (
      <View className={styles.page}>
        <View style={{ padding: '120rpx 32rpx', textAlign: 'center' }}>
          <Text>未找到核验项信息</Text>
        </View>
      </View>
    )
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.itemTitle}>{item.name}</Text>
        <View className={styles.itemCategory}>
          <Text>{item.categoryName}</Text>
        </View>
      </View>

      <ScrollView 
        scrollY 
        className={styles.content}
        style={{ height: 'calc(100vh - 180rpx - 180rpx)' }}
      >
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>📝</Text>
            核验说明
          </Text>
          <Text className={styles.descText}>{item.description}</Text>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>📋</Text>
            核验要求
          </Text>
          <View className={styles.requirementBox}>
            <Text className={styles.requirementLabel}>核验标准</Text>
            <Text className={styles.requirementText}>{item.requirement}</Text>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>✅</Text>
            检查要点
            <Text style={{ fontSize: 24, color: '#86909c', marginLeft: 'auto', fontWeight: 'normal' }}>
              {item.checkPoints.filter(cp => cp.checked).length}/{item.checkPoints.length}
            </Text>
          </Text>
          <View className={styles.checkList}>
            {item.checkPoints.map(cp => (
              <View 
                key={cp.id} 
                className={styles.checkItem}
                onClick={() => handleCheckToggle(cp.id, !cp.checked)}
              >
                <View className={classnames(styles.checkbox, cp.checked && styles.checked)}>
                  {cp.checked && <Text className={styles.checkIcon}>✓</Text>}
                </View>
                <View className={styles.checkContent}>
                  <Text className={styles.checkName}>{cp.name}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className={`${styles.section} ${styles.photoSection}`}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>📷</Text>
            拍照留存
          </Text>
          <View className={styles.photoGrid}>
            {photos.map((photo, index) => (
              <View key={index} className={styles.photoItem}>
                <Image 
                  className={styles.photoImg}
                  src={photo} 
                  mode="aspectFill"
                  onClick={() => {
                    Taro.previewImage({
                      current: photo,
                      urls: photos
                    })
                  }}
                />
                <View 
                  className={styles.photoDelete}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeletePhoto(index)
                  }}
                >
                  <Text>×</Text>
                </View>
              </View>
            ))}
            {photos.length < 9 && (
              <View className={styles.photoAdd} onClick={handleAddPhoto}>
                <Text className={styles.photoAddIcon}>+</Text>
                <Text className={styles.photoAddText}>拍照取证</Text>
              </View>
            )}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>💬</Text>
            备注说明
          </Text>
          <Textarea
            className={styles.remarkInput}
            placeholder="请输入核验备注说明（选填）"
            value={remark}
            onInput={(e) => setRemark(e.detail.value)}
            maxlength={500}
          />
        </View>
      </ScrollView>

      <View className={styles.bottomBar}>
        <Button 
          className={`${styles.btn} ${styles.btnSuccess}`}
          onClick={() => handleSubmitResult('pass')}
        >
          通过
        </Button>
        <Button 
          className={`${styles.btn} ${styles.btnWarning}`}
          onClick={() => handleSubmitResult('rectify')}
        >
          需整改
        </Button>
        <Button 
          className={`${styles.btn} ${styles.btnDanger}`}
          onClick={() => handleSubmitResult('fail')}
        >
          不通过
        </Button>
      </View>

      {showRectifyModal && (
        <View className={styles.modalOverlay}>
          <View className={styles.modalContent}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>填写整改信息</Text>
              <View className={styles.modalClose} onClick={() => setShowRectifyModal(false)}>
                <Text>×</Text>
              </View>
            </View>

            <ScrollView scrollY className={styles.modalBody}>
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>问题位置</Text>
                <Input
                  className={styles.formInput}
                  placeholder="请输入问题具体位置"
                  value={rectifyLocation}
                  onInput={(e) => setRectifyLocation(e.detail.value)}
                  maxlength={100}
                />
              </View>

              <View className={styles.formItem}>
                <Text className={styles.formLabel}>严重程度</Text>
                <View className={styles.severityRow}>
                  <View 
                    className={classnames(styles.severityOption, rectifySeverity === 'minor' && styles.active)}
                    onClick={() => setRectifySeverity('minor')}
                  >
                    <Text>一般问题</Text>
                  </View>
                  <View 
                    className={classnames(styles.severityOption, rectifySeverity === 'major' && styles.activeMajor)}
                    onClick={() => setRectifySeverity('major')}
                  >
                    <Text>重大问题</Text>
                  </View>
                </View>
              </View>

              <View className={styles.formItem}>
                <Text className={styles.formLabel}>整改期限</Text>
                <Input
                  className={styles.formInput}
                  placeholder="YYYY-MM-DD"
                  value={rectifyDeadline}
                  onInput={(e) => setRectifyDeadline(e.detail.value)}
                />
              </View>

              <View className={styles.formItem}>
                <Text className={styles.formLabel}>整改说明</Text>
                <Textarea
                  className={styles.formTextarea}
                  placeholder="请详细描述问题及整改要求"
                  value={rectifyDescription}
                  onInput={(e) => setRectifyDescription(e.detail.value)}
                  maxlength={500}
                />
              </View>
            </ScrollView>

            <View className={styles.modalFooter}>
              <Button 
                className={`${styles.modalBtn} ${styles.modalBtnOutline}`}
                onClick={() => setShowRectifyModal(false)}
              >
                取消
              </Button>
              <Button 
                className={`${styles.modalBtn} ${styles.modalBtnPrimary}`}
                onClick={handleSaveRectify}
              >
                保存
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

export default VerifyItemPage
