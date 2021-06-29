const db = require('../config/db')
const Sequelize = db.sequelize;
const CustomerPV = Sequelize.import('../schema/customerPV');
const Utils = require('../util/utils');
CustomerPV.sync({ force: false });

class CustomerPVModel {
  /**
   * 创建CustomerPV信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createCustomerPV (data) {
    return await CustomerPV.create({
      ...data
    })
  }

  /**
   * 更新CustomerPV数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateCustomerPV (id, data) {
    await CustomerPV.update({
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
   * 获取CustomerPV列表
   * @returns {Promise<*>}
   */
  static async getCustomerPVList () {
    return await CustomerPV.findAndCountAll()
  }

  /**
   * 获取CustomerPV详情数据
   * @param id  CustomerPV的ID
   * @returns {Promise<Model>}
   */
  static async getCustomerPVDetail (id) {
    return await CustomerPV.findOne({
      where: {
        id,
      },
    })
  }

  /**
   * 获取CustomerPV数量
   * @param id  CustomerPV的ID
   * @returns {Promise<Model>}
   */
  static async getCustomerPVCount (id) {
    // 用户总数
    let allUser = await Sequelize.query("SELECT COUNT(DISTINCT customerKey) as count FROM CustomerPVs WHERE webMonitorId=" + id);

    return allUser;
  }

  /**
  * 获取CustomerPV 新用户
  * @param id  CustomerPV的ID
  * @returns {Promise<Model>}
  */
  static async getCustomerPVNewCount (id) {
    // 新用户
    let newUser = await Sequelize.query("SELECT COUNT(DISTINCT customerKey) as count FROM CustomerPVs WHERE webMonitorId=" + id + ' and  happenTime >= ' + new Date().setHours(0,0,0,0)) + 'and ';

    return newUser;
  }

  /**
* 获取CustomerPV 老用户
* @param id  CustomerPV的ID
* @returns {Promise<Model>}
*/
  static async getCustomerPVOldCount (id) {
    // 老用户
    let oldUser = await Sequelize.query("SELECT COUNT(DISTINCT customerKey) as count FROM CustomerPVs WHERE webMonitorId=" + id + ' and happenTime < ' + new Date().setHours(0,0,0,0));

    return oldUser;
  }

  /**
  * 获取CustomerPV 活跃用户
  * @param id  CustomerPV的ID
  * @returns {Promise<Model>}
  */
  static async getCustomerPVActiveCount (id) {
    // 活跃用户
    let activeUser = await Sequelize.query("SELECT COUNT(DISTINCT customerKey) as count FROM CustomerPVs WHERE webMonitorId=" + id + ' and  happenTime >= ' + new Date().setHours(0,0,0,0));

    return activeUser;
  }

  /**
   * 删除CustomerPV
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteCustomerPV (id) {
    await CustomerPV.destroy({
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
  static async deleteCustomerPVsFifteenDaysAgo (days) {
    const timeScope = Utils.addDays(0 - days) + " 00:00:00"
    var querySql = "delete from CustomerPVs where createdAt<'" + timeScope + "'";
    return await Sequelize.query(querySql, { type: Sequelize.QueryTypes.DELETE })
  }
  /**
   * 获取PC错误总数
   * @returns {Promise<*>}
   */
  static async getCustomerPvPcCount (param) {
    return await Sequelize.query("SELECT COUNT(DISTINCT pageKey) as count FROM CustomerPVs WHERE webMonitorId='" + param.webMonitorId + "' and  createdAt > '" + param.day + "' and os LIKE 'web%'", { type: Sequelize.QueryTypes.SELECT })
  }

  /**
   * 获取IOS错误总数
   * @returns {Promise<*>}
   */
  static async getCustomerPvIosCount (param) {
    return await Sequelize.query("SELECT COUNT(DISTINCT pageKey) as count FROM CustomerPVs WHERE webMonitorId='" + param.webMonitorId + "' and  createdAt > '" + param.day + "' and os LIKE 'ios%'", { type: Sequelize.QueryTypes.SELECT })
  }

  /**
   * 获取Android错误总数
   * @returns {Promise<*>}
   */
  static async getCustomerPvAndroidCount (param) {
    return await Sequelize.query("SELECT COUNT(DISTINCT pageKey) as count FROM CustomerPVs WHERE webMonitorId='" + param.webMonitorId + "' and  createdAt > '" + param.day + "' and os LIKE 'android%'", { type: Sequelize.QueryTypes.SELECT })
  }

  /**
   * 获取当前用户所有的行为记录
   * @returns {Promise<*>}
   */
  static async getBehaviorsByUser (param, customerKeySql) {
    // var phoneReg = /^1\d{10}$/
    // var sql = ""
    // if (phoneReg.test(param.searchValue)) {
    //   sql = "select * from CustomerPVs where webMonitorId='" + param.webMonitorId + "' and firstUserParam='" + param.searchValue + "'"
    // } else {
    //   sql = "select * from CustomerPVs where webMonitorId='" + param.webMonitorId + "' and userId='" + param.searchValue + "'"
    // }
    // return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})

    let sql = "select * from CustomerPVs where " + customerKeySql + " and webMonitorId='" + param.webMonitorId + "' "
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT })
  }
  /**
   * 根据userId获取到所有的customerKey
   * @returns {Promise<*>}
   */
  static async getCustomerKeyByUserId (param) {
    const createdAtTime = Utils.addDays(0 - param.timeScope) + " 00:00:00"
    const sql =
      "select DISTINCT(customerKey) from CustomerPVs where createdAt>'" + createdAtTime + "' and webMonitorId='" + param.webMonitorId + "' and userId='" + param.searchValue + "'"
      + " UNION " +
      "select DISTINCT(customerKey) from behaviorInfos where createdAt>'" + createdAtTime + "' and webMonitorId='" + param.webMonitorId + "' and userId='" + param.searchValue + "'"
      + " UNION " +
      "select DISTINCT(customerKey) from HttpLogInfos where createdAt>'" + createdAtTime + "' and webMonitorId='" + param.webMonitorId + "' and userId='" + param.searchValue + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT })
  }

}

module.exports = CustomerPVModel
