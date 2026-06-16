import React, { useMemo } from 'react'
import { View, Text, Image, Button, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import StatusTag from '@/components/StatusTag'
import { getTaskById } from '@/data/tasks'
import styles from './index.module.scss'

const OrgDetailPage: React.FC = () => {
  const router = useRouter()
  const taskId = router.params.id || 'task001'
  
  const task = useMemo(() => getTaskById(taskId), [taskId])

  const handleStartVerify = () => {
    Taro.switchTab({
      url: '/pages/verify/index'
    })
  }

  const handleCall = () => {
    if (task) {
      Taro.makePhoneCall({
        phoneNumber: task.contactPhone.replace(/\*/g, '0')
      }).catch(() => {
        console.log('[OrgDetail] 拨打电话取消或失败')
      })
    }
  }

  if (!task) {
    return (
      <View className={styles.page}>
        <View style={{ padding: '120rpx 32rpx', textAlign: 'center' }}>
          <Text>未找到机构信息</Text>
        </View>
      </View>
    )
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.orgName}>{task.orgName}</Text>
        <View className={styles.orgMeta}>
          <View className={styles.metaTag}>
            <Text>{task.orgType}</Text>
          </View>
          <StatusTag status={task.status} size="sm" />
        </View>
      </View>

      <ScrollView 
        scrollY 
        className={styles.content}
        style={{ height: 'calc(100vh - 280rpx - 160rpx)' }}
      >
        <View className={styles.card}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>📍</Text>
            基本信息
          </Text>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>机构地址</Text>
            <Text className={styles.infoValue}>{task.orgAddress}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>预约时间</Text>
            <Text className={styles.infoValue}>{task.appointmentTime}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>路线顺序</Text>
            <Text className={styles.infoValue}>第 {task.routeIndex} 站</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>联系人</Text>
            <Text className={styles.infoValue}>{task.contactPerson} ({task.contactPhone})</Text>
          </View>
        </View>

        <View className={styles.card}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>🏥</Text>
            诊疗科目
          </Text>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>诊疗范围</Text>
            <Text className={styles.infoValue}>{task.businessScope}</Text>
          </View>
        </View>

        <View className={styles.card}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>📐</Text>
            申报平面图
          </Text>
          <View className={styles.floorPlan}>
            <Image 
              className={styles.floorPlanImg}
              src={task.floorPlanUrl} 
              mode="aspectFill"
            />
          </View>
        </View>
      </ScrollView>

      <View className={styles.bottomBar}>
        <Button 
          className={`${styles.btn} ${styles.btnOutline}`}
          onClick={handleCall}
        >
          联系机构
        </Button>
        <Button 
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={handleStartVerify}
        >
          开始核验
        </Button>
      </View>
    </View>
  )
}

export default OrgDetailPage
