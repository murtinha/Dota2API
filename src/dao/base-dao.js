export default class BaseDAO {
  static _model = {}

  static find(args) {
    return this._model.find(args).exec();
  }

  static findOne(args) {
    return this._model.findOne(args).exec();
  }
};
