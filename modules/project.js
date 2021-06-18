const db = require('../config/db')
const Sequelize = db.sequelize;
const Project = Sequelize.import('../schema/project');
Project.sync({force: false});

class ProjectModel {
  /**
   * 创建Project信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createProject(data) {
    return await Project.create({
      ...data
    })
  }

  /**
   * 更新Project数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateProject(id, data) {
    await Project.update({
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
   * 获取Project列表
   * @returns {Promise<*>}
   */
  static async getProjectList() {
    return await Project.findAndCountAll()
  }

  /**
   * 获取Project详情数据
   * @param id  Project的ID
   * @returns {Promise<Model>}
   */
  static async getProjectDetail(id) {
    return await Project.findOne({
      where: {
        id,
      },
    })
  }

  /**
   * 删除Project
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteProject(id) {
    await Project.destroy({
      where: {
        id,
      }
    })
    return true
  }

}

module.exports = ProjectModel
