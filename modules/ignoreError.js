const db = require('../config/db')
const Sequelize = db.sequelize;
const IgnoreError = Sequelize.import('../schema/ignoreError');
IgnoreError.sync({force: false});

class IgnoreErrorModel {
  /**
   * 创建IgnoreError信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createIgnoreError(data) {
    return await IgnoreError.create({
      ...data
    })
  }

  /**
   * 更新IgnoreError数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateIgnoreError(id, data) {
    await IgnoreError.update({
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
   * 获取IgnoreError列表
   * @returns {Promise<*>}
   */
  static async getIgnoreErrorList() {
    return await IgnoreError.findAndCountAll()
  }

  static async ignoreErrorByApplication(param) {
    return await Sequelize.query("select * from IgnoreErrors WHERE webMonitorId='" + param.webMonitorId + "'", { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取IgnoreError详情数据
   * @param id  IgnoreError的ID
   * @returns {Promise<Model>}
   */
  static async getIgnoreErrorDetail(id) {
    return await IgnoreError.findOne({
      where: {
        id,
      },
    })
  }
  /**
   * 根据errorMsg 判断该错误是否已经被忽略
   * @returns {Promise<*>}
   */
  static async getIgnoreErrorByMsg(param) {
    return await Sequelize.query("select count(*) as count from IgnoreErrors WHERE webMonitorId='" + param.webMonitorId + "' and ignoreErrorMessage='" + param.errorMessage + "'", { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 删除IgnoreError
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteIgnoreError(id) {
    await IgnoreError.destroy({
      where: {
        id,
      }
    })
    return true
  }

}

module.exports = IgnoreErrorModel
