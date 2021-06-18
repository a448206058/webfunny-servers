const BehaviorInfoModel = require('../modules/behaviorInfo')
const statusCode = require('../util/status-code')

class BehaviorInfoController {
  /**
   * 创建行为信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async create(ctx) {
    const param = ctx.request.body
    const data = JSON.parse(param.data)
    if (data.happenTime) {
      let ret = await BehaviorInfoModel.createBehaviorInfo(data);
      let res = await BehaviorInfoModel.getBehaviorInfoDetail(ret.id);

      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('创建行为信息成功', res)
    } else {

      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('创建行为信息失败，请求参数不能为空！')
    }
  }

  /**
   * 获取行为信息列表
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getBehaviorInfoList(ctx) {
    let req = ctx.request.body

    if (req) {
      const data = await BehaviorInfoModel.getBehaviorInfoList();

      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询行为信息列表成功！', data)
    } else {

      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('查询行为信息列表失败！');
    }

  }

  /**
   * 查询单条行为信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async detail(ctx) {
    let id = ctx.params.id;

    if (id) {
      let data = await BehaviorInfoModel.getBehaviorInfoDetail(id);

      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('查询成功！', data)
    } else {

      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('行为信息ID必须传');
    }
  }


  /**
   * 删除行为信息数据
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async delete(ctx) {
    let id = ctx.params.id;

    if (id && !isNaN(id)) {
      await BehaviorInfoModel.deleteBehaviorInfo(id);

      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('删除行为信息成功！')
    } else {

      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('行为信息ID必须传！');
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
      await BehaviorInfoModel.updateBehaviorInfo(id, req);
      let data = await BehaviorInfoModel.getBehaviorInfoDetail(id);

      ctx.response.status = 200;
      ctx.body = statusCode.SUCCESS_200('更新行为信息成功！', data);
    } else {

      ctx.response.status = 412;
      ctx.body = statusCode.ERROR_412('更新行为信息失败！')
    }
  }
}

module.exports = BehaviorInfoController
