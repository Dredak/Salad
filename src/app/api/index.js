const BASE_URL = 'https://6077ebc2e7f4f5001718353f.mockapi.io'

const api = (path, options = {}) => {
  options.body && (options.body = JSON.stringify(options.body))
  options.headers = { ...options.headers, 'Content-Type': 'application/json' }

  return fetch(BASE_URL + path, options).then(res => {
    return res.ok ? res.json() : Promise.reject(new Error(res.statusText))
  })
}

export default api
