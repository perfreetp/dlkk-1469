import React, { useState, useMemo } from 'react'
import { View, Text, Image, Button, Textarea, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import { getVerifyItemById } from '@/data/verify-items'
import { VerifyItem, CheckPoint } from '@/types'
import styles from './index.module.scss'

const VerifyItemPage: React.FC = () => {
  const router = useRouter()
  const itemId = router.params.id || 'item001'

  const initialItem = useMemo(() => getVerifyItemById(itemId), [itemId])
  const [item, setItem] = useState<VerifyItem | undefined>(initialItem)
  const [remark, setRemark] = useState(initialItem?.remark || '')
  const [photos, setPhotos] = useState<string[]>(initialItem?.photos || [])

  const handleCheckToggle = (checkPointId: string) => {
    if (!item) return

    const updatedCheckPoints = item.checkPoints.map(cp => {
      if (cp.id === checkPointId) {
        const newChecked = !cp.checked
        return {
          ...cp,
          checked: newChecked,
          result: (newChecked ? 'pass' : 'na') as 'pass' | 'fail' | 'na'
        }
      }
      return cp
    })

    setItem({
      ...item,
      checkPoints: updatedCheckPoints
    })
  }

  const handleAddPhoto = () => {
    Taro.chooseImage({
      count: 3 - photos.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newPhotos = [...photos, ...res.tempFilePaths]
        setPhotos(newPhotos.slice(0, 9))
        console.log('[VerifyItem] 新增照片:', res.tempFilePaths.length, '张')
      },
      fail: (err) => {
        console.error('[VerifyItem] 选择图片失败:', err)
      }
    })
  }

  const handleDeletePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index)
    setPhotos(newPhotos)
  }

  const handleSubmitResult = (result: 'pass' | 'fail' | 'rectify') => {
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
                onClick={() => handleCheckToggle(cp.id)}
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
    </View>
  )
}

export default VerifyItemPage
