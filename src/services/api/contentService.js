import mockData from '@/services/mockData/content.json';

class ContentService {
  constructor() {
    this.data = [...mockData];
  }

  async getAll() {
    await this.delay();
    return [...this.data];
  }

  async getById(id) {
    await this.delay();
    return this.data.find(item => item.Id === parseInt(id));
  }

  async create(item) {
    await this.delay();
    const newItem = {
      ...item,
      Id: Math.max(...this.data.map(d => d.Id), 0) + 1
    };
    this.data.push(newItem);
    return { ...newItem };
  }

  async update(id, data) {
    await this.delay();
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...data };
      return { ...this.data[index] };
    }
    throw new Error('Content not found');
  }

  async delete(id) {
    await this.delay();
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index !== -1) {
      const deleted = this.data.splice(index, 1);
      return deleted[0];
    }
    throw new Error('Content not found');
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }
}

export const contentService = new ContentService();