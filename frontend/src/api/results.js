import api from '../lib/axios'

export const getResult = (studentId) =>
  api.get(`/results/${studentId}`).then((r) => r.data)
