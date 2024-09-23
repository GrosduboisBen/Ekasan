/* eslint-disable quote-props */
import { useGlobalStore } from '@/stores/globalStore'

export const mainApiClient = {
  async log(url: string, body: Record<string, any>, params?: Record<string, string>): Promise<any> {
    const fullUrl = params ? `${apiMainBasePath}${url}${new URLSearchParams(params).toString()}` : `${apiMainBasePath}${url}`

    const requestBody = JSON.stringify(body)

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    })

    if (!response.ok)
      throw new Error('Erreur lors de la récupération des données')

    return response.json()
  },

  async get(url: string, params?: Record<string, string>): Promise<any> {
    const globalStore = useGlobalStore()
    const fullUrl = params ? `${apiMainBasePath}${url}?${new URLSearchParams(params).toString()}` : `${apiMainBasePath}${url}`

    const response = await fetch(fullUrl, {
      method: 'GET',

      headers: {
        'Authorization': `Bearer ${globalStore.getToken}`,
      },
    })

    if (!response.ok)
      throw new Error('Erreur lors de la récupération des données')

    return response.json()
  },
  async post(url: string, body: Record<string, any>, params?: Record<string, string>,form?:boolean): Promise<any> {
    const globalStore = useGlobalStore()

    const fullUrl = params ? `${apiMainBasePath}${url}${new URLSearchParams(params).toString()}` : `${apiMainBasePath}${url}`

    const response = await fetch(fullUrl, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Authorization': `Bearer ${globalStore.getToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok)
      throw new Error('Erreur lors de la récupération des données')

    return response.json()
  },

}

export const aiApiClient = {

  async get(url: string, params?: Record<string, string>): Promise<any> {
    const fullUrl = params ? `${apiAiBasePath}${url}?${new URLSearchParams(params).toString()}` : `${apiAiBasePath}${url}`

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok)
      throw new Error('Erreur lors de la récupération des données')

    return response.json()
  },
  async post(url: string, body: Record<string, any>, params?: Record<string, any>, formData?: boolean,isEncoded?:boolean): Promise<any> {
    const fullUrl = params ? `${apiAiBasePath}${url}${new URLSearchParams(params).toString()}` : `${apiAiBasePath}${url}`

    let fetchBody: any
    const headers: HeadersInit = {}

    if (formData) {
      // Utilisation de FormData pour les envois de fichiers
      fetchBody = new FormData()
      for (const key in body)
        fetchBody.append(key, body[key])
    }
    else {
      // Utilisation de JSON pour les autres requêtes
      fetchBody = JSON.stringify(body)
      headers['Content-Type'] = isEncoded ? 'application/x-www-form-urlencoded' : 'application/json'
    }

    const response = await fetch(fullUrl, {
      method: 'POST',
      body: fetchBody,
      headers,
    })

    if (!response.ok)
      throw new Error('Erreur lors de la récupération des données')

    return response.json()
  },

}
