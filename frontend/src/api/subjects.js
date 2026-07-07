import api from '../lib/axios'

export const getSubjects = (page = 0, size = 10) =>
  api.get(`/subjects?page=${page}&size=${size}&sort=name,asc`).then((r) => r.data)

export const getAllSubjects = () =>
  api.get('/subjects?page=0&size=1000&sort=name,asc').then((r) => r.data)

export const createSubject = (data) => api.post('/subjects', data).then((r) => r.data)

export const updateSubject = (id, data) =>
  api.put(`/subjects/${id}`, data).then((r) => r.data)

export const deleteSubject = (id) => api.delete(`/subjects/${id}`)
