import api from '../lib/axios'

export const getMarksByStudent = (studentId) =>
  api.get(`/marks/${studentId}`).then((r) => r.data)

export const createMark = (data) => api.post('/marks', data).then((r) => r.data)

export const updateMark = (id, data) => api.put(`/marks/${id}`, data).then((r) => r.data)
