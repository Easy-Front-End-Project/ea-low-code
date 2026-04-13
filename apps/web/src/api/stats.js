import request from '@/utils/request.js'
import { apiList } from './config.js'

/**
 * 获取仪表盘统计数据
 * @returns {Promise<{projectCount: number, pageCount: number, componentCount: number, todayActivityCount: number}>}
 */
export const getDashboardStats = () => {
  return request.get(apiList.stats.dashboard)
}

/**
 * 获取最近项目
 * @returns {Promise<Array<{id: number, name: string, thumbnail: string, updatedAt: string}>>}
 */
export const getRecentProjects = () => {
  return request.get(apiList.stats.recentProjects)
}

/**
 * 获取最近活动
 * @returns {Promise<Array<{id: number, type: string, description: string, createdAt: string}>>}
 */
export const getRecentActivities = () => {
  return request.get(apiList.stats.activities)
}
