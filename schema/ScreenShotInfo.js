const baseInfo = require('./baseInfo');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('ScreenShotInfo', {
    ...baseInfo(DataTypes),
    // ID 主键
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    // 描述信息
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description'
    },
    // 截屏信息
    screenInfo: {
      type: "mediumblob",
      allowNull: true,
      field: 'screenInfo'
    }
  }, {
    // 如果为 true 则表的名称和 model 相同，即 user
    // 为 false MySQL创建的表名称会是复数 users
    // 如果指定的表名称本就是复数形式则不变
    freezeTableName: false,
    indexes: [
      {
        name: "searchIndex",
        method: "BTREE",
        fields: [
          {
            attribute: "userId",
          },
          {
            attribute: "customerKey",
          },
          {
            attribute: "createdAt",
          }
        ]
      }
    ]
  })

}