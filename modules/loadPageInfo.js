const db = require('../config/db')
const Sequelize = db.sequelize;
const LoadPageInfo = Sequelize.import('../schema/loadPageInfo');
LoadPageInfo.sync({force: false});

class LoadPageInfoModel {
  /**
   * 创建LoadPageInfo信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createLoadPageInfo(data) {
    return await LoadPageInfo.create({
      ...data
    })
  }

  /**
   * 更新LoadPageInfo数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateLoadPageInfo(id, data) {
    await LoadPageInfo.update({
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
   * 获取LoadPageInfo列表
   * @returns {Promise<*>}
   */
  static async getLoadPageInfoList() {
    return await LoadPageInfo.findAndCountAll()
  }

  /**
   * 获取LoadPageInfo详情数据
   * @param id  LoadPageInfo的ID
   * @returns {Promise<Model>}
   */
  static async getLoadPageInfoDetail(id) {
    return await LoadPageInfo.findOne({
      where: {
        id,
      },
    })
  }

  /**
   * 删除LoadPageInfo
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteLoadPageInfo(id) {
    await LoadPageInfo.destroy({
      where: {
        id,
      }
    })
    return true
  }

}

module.exports = LoadPageInfoModel
