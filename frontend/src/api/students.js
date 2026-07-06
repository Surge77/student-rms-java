import api from '../lib/axios'

export const getStudents = (page = 0, size = 10) =>
  api.get(`/students?page=${page}&size=${size}&sort=name,asc`).then((r) => r.data)

export const getAllStudents = () =>
  api.get('/students?page=0&size=1000&sort=name,asc').then((r) => r.data)

export const createStudent = (data) => api.post('/students', data).then((r) => r.data)

export const updateStudent = (id, data) =>
  api.put(`/students/${id}`, data).then((r) => r.data)

export const deleteStudent = (id) => api.delete(`/students/${id}`)
