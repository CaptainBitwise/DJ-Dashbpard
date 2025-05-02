export interface NewsItem {
    _id: string;
    title: string;
    description: string;
    link: string;
    imageUrl: string;
    imagePublicId: string;
    createdAt: string;
  }
  
  export interface NewsResponse {
    news: NewsItem[];
    total: number;
    page: number;
    pages: number;
  }
  