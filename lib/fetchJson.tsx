export default async function fetcher([url, ...args]) {
    try {
      const response = await fetch(url, ...args);
  
      // if the server replies, there's always some data in json
      // if there's a network error, it will throw at the previous line
      const data = await response.json()
  
      if (response.ok) {
        return data
      }
  
      const error = {response: response, data: data}
      throw error
    } catch (error: any) {
      if (!error?.data) {
        error.data = { message: error.message }
      }
      throw error
    }
  }
  