export interface Gallery {
  id: string;
  title: string;
  category: string;
  image_url: string;
  image_size: number;
  created_at: string;
}

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  content: string;
  image_url?: string; // Opsional
  status: "Published" | "Draft";
  created_at: string;
}

export interface GovernmentStaff {
  id: string;
  name: string;
  position: string;
  level: number;
  photo_url?: string; // Opsional
  description?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface PageItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  created_at: string;
}

export interface SettingItem {
    siteName:string
  id: string;
  key: string;
  value: string;
}