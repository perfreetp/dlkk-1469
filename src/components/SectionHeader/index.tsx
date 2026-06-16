import React from 'react'
import { View, Text } from '@tarojs/components'
import styles from './index.module.scss'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  extra?: React.ReactNode
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, extra }) => {
  return (
    <View className={styles.sectionHeader}>
      <View className={styles.left}>
        <View className={styles.decoration} />
        <Text className={styles.title}>{title}</Text>
      </View>
      {subtitle && <Text className={styles.subtitle}>{subtitle}</Text>}
      {extra && <View className={styles.extra}>{extra}</View>}
    </View>
  )
}

export default SectionHeader
