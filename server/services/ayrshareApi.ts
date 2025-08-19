interface AyrshareConfig {
  apiKey: string;
  baseUrl: string;
}

interface PostData {
  post: string;
  platforms: string[];
  mediaUrls?: string[];
  scheduleDate?: string;
}

interface AyrshareResponse {
  status: string;
  id?: string;
  errors?: Array<{
    platform: string;
    message: string;
  }>;
}

interface ProfileResponse {
  status: string;
  profiles?: Array<{
    platform: string;
    platformId: string;
    name: string;
    profileImg?: string;
    followers?: number;
  }>;
}

export class AyrshareApi {
  private config: AyrshareConfig;

  constructor() {
    this.config = {
      apiKey: process.env.AYRSHARE_API_KEY || '',
      baseUrl: 'https://app.ayrshare.com/api'
    };

    if (!this.config.apiKey) {
      throw new Error('AYRSHARE_API_KEY environment variable is required');
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ayrshare API error: ${response.status} ${errorText}`);
    }

    return await response.json();
  }

  async publishPost(postData: PostData): Promise<AyrshareResponse> {
    const payload = {
      post: postData.post,
      platforms: postData.platforms,
      ...(postData.mediaUrls && { mediaUrls: postData.mediaUrls }),
      ...(postData.scheduleDate && { scheduleDate: postData.scheduleDate }),
    };

    return await this.makeRequest('/post', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async schedulePost(postData: PostData & { scheduleDate: string }): Promise<AyrshareResponse> {
    return await this.publishPost(postData);
  }

  async getProfiles(): Promise<ProfileResponse> {
    return await this.makeRequest('/profiles');
  }

  async deletePost(postId: string): Promise<{ status: string }> {
    return await this.makeRequest(`/delete/${postId}`, {
      method: 'DELETE',
    });
  }

  async getAnalytics(platforms?: string[], startDate?: string, endDate?: string): Promise<any> {
    const params = new URLSearchParams();
    
    if (platforms && platforms.length > 0) {
      params.append('platforms', platforms.join(','));
    }
    if (startDate) {
      params.append('startDate', startDate);
    }
    if (endDate) {
      params.append('endDate', endDate);
    }

    const queryString = params.toString();
    const endpoint = `/analytics${queryString ? `?${queryString}` : ''}`;
    
    return await this.makeRequest(endpoint);
  }

  async uploadMedia(mediaUrl: string): Promise<{ status: string; url?: string }> {
    return await this.makeRequest('/upload', {
      method: 'POST',
      body: JSON.stringify({ url: mediaUrl }),
    });
  }
}

export const ayrshareApi = new AyrshareApi();
