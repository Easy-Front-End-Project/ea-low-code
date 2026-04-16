import { httpRequest } from '../utils/request.js'

const apiList = {
  list: '/pages/list',
  detail: '/pages/detail',
  projectPages: '/pages/project-pages',
  pageDetail: '/pages/page-detail',
  create: '/pages/create',
  pageCreate: '/pages/page-create',
  update: '/pages/update',
  pageUpdate: '/pages/page-update',
  delete: '/pages/delete',
  clone: '/pages/clone',
  pageDelete: '/pages/page-delete',
  pageClone: '/pages/page-clone',
  import: '/pages/import',
  export: '/pages/export',
}

export function getProjects(params) {
  return httpRequest(apiList.list, {
    method: 'get',
    params,
  })
}

export function getProjectDetail(id) {
  return httpRequest(apiList.detail, {
    method: 'get',
    params: { id },
  })
}

export function getProjectPages(projectId) {
  return httpRequest(apiList.projectPages, {
    method: 'get',
    params: { projectId: Number(projectId) },
  })
}

export function getPageDetail(pageId) {
  return httpRequest(apiList.pageDetail, {
    method: 'get',
    params: { id: Number(pageId) },
  })
}

export function createProject(data) {
  return httpRequest(apiList.create, {
    method: 'post',
    data,
  })
}

export function createPage(data) {
  return httpRequest(apiList.pageCreate, {
    method: 'post',
    data,
  })
}

export function updateProject(data) {
  return httpRequest(apiList.update, {
    method: 'post',
    data,
  })
}

export function updatePage(data) {
  return httpRequest(apiList.pageUpdate, {
    method: 'post',
    data,
  })
}

export function deleteProject(id) {
  return httpRequest(apiList.delete, {
    method: 'post',
    data: { id },
  })
}

export function cloneProject(id) {
  return httpRequest(apiList.clone, {
    method: 'post',
    data: { id },
  })
}

export function deletePage(id) {
  return httpRequest(apiList.pageDelete, {
    method: 'post',
    data: { id: Number(id) },
  })
}

export function clonePage(id) {
  return httpRequest(apiList.pageClone, {
    method: 'post',
    data: { id: Number(id) },
  })
}

export function importProject(data) {
  return httpRequest(apiList.import, {
    method: 'post',
    data,
  })
}

export function exportProject(id) {
  return httpRequest(`${apiList.export}/${id}`, {
    method: 'get',
  })
}
