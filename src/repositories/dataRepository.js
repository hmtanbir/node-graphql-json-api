const fs = require('fs');
const path = require('path');

class DataRepository {
  constructor(dataDir) {
    this.dataDir = path.resolve(dataDir || path.join(__dirname, '../../data'));
    this._loadAll();
    this._buildCompositeMap();
  }

  _loadAll() {
    const load = (filename) => {
      try {
        return JSON.parse(fs.readFileSync(path.join(this.dataDir, filename), 'utf8'));
      } catch (err) {
        console.warn(`Could not load ${filename}: ${err.message}`);
        return [];
      }
    };

    this.actions = load('action.json');
    this.nodeObjects = load('node.json');
    this.resourceTemplates = load('resourceTemplate.json');
    this.responses = load('response.json');
    this.triggers = load('trigger.json');
  }

  _buildCompositeMap() {
    this.compositeMap = {};
    this.nodeObjects.forEach(node => {
      if (node.compositeId) this.compositeMap[node.compositeId] = node;
    });
  }

  _resolveNode(node) {
    // Combine action IDs
    const actionIds = [
      ...(node.preActions || []),
      ...(node.actions || []),
      ...(node.postActions || [])
    ];

    // Resolve parents via compositeId
    const parents = (node.parents || [])
      .map(cid => this.compositeMap[cid])
      .filter(Boolean)
      .map(p => ({
        ...p,
        actionIds: [
          ...(p.preActions || []),
          ...(p.actions || []),
          ...(p.postActions || [])
        ]
      }));

    return {
      ...node,
      actionIds,
      parentIds: (node.parents || []).map(cid => this.compositeMap[cid]?._id).filter(Boolean),
      parents
    };
  }

  getNodeById(id) {
    const node = this.nodeObjects.find(n => String(n._id) === String(id));
    return node ? this._resolveNode(node) : null;
  }

  getNodeByIds(ids) {
    const idSet = new Set(ids.map(String));
    return this.nodeObjects
      .filter(n => idSet.has(String(n._id)))
      .map(n => this._resolveNode(n));
  }

  getActionById(id) {
    return this.actions.find(a => String(a._id) === String(id)) || null;
  }

  getActionsByIds(ids) {
    const idSet = new Set(ids.map(String));
    return this.actions.filter(a => idSet.has(String(a._id)));
  }

  getTriggerById(id) {
    return this.triggers.find(t => String(t._id) === String(id)) || null;
  }

  getResponseById(id) {
    return this.responses.find(r => String(r._id) === String(id)) || null;
  }

  getResponsesByIds(ids) {
    const idSet = new Set(ids.map(String));
    return this.responses.filter(r => idSet.has(String(r._id)));
  }

  getResourceTemplateById(id) {
    return this.resourceTemplates.find(rt => String(rt._id) === String(id)) || null;
  }
}

module.exports = DataRepository;
