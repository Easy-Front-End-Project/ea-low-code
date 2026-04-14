import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RemoteComponent } from './entities/remote-component.entity';
import { UrlPreset } from './entities/url-preset.entity';
import { CreateComponentDto } from './dto/create-component.dto';

@Injectable()
export class ComponentsService {
  constructor(
    @InjectRepository(RemoteComponent)
    private componentRepository: Repository<RemoteComponent>,
    @InjectRepository(UrlPreset)
    private urlPresetRepository: Repository<UrlPreset>
  ) {}

  async findAllComponents(userId: number) {
    const components = await this.componentRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return {
      list: components.map((comp) => ({
        id: comp.id,
        name: comp.name,
        url: comp.componentUrl,
        urlPresetId: comp.urlPresetId,
        exportName: comp.exportName,
        type: comp.type,
        icon: comp.icon,
        styleUrl: comp.styleUrl,
        enabled: comp.isEnabled,
        description: comp.description,
        props: comp.props || [],
        events: comp.events || [],
        slots: comp.slots || [],
        createdAt: comp.createdAt,
        updatedAt: comp.updatedAt,
      })),
      total: components.length,
    };
  }

  async findOneComponent(id: number, userId: number) {
    const component = await this.componentRepository.findOne({
      where: { id, userId },
    });
    if (!component) throw new NotFoundException('组件不存在');
    return component;
  }

  async createComponent(userId: number, dto: CreateComponentDto) {
    const existing = await this.componentRepository.findOne({
      where: { name: dto.name, userId },
    });
    if (existing) throw new BadRequestException('组件名称已存在');
    const component = this.componentRepository.create({
      ...dto,
      userId,
      isEnabled: dto.enabled !== false,
    });
    return await this.componentRepository.save(component);
  }

  async updateComponent(id: number, userId: number, data: Record<string, any>) {
    await this.findOneComponent(id, userId);
    const { url: componentUrl, enabled: isEnabled, ...rest } = data;
    const updateData = { ...rest };
    if (componentUrl !== undefined) updateData.componentUrl = componentUrl;
    if (isEnabled !== undefined) updateData.isEnabled = isEnabled;
    await this.componentRepository.update(id, updateData);
    return this.findOneComponent(id, userId);
  }

  async removeComponent(id: number, userId: number) {
    const component = await this.findOneComponent(id, userId);
    return await this.componentRepository.remove(component);
  }

  async toggleComponentEnabled(id: number, userId: number, enabled: boolean) {
    await this.findOneComponent(id, userId);
    await this.componentRepository.update(id, { isEnabled: enabled });
    return { success: true };
  }

  async findAllPresets(userId: number) {
    return await this.urlPresetRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findDefaultPreset(userId: number) {
    return await this.urlPresetRepository.findOne({
      where: { userId, isDefault: true },
    });
  }

  async createPreset(
    userId: number,
    data: { name?: string; url?: string; isDefault?: boolean }
  ) {
    if (data.isDefault)
      await this.urlPresetRepository.update(
        { userId, isDefault: true },
        { isDefault: false }
      );
    const preset = this.urlPresetRepository.create({
      ...data,
      userId,
      isDefault: data.isDefault || false,
    });
    return await this.urlPresetRepository.save(preset);
  }

  async updatePreset(id: number, userId: number, data: Record<string, any>) {
    const preset = await this.urlPresetRepository.findOne({
      where: { id, userId },
    });
    if (!preset) throw new NotFoundException('URL 预设不存在');
    if (data.isDefault)
      await this.urlPresetRepository.update(
        { userId, isDefault: true },
        { isDefault: false }
      );
    Object.assign(preset, data);
    return await this.urlPresetRepository.save(preset);
  }

  async removePreset(id: number, userId: number) {
    const preset = await this.urlPresetRepository.findOne({
      where: { id, userId },
    });
    if (!preset) throw new NotFoundException('URL 预设不存在');
    return await this.urlPresetRepository.remove(preset);
  }

  async setDefaultPreset(id: number, userId: number) {
    const preset = await this.urlPresetRepository.findOne({
      where: { id, userId },
    });
    if (!preset) throw new NotFoundException('URL 预设不存在');
    await this.urlPresetRepository.update(
      { userId, isDefault: true },
      { isDefault: false }
    );
    preset.isDefault = true;
    return await this.urlPresetRepository.save(preset);
  }

  getFullUrl(
    component: { url: string; urlPresetId?: number },
    presets: UrlPreset[]
  ) {
    const { url, urlPresetId } = component;
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (urlPresetId) {
      const preset = presets.find((p) => p.id === urlPresetId);
      if (preset?.url) {
        const base = preset.url.endsWith('/') ? preset.url : `${preset.url}/`;
        const path = url.startsWith('/') ? url.slice(1) : url;
        return base + path;
      }
    }
    const defaultPreset = presets.find((p) => p.isDefault);
    if (defaultPreset?.url) {
      const base = defaultPreset.url.endsWith('/')
        ? defaultPreset.url
        : `${defaultPreset.url}/`;
      const path = url.startsWith('/') ? url.slice(1) : url;
      return base + path;
    }
    return url;
  }
}
