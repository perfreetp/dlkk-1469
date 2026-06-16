import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import StatusTag from '../StatusTag'
import { VerifyItem } from '@/types'
import styles from './index.module.scss'

interface CheckItemProps {
  item: VerifyItem
  onClick?: () => void
}

const CheckItem: React.FC<CheckItemProps> = ({ item, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      Taro.navigateTo({
        url: `/pages/verify-item/index?id=${item.id}`
      })
    }
  }

  return (
    <View className={styles.checkItem} onClick={handleClick}>
      <View className={styles.itemInfo}>
        <Text className={styles.itemName}>{item.name}</Text>
        <Text className={styles.itemDesc}>{item.description}</Text>
      </View>
      <View className={styles.itemRight}>
        <StatusTag status={item.status} size="sm" />
        <Text className={styles.arrow}>›</Text>
      </View>
    </View>
  )
}

export default CheckItem
