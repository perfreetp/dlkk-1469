import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'

const menuGroups = [
  {
    title: '工作记录',
    items: [
      { icon: '📋', iconClass: 'blue', title: '核验记录', desc: '查看历史核验任务' },
      { icon: '🔍', iconClass: 'green', title: '整改追踪', desc: '跟踪问题整改情况' },
      { icon: '📊', iconClass: 'orange', title: '统计分析', desc: '核验数据统计分析' }
    ]
  },
  {
    title: '工具辅助',
    items: [
      { icon: '✍️', iconClass: 'purple', title: '电子签名', desc: '管理个人电子签名' },
      { icon: '📷', iconClass: 'cyan', title: '拍照取证', desc: '快速拍照记录问题' },
      { icon: '📍', iconClass: 'red', title: '位置打卡', desc: '核验位置打卡记录' }
    ]
  },
  {
    title: '系统设置',
    items: [
      { icon: '⚙️', iconClass: '', title: '系统设置', desc: '通用设置与偏好' },
      { icon: '❓', iconClass: '', title: '帮助中心', desc: '使用说明与常见问题' },
      { icon: 'ℹ️', iconClass: '', title: '关于我们', desc: '版本信息与版权' }
    ]
  }
]

const ProfilePage: React.FC = () => {
  const handleMenuItemClick = (title: string) => {
    console.log('[Profile] Click menu:', title)
    Taro.showToast({
      title: `${title}功能开发中`,
      icon: 'none',
      duration: 1500
    })
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.userInfo}>
          <View className={styles.avatar}>
            <Text className={styles.avatarIcon}>👨‍💼</Text>
          </View>
          <View className={styles.userDetail}>
            <Text className={styles.userName}>李建国</Text>
            <Text className={styles.userDept}>卫生健康综合行政执法队</Text>
            <Text className={styles.userPosition}>一级行政执法员 · 协管员</Text>
          </View>
        </View>
      </View>

      <View className={styles.statsSection}>
        <View className={styles.statsCard}>
          <Text className={styles.statsTitle}>工作数据</Text>
          <View className={styles.statsGrid}>
            <View className={styles.statItem}>
              <Text className={styles.statNumber}>4</Text>
              <Text className={styles.statLabel}>今日核验</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statNumber}>86</Text>
              <Text className={styles.statLabel}>本月核验</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statNumber}>328</Text>
              <Text className={styles.statLabel}>累计核验</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statNumber}>15</Text>
              <Text className={styles.statLabel}>待整改</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.menuSection}>
        {menuGroups.map((group, groupIndex) => (
          <View key={groupIndex} className={styles.menuGroup}>
            <Text className={styles.menuGroupTitle}>{group.title}</Text>
            {group.items.map((item, itemIndex) => (
              <View 
                key={itemIndex} 
                className={styles.menuItem}
                onClick={() => handleMenuItemClick(item.title)}
              >
                <View className={classnames(styles.menuIcon, styles[item.iconClass])}>
                  <Text>{item.icon}</Text>
                </View>
                <View className={styles.menuContent}>
                  <Text className={styles.menuTitle}>{item.title}</Text>
                  {item.desc && <Text className={styles.menuDesc}>{item.desc}</Text>}
                </View>
                <Text className={styles.menuArrow}>›</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      <View className={styles.footer}>
        <Text className={styles.version}>医疗机构实地核验 v1.0.0</Text>
        <Text className={styles.version}>© 2024 卫生健康委员会</Text>
      </View>
    </View>
  )
}

export default ProfilePage
