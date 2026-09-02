import { Template } from './template.model.js';
import { EmployeeProfile } from '../employee-profile/employeeProfile.model.js';
import { NotFoundError, ConflictError, BadRequestError } from '../../errors/index.js';
import { ERROR_CODES } from '../../constants/errorCodes.constant.js';
import { eventBus } from '../../events/appEventBus.js';
import { APP_EVENTS } from '../../constants/events.constant.js';

class TemplateService {
  async getAllTemplates({ category, isActive = true, includeArchived = false, search = '' } = {}) {
    const filter = {};
    if (!includeArchived) filter.isArchived = false;
    if (isActive !== undefined && isActive !== null) filter.isActive = isActive;
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    return await Template.find(filter).sort({ isDefault: -1, category: 1, name: 1 }).lean();
  }

  async getTemplateById(id) {
    const template = await Template.findById(id).lean();
    if (!template) {
      throw new NotFoundError('Template not found', ERROR_CODES.TEMPLATE_NOT_FOUND);
    }
    return template;
  }

  async getDefaultTemplate() {
    let template = await Template.findOne({ isDefault: true, isActive: true, isArchived: false }).lean();
    if (!template) {
      template = await Template.findOne({ isActive: true, isArchived: false }).sort({ createdAt: 1 }).lean();
    }
    return template;
  }

  async createTemplate(data, actorContext = {}) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const existing = await Template.findOne({ $or: [{ name: data.name }, { slug }] });
    if (existing) {
      throw new ConflictError(`Template with name '${data.name}' already exists.`);
    }

    if (data.isDefault) {
      await Template.updateMany({ isDefault: true }, { isDefault: false });
    }

    const template = await Template.create({
      ...data,
      slug,
      version: 1,
      versionHistory: [
        {
          version: 1,
          layoutConfig: data.layoutConfig || {},
          sectionOrder: data.sectionOrder || [],
          modifiedBy: actorContext.actorId,
          changeSummary: 'Initial template creation'
        }
      ]
    });

    eventBus.emitEvent(APP_EVENTS.TEMPLATE_CREATED, {
      actorId: actorContext.actorId,
      resourceId: template._id,
      templateName: template.name,
      context: actorContext
    });

    return template;
  }

  async updateTemplate(id, updateData, actorContext = {}) {
    const template = await Template.findById(id);
    if (!template) {
      throw new NotFoundError('Template not found', ERROR_CODES.TEMPLATE_NOT_FOUND);
    }

    const previousValue = template.toObject();

    if (updateData.name && updateData.name !== template.name) {
      const slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const existing = await Template.findOne({
        _id: { $ne: id },
        $or: [{ name: updateData.name }, { slug }]
      });
      if (existing) {
        throw new ConflictError(`Template with name '${updateData.name}' already exists.`);
      }
      template.name = updateData.name;
      template.slug = slug;
    }

    if (updateData.isDefault && !template.isDefault) {
      await Template.updateMany({ isDefault: true }, { isDefault: false });
      template.isDefault = true;
    }

    // Version history snapshot if layout or sections changed
    const hasVisualChanges = updateData.layoutConfig || updateData.sectionOrder || updateData.availableSections;
    if (hasVisualChanges) {
      template.versionHistory.push({
        version: template.version,
        layoutConfig: template.layoutConfig,
        sectionOrder: template.sectionOrder,
        modifiedBy: actorContext.actorId,
        changeSummary: updateData.changeSummary || 'Template updated',
        createdAt: new Date()
      });
      template.version += 1;
    }

    if (updateData.category) template.category = updateData.category;
    if (updateData.description !== undefined) template.description = updateData.description;
    if (updateData.previewImageUrl !== undefined) template.previewImageUrl = updateData.previewImageUrl;
    if (updateData.layoutConfig) template.layoutConfig = { ...template.layoutConfig, ...updateData.layoutConfig };
    if (updateData.availableSections) template.availableSections = updateData.availableSections;
    if (updateData.sectionOrder) template.sectionOrder = updateData.sectionOrder;
    if (updateData.isActive !== undefined) template.isActive = updateData.isActive;

    await template.save();

    eventBus.emitEvent(APP_EVENTS.TEMPLATE_UPDATED, {
      actorId: actorContext.actorId,
      resourceId: template._id,
      previousValue,
      newValue: template.toObject(),
      context: actorContext
    });

    return template;
  }

  async duplicateTemplate(id, newName, actorContext = {}) {
    const original = await Template.findById(id).lean();
    if (!original) {
      throw new NotFoundError('Original template not found', ERROR_CODES.TEMPLATE_NOT_FOUND);
    }

    const name = newName || `${original.name} (Copy)`;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const duplicate = await Template.create({
      name,
      slug,
      category: original.category,
      description: original.description,
      previewImageUrl: original.previewImageUrl,
      layoutConfig: original.layoutConfig,
      availableSections: original.availableSections,
      sectionOrder: original.sectionOrder,
      version: 1,
      isDefault: false,
      isActive: true,
      versionHistory: [
        {
          version: 1,
          layoutConfig: original.layoutConfig,
          sectionOrder: original.sectionOrder,
          modifiedBy: actorContext.actorId,
          changeSummary: `Cloned from ${original.name}`
        }
      ]
    });

    return duplicate;
  }

  async archiveTemplate(id, actorContext = {}) {
    const template = await Template.findById(id);
    if (!template) {
      throw new NotFoundError('Template not found', ERROR_CODES.TEMPLATE_NOT_FOUND);
    }

    if (template.isDefault) {
      throw new BadRequestError('Cannot archive the default template. Please designate another template as default first.');
    }

    template.isArchived = true;
    template.isActive = false;
    await template.save();

    eventBus.emitEvent(APP_EVENTS.TEMPLATE_DELETED, {
      actorId: actorContext.actorId,
      resourceId: template._id,
      templateName: template.name,
      context: actorContext
    });

    return { message: `Template '${template.name}' has been archived.` };
  }
}

export const templateService = new TemplateService();
