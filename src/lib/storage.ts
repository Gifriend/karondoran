// Client-side data storage using localStorage
interface NewsItem {
  id: string
  title: string
  category: string
  content: string
  image: string
  date: string
  status: "Published" | "Draft"
}

interface GalleryItem {
  id: string
  title: string
  category: string
  image: string
  date: string
}

// News Storage
export const newsStorage = {
  getAll: (): NewsItem[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem("desa_news")
    return data ? JSON.parse(data) : []
  },

  add: (item: Omit<NewsItem, "id" | "date">) => {
    const all = newsStorage.getAll()
    const newItem: NewsItem = {
      ...item,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("id-ID"),
    }
    all.push(newItem)
    localStorage.setItem("desa_news", JSON.stringify(all))
    return newItem
  },

  update: (id: string, updates: Partial<NewsItem>) => {
    const all = newsStorage.getAll()
    const index = all.findIndex((item) => item.id === id)
    if (index !== -1) {
      all[index] = { ...all[index], ...updates }
      localStorage.setItem("desa_news", JSON.stringify(all))
      return all[index]
    }
    return null
  },

  delete: (id: string) => {
    const all = newsStorage.getAll()
    const filtered = all.filter((item) => item.id !== id)
    localStorage.setItem("desa_news", JSON.stringify(filtered))
  },

  getById: (id: string) => {
    const all = newsStorage.getAll()
    return all.find((item) => item.id === id) || null
  },
}

// Gallery Storage
export const galleryStorage = {
  getAll: (): GalleryItem[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem("desa_gallery")
    return data ? JSON.parse(data) : []
  },

  add: (item: Omit<GalleryItem, "id" | "date">) => {
    const all = galleryStorage.getAll()
    const newItem: GalleryItem = {
      ...item,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("id-ID"),
    }
    all.push(newItem)
    localStorage.setItem("desa_gallery", JSON.stringify(all))
    return newItem
  },

  update: (id: string, updates: Partial<GalleryItem>) => {
    const all = galleryStorage.getAll()
    const index = all.findIndex((item) => item.id === id)
    if (index !== -1) {
      all[index] = { ...all[index], ...updates }
      localStorage.setItem("desa_gallery", JSON.stringify(all))
      return all[index]
    }
    return null
  },

  delete: (id: string) => {
    const all = galleryStorage.getAll()
    const filtered = all.filter((item) => item.id !== id)
    localStorage.setItem("desa_gallery", JSON.stringify(filtered))
  },

  getById: (id: string) => {
    const all = galleryStorage.getAll()
    return all.find((item) => item.id === id) || null
  },
}
