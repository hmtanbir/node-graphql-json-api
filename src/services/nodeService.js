class NodeService {
    constructor(repo) {
      this.repo = repo;
    }

  async getNodeById(id) {
      if(!id) return null;
      return this.repo.getNodeById(id);
  }

  async getNodeByIds(ids) {
      if(!Array.isArray(ids) || ids.length === 0) return [];
      return this.repo.getNodeByIds(ids);
  }

  async getTriggerById(id) {
      if(!id) return null;
      return this.repo.getTriggerById(id);
  }

  async getResponsesByIds(ids) {
      if(!Array.isArray(ids) || ids.length === 0) return [];
      return this.repo.getResponsesByIds(ids);
  }

  async getActionsByIds(ids) {
      if(!Array.isArray(ids) || ids.length === 0) return [];
      return this.repo.getActionsByIds(ids)
  }
}

module.exports = NodeService;
