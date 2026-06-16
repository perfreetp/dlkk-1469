import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import { VerifyCategory } from '@/types'
import styles from './index.module.scss'

interface VerifyCategoryCardProps {
  category: VerifyCategory
  expanded?: boolean
  onClick?: () => void
}

const VerifyCategoryCard: React.FC<VerifyCategoryCardProps> = ({ category, expanded = false, onClick }) => {
  const progress = category.total > 0 ? (category.completed / category.total) * 100 : 0
  const isAllDone = category.completed === category.total && category.total > 0

  return (
    <View 
      className={classnames(styles.categoryCard, expanded && styles.expanded)} 
      onClick={onClick}
    >
      <View className={styles.cardInner}>
        <View className={styles.iconWrap}>
          <Text className={styles.icon}>{category.icon}</Text>
        </View>
        <View className={styles.info}>
          <Text className={styles.name}>{category.name}</Text>
          <Text className={styles.progressText}>
            {category.completed}/{category.total} 项
          </Text>
        </View>
        <View className={styles.arrow}>
          <Text className={classnames(styles.arrowIcon, expanded && styles.up)}>›</Text>
        </View>
      </View>
      <View className={styles.progressBar}>
        <View 
          className={classnames(styles.progressFill, isAllDone && styles.allDone)} 
          style={{ width: `${progress}%` }}
        />
      </View>
    </View>
  )
}

export default VerifyCategoryCard
