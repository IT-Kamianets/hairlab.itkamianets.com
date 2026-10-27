/** Future backend boundary. No private credentials or remote photo processing in this MVP. */
export const capabilities = Object.freeze({ recommendations: false, transformations: false, sharedVoting: false, cloudSync: false });
export class ServiceUnavailableError extends Error {
  constructor(service) { super(`${service} requires a connected backend. Nothing has been uploaded.`); this.name = 'ServiceUnavailableError'; }
}
export const services = {
  async recommend(_profile) { throw new ServiceUnavailableError('AI recommendations'); },
  async transform(_portrait, _selection, _consent) { throw new ServiceUnavailableError('Virtual try-on'); },
  async createComparison(_lookIds) { throw new ServiceUnavailableError('Shared voting'); },
  async vote(_comparisonId, _lookId) { throw new ServiceUnavailableError('Guest voting'); },
};
