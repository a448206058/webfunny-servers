const fetch = require('node-fetch')
const db = require('../config/db')
const utils = require("../util/utils")
const Sequelize = db.sequelize;
const JavascriptErrorInfo = Sequelize.import('../schema/javascriptErrorInfo');
JavascriptErrorInfo.sync({force: false});

class JavascriptErrorInfoModel {
  /**
   * 创建JavascriptErrorInfo信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createJavascriptErrorInfo(data) {
    return await JavascriptErrorInfo.create({
      ...data
    })
  }

  /**
   * 更新JavascriptErrorInfo数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateJavascriptErrorInfo(id, data) {
    await JavascriptErrorInfo.update({
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
   * 删除
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteJavascriptErrorInfosFifteenDaysAgo(days) {
    const timeScope = utils.addDays(0 - days) + " 00:00:00"
    var querySql = "delete from JavascriptErrorInfos where createdAt<'" + timeScope + "'";
    return await Sequelize.query(querySql, { type: Sequelize.QueryTypes.DELETE})
  }

  /**
   * 获取JavascriptErrorInfo列表
   * @returns {Promise<*>}
   */
  static async getJavascriptErrorInfoList() {
    return await JavascriptErrorInfo.findAndCountAll()
  }

  /**
   * 获取JavascriptErrorInfo列表
   * @returns {Promise<*>}
   */
  static async getJavascriptErrorInfoListByDay(param) {
    return await Sequelize.query("select DATE_FORMAT(createdAt,'%Y-%m-%d') as day, count(id) as count from JavascriptErrorInfos WHERE webMonitorId='" + param.webMonitorId + "' and DATE_SUB(CURDATE(),INTERVAL 14 DAY) <= createdAt GROUP BY day", { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取某小时内，错误总数
   * @returns {Promise<*>}
   */
  static async getJavascriptErrorInfoListByHour(startTime, endTime, param) {
    return await Sequelize.query("SELECT COUNT(*) as count from JavascriptErrorInfos where  webMonitorId='" + param.webMonitorId + "' and  createdAt > '" + startTime + "' and createdAt < '" + endTime + "'", { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取某天内错误总数
   * @returns {Promise<*>}
   */
  static async getJavascriptErrorCountByDay(startTime, endTime, param) {
    return await Sequelize.query("SELECT COUNT(*) as count from JavascriptErrorInfos where webMonitorId='" + param.webMonitorId + "' and createdAt > '" + startTime + "' and createdAt < '" + endTime + "'", { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取JavascriptErrorInfo列表
   * @returns {Promise<*>}
   */
  static async getJavascriptErrorSort(param) {
    const { simpleUrl, timeType } = param
    const queryStr1 = simpleUrl ? " and simpleUrl='" + simpleUrl + "' " : " "
    let queryStr2 = ""
    if (timeType === "month") {
      const start = utils.addDays(-7)
      queryStr2 = " and createdAt > '" + start + "'"
    } else {
      const start = utils.addDays(0)
      queryStr2 = " and createdAt > '" + start + "'"
    }
    const queryStr = queryStr1 + queryStr2
    return await Sequelize.query("select errorMessage, count(errorMessage) as count from JavascriptErrorInfos where webMonitorId='" + param.webMonitorId + "' " + queryStr + " GROUP BY errorMessage order by count desc limit 0,15", { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 根据errorMessage查询这一类错误不同平台的数量
   * @returns {Promise<*>}
   */
  static async getPerJavascriptErrorCountByOs(tempErrorMsg, param) {
    const { simpleUrl, timeType } = param
    const queryStr1 = simpleUrl ? " and simpleUrl='" + simpleUrl + "' " : " "
    let queryStr2 = ""
    if (timeType === "month") {
      const start = utils.addDays(-30)
      queryStr2 = " and createdAt > '" + start + "'"
    } else {
      const start = utils.addDays(0)
      queryStr2 = " and createdAt > '" + start + "'"
    }
    const queryStr = queryStr1 + queryStr2
    const errorMsg = tempErrorMsg.replace(/'/g, "\\'")
    return await Sequelize.query("SELECT tab.os as os, count(tab.os) as count from (select SUBSTRING(os,1,3) as os from JavascriptErrorInfos where webMonitorId='" + param.webMonitorId + "' " + queryStr + " and  errorMessage like '%" + errorMsg + "%') as tab GROUP BY os order by count desc", { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 根据errorMessage查询这一类错误最近发生的时间
   * @returns {Promise<*>}
   */
  static async getJavascriptErrorLatestTime(tempErrorMsg, param) {
    const errorMsg = tempErrorMsg.replace(/'/g, "\\'")
    return await Sequelize.query("select createdAt, happenTime from JavascriptErrorInfos where webMonitorId='" + param.webMonitorId + "' and  errorMessage like '%" + errorMsg + "%' ORDER BY createdAt desc limit 1", { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 获取JavascriptErrorInfo列表
   * @returns {Promise<*>}
   */
  static async getJavascriptErrorCountByHour(param) {
    let hour = new Date().getHours()
    new Date().Format("yyyy-MM-dd") + " " + hour + ":00:00"
    return await Sequelize.query("select DATE_FORMAT(createdAt,'%Y-%m-%d') as day, count(id) as count from JavascriptErrorInfos WHERE webMonitorId='" + param.webMonitorId + "' and  DATE_SUB(CURDATE(),INTERVAL 30 DAY) <= createdAt GROUP BY day", { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 根据errorMsg 查询js错误列表
   * @returns {Promise<*>}
   */
  static async getJavascriptErrorListByMsg(tempErrorMsg, param) {
    const errorMsg = tempErrorMsg.replace(/'/g, "\\'")
    return await Sequelize.query("select * from JavascriptErrorInfos where webMonitorId='" + param.webMonitorId + "' and  errorMessage like '%" + errorMsg + "%' order by happenTime desc limit 200", { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 根据errorMsg查询Js错误影响的用户数量
   * @returns {Promise.<void>}
   */
  static async getJavascriptErrorAffectCount(tempErrorMsg, param) {
    const errorMsg = tempErrorMsg.replace(/'/g, "\\'")
    return await Sequelize.query("select count(DISTINCT customerKey) as count from JavascriptErrorInfos where  webMonitorId='" + param.webMonitorId + "' and errorMessage like '%" + errorMsg + "%'", { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 根据errorMsg、customerKey 查询Js错误发生的次数
   * @returns {Promise.<void>}
   */
  static async getJavascriptErrorOccurCountByCustomerKey(tempErrorMsg, webMonitorId, customerKey) {
    const errorMsg = tempErrorMsg.replace(/'/g, "\\'")
    return await Sequelize.query("select count(*) as count from JavascriptErrorInfos where webMonitorId='" + webMonitorId + "' and  errorMessage like '%" + errorMsg + "%' and customerKey='" + customerKey + "'", { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 根据errorMsg 查询js错误列表
   * @returns {Promise<*>}
   */
  static async getJavascriptErrorListByPage(param) {
    const { timeType } = param
    let queryStr = ""
    if (timeType === "month") {
      const start = utils.addDays(-30)
      queryStr = " where webMonitorId='" + param.webMonitorId + "' and  createdAt > '" + start + "'"
    } else {
      const start = utils.addDays(0)
      queryStr = " where webMonitorId='" + param.webMonitorId + "' and  createdAt > '" + start + "'"
    }
    return await Sequelize.query("select simpleUrl, COUNT(simpleUrl) as count from JavascriptErrorInfos " + queryStr + " GROUP BY simpleUrl ORDER BY count desc", { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取报错代码位置附近的代码
   * @returns {Promise<*>}
   */
  static async getJavascriptErrorStackCode(param) {
    const result = []
    for (var i = 0; i < param.length; i ++) {
      const { jsPathStr, jsPath, locationX, locationY } = param[i]
      await fetch(jsPath)
        .then(res => res.text())
        .then(body => {
          const start = parseInt(locationY) - 50
          const end = parseInt(locationY) + 50
          const codeStart = encodeURIComponent(body.substring(start, locationY - 1))
          const codeEnd = encodeURIComponent(body.substring(locationY - 1, end))
          result.push({jsPathStr, jsPath, locationX, locationY, code: codeStart + "【错误位置：】" + codeEnd})
        });
    }
    return result
  }

  /**
   * 获取JavascriptErrorInfo详情数据
   * @param id  JavascriptErrorInfo的ID
   * @returns {Promise<Model>}
   */
  static async getJavascriptErrorInfoDetail(id) {
    return await JavascriptErrorInfo.findOne({
      where: {
        id,
      },
    })
  }

  /**
   * 删除JavascriptErrorInfo
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteJavascriptErrorInfo(id) {
    await JavascriptErrorInfo.destroy({
      where: {
        id,
      }
    })
    return true
  }

  /**
   * 获取PC错误总数
   * @returns {Promise<*>}
   */
  static async getJavascriptErrorPcCount(param) {
    return await Sequelize.query("SELECT COUNT(DISTINCT pageKey) as count FROM JavascriptErrorInfos WHERE webMonitorId='" + param.webMonitorId + "' and createdAt > '" + param.day + "' and os LIKE 'web%'", { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取IOS错误总数
   * @returns {Promise<*>}
   */
  static async getJavascriptErrorIosCount(param) {
    return await Sequelize.query("SELECT COUNT(DISTINCT pageKey) as count FROM JavascriptErrorInfos WHERE webMonitorId='" + param.webMonitorId + "' and  createdAt > '" + param.day + "' and os LIKE 'ios%'", { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取Android错误总数
   * @returns {Promise<*>}
   */
  static async getJavascriptErrorAndroidCount(param) {
    return await Sequelize.query("SELECT COUNT(DISTINCT pageKey) as count FROM JavascriptErrorInfos WHERE webMonitorId='" + param.webMonitorId + "' and  createdAt > '" + param.day + "' and os LIKE 'android%'", { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取当前用户所有的行为记录
   * @returns {Promise<*>}
   */
  static async getBehaviorsByUser(param, customerKeySql) {
    // var phoneReg = /^1\d{10}$/
    // var sql = ""
    // if (phoneReg.test(param.searchValue)) {
    //   sql = "select * from JavascriptErrorInfos where webMonitorId='" + param.webMonitorId + "' and firstUserParam='" + param.searchValue + "'"
    // } else {
    //   sql = "select * from JavascriptErrorInfos where webMonitorId='" + param.webMonitorId + "' and userId='" + param.searchValue + "'"
    // }
    // return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})

    let sql = "select * from JavascriptErrorInfos where " + customerKeySql + " and webMonitorId='" + param.webMonitorId + "' "
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
}

module.exports = JavascriptErrorInfoModel
