const { GraphQLJSON, GraphQLLong } = require("graphql-scalars");
const NodeService = require('./services/nodeService');

const nodeServiceFactory = (repo) => new NodeService(repo);

module.exports = {
  JSON: GraphQLJSON,
  Long: GraphQLLong,

  Query: {
    node: async (_, { nodeId }, context) => {
      const service = nodeServiceFactory(context.repo);
      return service.getNodeById(nodeId);
    }
  },

  NodeObject: {
    parentIds: (parent) => parent.parentIds || [],
    parents: (parent) => parent.parents || [],
    triggerId: (parent) => parent.trigger || null,
    trigger: async (parent, _, context) => {
      if (!parent.trigger) return null;
      const service = nodeServiceFactory(context.repo);
      return service.getTriggerById(parent.trigger);
    },
    responseIds: (parent) => parent.responses || [],
    responses: async (parent, _, context) => {
      if (!parent.responses || parent.responses.length === 0) return [];
      const service = nodeServiceFactory(context.repo);
      return service.getResponsesByIds(parent.responses);
    },
    actionIds: (parent) => parent.actionIds || [],
    actions: async (parent, _, context) => {
      if (!parent.actionIds || parent.actionIds.length === 0) return [];
      const service = nodeServiceFactory(context.repo);
      return service.getActionsByIds(parent.actionIds);
    }
  },

  Action: {
    resourceTemplate: async (parent, _, context) => {
      if (!parent.resourceTemplateId) return null;
      return context.repo.getResourceTemplateById(parent.resourceTemplateId);
    }
  },

  Trigger: {
    resourceTemplate: async (parent, _, context) => {
      if (!parent.resourceTemplateId) return null;
      return context.repo.getResourceTemplateById(parent.resourceTemplateId);
    }
  }
};
