58app 转转详情、订单以及IM部分路由说明
================


路由是哈希路由，例如首页在本地运行时的地址应为`http://localhost:8080/#!/`

名称          | 路由                               | 参数                 | 备注
-------------|------------------------------------|---------------------|----------------
详情页        |`/detail/:product_id`               | `product_id`:产品ID    |
订单         |`/delivery/:product_id`             | `product_id`:产品ID     |
订单城市选择  |`/delivery/:product_id/city`       | `product_id`:产品ID     |
订单区域选择  |`/delivery/:product_id/city/area`  | `product_id`:产品ID     |
支付完成      |`/success/:order_id`                | `order_id`:订单ID      |
订单详情      |`/order/:order_id`                  | `order_id`:订单ID      |
我的转转      |`/mine`                             |       |
私信（列表）   |`/message/chat`                     |                     |
私信（对话框） |`/message/chat/:user_id/:product_id`            | `user_id`
订单消息      |`/message/order`                    |                      |
系统消息      |`/message/system`                   |                      |
帮助中心入口  |`/help`                             |                      |
帮助中心类型  |`/help/:type`                       |         9种类型      |


