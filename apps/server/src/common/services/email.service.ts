import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'
import { Transporter } from 'nodemailer'

@Injectable()
export class EmailService {
  private transporter: Transporter
  private readonly logger = new Logger(EmailService.name)

  constructor(private configService: ConfigService) {
    this.initializeTransporter()
  }

  private initializeTransporter() {
    const host = this.configService.get<string>('SMTP_HOST', 'smtp.qq.com')
    const port = this.configService.get<number>('SMTP_PORT', 587)
    const user = this.configService.get<string>('SMTP_USER')
    const pass = this.configService.get<string>('SMTP_PASS')

    if (!user || !pass) {
      this.logger.warn('SMTP 配置不完整，邮件服务将使用控制台输出模式')
      return
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    })

    // 验证连接
    this.transporter.verify(error => {
      if (error) {
        this.logger.error('SMTP 连接验证失败:', error.message)
      } else {
        this.logger.log('SMTP 连接验证成功')
      }
    })
  }

  /**
   * 发送验证码邮件
   * @param to - 收件人邮箱
   * @param code - 验证码
   * @param purpose - 用途（注册/重置密码）
   */
  async sendVerificationCode(to: string, code: string, purpose: string = '注册'): Promise<boolean> {
    // 如果没有配置 SMTP，使用控制台输出模式（开发环境）
    if (!this.transporter) {
      this.logger.log(`[邮件模拟] 发送验证码到 ${to}: ${code} (用途: ${purpose})`)
      return true
    }

    const subject = `EA-LowCode - ${purpose}验证码`
    const html = this.generateVerificationEmailTemplate(code, purpose)

    try {
      const info = await this.transporter.sendMail({
        from: `"EA-LowCode" <${this.configService.get('SMTP_USER')}>`,
        to,
        subject,
        html,
      })

      this.logger.log(`验证码邮件已发送: ${info.messageId}`)
      return true
    } catch (error) {
      this.logger.error('发送验证码邮件失败:', error.message)
      return false
    }
  }

  /**
   * 生成验证码邮件模板
   */
  private generateVerificationEmailTemplate(code: string, purpose: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>验证码</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f7fa;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #409eff 0%, #337ecc 100%);
      padding: 32px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 32px;
    }
    .content p {
      color: #606266;
      font-size: 14px;
      line-height: 1.6;
      margin: 0 0 16px;
    }
    .code-box {
      background-color: #f5f7fa;
      border-radius: 8px;
      padding: 24px;
      text-align: center;
      margin: 24px 0;
    }
    .code {
      font-size: 32px;
      font-weight: 600;
      color: #409eff;
      letter-spacing: 4px;
    }
    .footer {
      padding: 24px 32px;
      background-color: #f5f7fa;
      text-align: center;
    }
    .footer p {
      color: #909399;
      font-size: 12px;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>EA-LowCode</h1>
    </div>
    <div class="content">
      <p>您好！</p>
      <p>您正在进行<strong>${purpose}</strong>操作，请在 5 分钟内输入以下验证码完成验证：</p>
      <div class="code-box">
        <div class="code">${code}</div>
      </div>
      <p>如非本人操作，请忽略此邮件。</p>
    </div>
    <div class="footer">
      <p>此邮件由系统自动发送，请勿回复</p>
    </div>
  </div>
</body>
</html>
    `
  }
}
