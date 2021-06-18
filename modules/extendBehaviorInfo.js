const db = require('../config/db')
const Sequelize = db.sequelize;
const ExtendBehaviorInfo = Sequelize.import('../schema/extendBehaviorInfo');
ExtendBehaviorInfo.sync({force: false});

class ExtendBehaviorInfoModel {
  /**
   * 创建ExtendBehaviorInfo信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createExtendBehaviorInfo(data) {
    return await ExtendBehaviorInfo.create({
      ...data
    })
  }

  /**
   * 更新ExtendBehaviorInfo数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateExtendBehaviorInfo(id, data) {
    await ExtendBehaviorInfo.update({
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
   * 获取ExtendBehaviorInfo列表
   * @returns {Promise<*>}
   */
  static async getExtendBehaviorInfoList() {
    return await ExtendBehaviorInfo.findAndCountAll()
  }

  /**
   * 获取ExtendBehaviorInfo详情数据
   * @param id  ExtendBehaviorInfo的ID
   * @returns {Promise<Model>}
   */
  static async getExtendBehaviorInfoDetail(id) {
    return await ExtendBehaviorInfo.findOne({
      where: {
        id,
      },
    })
  }

  /**
   * 删除ExtendBehaviorInfo
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteExtendBehaviorInfo(id) {
    await ExtendBehaviorInfo.destroy({
      where: {
        id,
      }
    })
    return true
  }

}

module.exports = ExtendBehaviorInfoModel
