import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { comparePassword, hashPassword } from '../common/utils/crypto.util';
import { EmailService } from '../common/services/email.service';
import { VerificationCodeService } from '../common/services/verification-code.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
    private verificationCodeService: VerificationCodeService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    // 支持用邮箱或用户名登录
    const user = await this.usersRepository.findOne({
      where: [{ username }, { email: username }],
      select: [
        'id',
        'username',
        'email',
        'password',
        'nickname',
        'isActive',
        'createdAt',
        'updatedAt',
      ],
    });
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const { password: _, ...result } = user;
    return result;
  }

  /**
   * 根据ID查找用户
   * @param id - 用户ID
   */
  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: [
        'id',
        'username',
        'email',
        'password',
        'nickname',
        'isActive',
        'createdAt',
        'updatedAt',
      ],
    });
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }
    return user;
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; user: Omit<User, 'password'> }> {
    const user = await this.validateUser(loginDto.username, loginDto.password);

    const payload = { sub: user.id, username: user.username };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  /**
   * 发送验证码
   * @param email - 邮箱地址
   * @param purpose - 用途（register/resetPassword）
   */
  async sendVerificationCode(
    email: string,
    purpose: string = 'register',
  ): Promise<{ message: string }> {
    // 根据用途进行不同的校验
    if (purpose === 'register') {
      // 注册时检查邮箱是否已存在
      const existingUser = await this.usersRepository.findOne({
        where: { email },
      });
      if (existingUser) {
        throw new BadRequestException('该邮箱已被注册');
      }
    } else if (purpose === 'resetPassword') {
      // 重置密码时检查邮箱是否存在
      const existingUser = await this.usersRepository.findOne({
        where: { email },
      });
      if (!existingUser) {
        throw new NotFoundException('该邮箱未注册');
      }
    }

    // 生成验证码
    const code = this.verificationCodeService.generateCode(email, purpose);

    // 发送邮件
    const purposeMap: { [key: string]: string } = {
      register: '注册',
      resetPassword: '重置密码',
    };
    const purposeText = purposeMap[purpose] || '验证';

    const sent = await this.emailService.sendVerificationCode(
      email,
      code,
      purposeText,
    );

    if (!sent) {
      throw new BadRequestException('发送验证码失败，请稍后重试');
    }

    return { message: '验证码已发送' };
  }

  /**
   * 验证验证码
   * @param email - 邮箱地址
   * @param code - 验证码
   * @param purpose - 用途
   */
  async verifyCode(
    email: string,
    code: string,
    purpose: string = 'register',
  ): Promise<{ valid: boolean }> {
    const isValid = this.verificationCodeService.verifyCode(
      email,
      code,
      purpose,
    );
    return { valid: isValid };
  }

  /**
   * 重置密码
   * @param resetPasswordDto - 重置密码数据
   */
  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { email, newPassword, code } = resetPasswordDto;

    // 验证验证码
    const isCodeValid = this.verificationCodeService.verifyCode(
      email,
      code,
      'resetPassword',
    );
    if (!isCodeValid) {
      throw new BadRequestException('验证码无效或已过期');
    }

    // 查找用户
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 加密新密码
    const hashedPassword = await hashPassword(newPassword);

    // 更新密码
    user.password = hashedPassword;
    await this.usersRepository.save(user);

    return { message: '密码重置成功' };
  }

  /**
   * 修改密码（需要旧密码验证）
   * @param userId - 用户ID
   * @param oldPassword - 旧密码
   * @param newPassword - 新密码
   */
  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    // 查找用户（包含密码字段）
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['id', 'password'],
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 验证旧密码
    const isOldPasswordValid = await comparePassword(
      oldPassword,
      user.password,
    );
    if (!isOldPasswordValid) {
      throw new BadRequestException('旧密码错误');
    }

    // 加密新密码
    const hashedPassword = await hashPassword(newPassword);

    // 更新密码
    user.password = hashedPassword;
    await this.usersRepository.save(user);

    return { message: '密码修改成功' };
  }
}
