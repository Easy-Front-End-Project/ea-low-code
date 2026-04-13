import { httpRequest } from '../utils/request.js'

const apiList = {
  list: '/pages/list',
  detail: '/pages/detail',
  create: '/pages/create',
  update: '/pages/update',
  delete: '/pages/delete',
  clone: '/pages/clone',
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

export function createProject(data) {
  return httpRequest(apiList.create, {
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
