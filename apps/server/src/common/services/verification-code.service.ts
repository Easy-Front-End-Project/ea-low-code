import { Injectable, Logger } from '@nestjs/common'

interface VerificationCodeData {
  code: string
  email: string
  purpose: string
  expireTime: number
}

@Injectable()
export class VerificationCodeService {
  private readonly logger = new Logger(VerificationCodeService.name)

  // 使用内存存储验证码（生产环境建议使用 Redis）
  private codeStore = new Map<string, VerificationCodeData>()

  // 验证码有效期：5分钟（毫秒）
  private readonly CODE_EXPIRE_TIME = 5 * 60 * 1000

  // 同一邮箱发送间隔：60秒（毫秒）
  private readonly SEND_INTERVAL = 60 * 1000

  // 存储发送时间用于限制发送频率
  private lastSendTime = new Map<string, number>()

  constructor() {
    // 启动清理任务，每5分钟清理一次过期验证码
    setInterval(() => this.cleanExpiredCodes(), 5 * 60 * 1000)
  }

  /**
   * 生成验证码
   * @param email - 邮箱地址
   * @param purpose - 用途（register/resetPassword）
   * @returns 生成的验证码
   */
  generateCode(email: string, purpose: string = 'register'): string {
    // 检查发送频率
    const lastTime = this.lastSendTime.get(email)
    const now = Date.now()

    if (lastTime && now - lastTime < this.SEND_INTERVAL) {
      const remaining = Math.ceil((this.SEND_INTERVAL - (now - lastTime)) / 1000)
      throw new Error(`请等待 ${remaining} 秒后重试`)
    }

    // 生成6位数字验证码
    const code = Math.random().toString().slice(2, 8)

    // 存储验证码
    const key = this.getKey(email, purpose)
    this.codeStore.set(key, {
      code,
      email,
      purpose,
      expireTime: now + this.CODE_EXPIRE_TIME,
    })

    // 记录发送时间
    this.lastSendTime.set(email, now)

    this.logger.log(`验证码已生成: ${email} - ${purpose}`)

    return code
  }

  /**
   * 验证验证码
   * @param email - 邮箱地址
   * @param code - 验证码
   * @param purpose - 用途
   * @returns 是否验证成功
   */
  verifyCode(email: string, code: string, purpose: string = 'register'): boolean {
    const key = this.getKey(email, purpose)
    const data = this.codeStore.get(key)

    if (!data) {
      return false
    }

    // 检查是否过期
    if (Date.now() > data.expireTime) {
      this.codeStore.delete(key)
      return false
    }

    // 验证验证码
    if (data.code === code) {
      // 验证成功后删除验证码（一次性使用）
      this.codeStore.delete(key)
      return true
    }

    return false
  }

  /**
   * 删除验证码
   * @param email - 邮箱地址
   * @param purpose - 用途
   */
  deleteCode(email: string, purpose: string = 'register'): void {
    const key = this.getKey(email, purpose)
    this.codeStore.delete(key)
  }

  /**
   * 获取存储键
   */
  private getKey(email: string, purpose: string): string {
    return `${email}:${purpose}`
  }

  /**
   * 清理过期验证码
   */
  private cleanExpiredCodes(): void {
    const now = Date.now()
    let count = 0

    for (const [key, data] of this.codeStore.entries()) {
      if (now > data.expireTime) {
        this.codeStore.delete(key)
        count++
      }
    }

    if (count > 0) {
      this.logger.log(`清理了 ${count} 个过期验证码`)
    }
  }
}
