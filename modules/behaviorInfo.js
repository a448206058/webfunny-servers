const db = require('../config/db')
const Sequelize = db.sequelize;
const BehaviorInfo = Sequelize.import('../schema/behaviorInfo');
const Utils = require('../util/utils');
BehaviorInfo.sync({force: false});

class BehaviorInfoModel {
  /**
   * 创建行为信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createBehaviorInfo(data) {
    return await BehaviorInfo.create({
      ...data
    })
  }

  /**
   * 更新文章数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateBehaviorInfo(id, data) {
    await BehaviorInfo.update({
      ...data
    }, {
      where: {
        id
      },
      fields: Object.keys(data)
    })
    return true
  }

  /**
   * 获取文章列表
   * @returns {Promise<*>}
   */
  static async getBehaviorInfoList() {
    return await BehaviorInfo.findAndCountAll()
  }

  /**
   * 获取文章详情数据
   * @param id  文章ID
   * @returns {Promise<Model>}
   */
  static async getBehaviorInfoDetail(id) {
    return await BehaviorInfo.findOne({
      where: {
        id,
      },
    })
  }

  /**
   * 删除
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteBehaviorInfo(id) {
    await BehaviorInfo.destroy({
      where: {
        id,
      }
    })
    return true
  }
  /**
   * 删除
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteBehaviorInfoFifteenDaysAgo(days) {
    const timeScope = Utils.addDays(0 - days) + " 00:00:00"
    var querySql = "delete from behaviorInfos where createdAt<'" + timeScope + "'"
    return await Sequelize.query(querySql, { type: Sequelize.QueryTypes.DELETE})
  }

  /**
   * 获取当前用户所有的行为记录
   * @returns {Promise<*>}
   */
  static async getBehaviorsByUser(param, customerKeySql) {
    let sql = "select * from behaviorInfos where " + customerKeySql + " and webMonitorId='" + param.webMonitorId + "' "
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

}

module.exports = BehaviorInfoModel
