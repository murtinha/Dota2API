import BaseDAO from './base-dao';
import Model from '../models/model';


export default class HeroDAO extends BaseDAO {
  static _model = Model;
  static _message = 'There is no such hero';
  static _handleError = (err) => console.log(err);

  static findHero(args) {
    return this.findOne(args)
      .then(r => r || this._message)
      .catch(this._handleError)
  }

  static findMyCounters(args, kind) {
    return this.findOne(args)
      .then(r => r ? r[kind] : this._message)
      .catch(this._handleError)
  }

  static findCounters(args, exclude = {}, kind) {
    return Promise.all(args.map(h=> this.findOne({ 'name': h }, exclude)))
      .catch(this._handleError)
      .then(r => {
        const allCounters = r.map(counter => counter[kind]);
        if (allCounters.length > 1) {
          const [hdCounter] = allCounters.splice(0,1);
          const myCounters = hdCounter.filter(hero => {
            return allCounters.every(counter => {
              return !!~counter.indexOf(hero)
            })
          });
          return myCounters
        } else {
          return allCounters[0]
        }
      })
  }
}
