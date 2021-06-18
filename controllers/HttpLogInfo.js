const HttpLogInfoModel = require('../modules/HttpLogInfo')
const statusCode = require('../util/status-code')

class HttpLogInfoController {
  /**
   * 创建信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async create(ctx) {
    const param = ctx.request.body
    const data = JSON.parse(param.data)
    /* 判断参数是否合法 */
    if (req.happenTime) {
      let ret = await HttpLogInfoModel.createHttpLogInfo(data);
      let res = await HttpLogInfoModel.getHttpLogInfoDetail(ret.id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('创建信息成功', res)
    } else {
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
    }
  }
  
  /**
   * 获取信息列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getHttpLogInfoList(ctx) {
    let req = ctx.request.body
  
    if (req) {
      const data = await HttpLogInfoModel.getHttpLogInfoList();
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('查询信息列表失败！');
    }
  
  }
  
  /**
   * 查询单条信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async detail(ctx) {
    let id = ctx.params.id;
  
    if (id) {
      let data = await HttpLogInfoModel.getHttpLogInfoDetail(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询成功！', data)
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传');
    }
  }
  
  
  /**
   * 删除信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async delete(ctx) {
    let id = ctx.params.id;
  
    if (id && !isNaN(id)) {
      await HttpLogInfoModel.deleteHttpLogInfo(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('删除信息成功！')
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('信息ID必须传！');
    }
  }
  
  /**
   * 更新导航条数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async update(ctx) {
    let req = ctx.request.body;
    let id = ctx.params.id;
  
    if (req) {
      await HttpLogInfoModel.updateHttpLogInfo(id, req);
      let data = await HttpLogInfoModel.getHttpLogInfoDetail(id);
  
      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('更新信息成功！', data);
    } else {
  
      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('更新信息失败！')
    }
  }
}

module.exports = HttpLogInfoController
