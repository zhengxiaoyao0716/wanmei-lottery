# lottery
## 射雕英雄传手游庆功宴抽奖

***
## 配置
### 参考 `配置` 目录下， [射雕英雄传的配置](./配置/射雕英雄传庆功宴.js)

***
## 需求
### 抽中的人没来的处理
点击名称替换


### 按键绑定
空格 -> start&stop
左右箭头 -> 上下轮
回车 -> 保存


### 预期效果
噗 类似这样 的意思

![预期效果](./.request/预期效果.png)

可以放游戏主宣图

### 时间估算
这周吧？下周一测试可以用就行


### 其它要求
然后希望是可以编辑的

后面可以拿这个套用别的 

比如换个素材 换个人员池子的


***
## 高级配置
### 美术资源（./static/image）

|路径|描述|
|--|--|
|bgi.jpg|背景图|
|pendant/cg.png|主宣图|
|pendant/logo.png|logo|
|pendant/恭喜中奖.png| `恭喜中奖` 字样|
> 以上只是几个例子，具体怎么摆放摆哪些挂件(pendant) 可以自定义和扩展

### 数据与流程配置

[抽奖回合](./../static/script/config.es6#73)

[数据集](./../static/script/config.es6#80)


### 界面样式配置
[挂件](./../static/script/config.es6#13)

[控制器](./../static/script/config.es6#43)

[抽奖台](./../static/script/config.es6#51)

[滚筒区域](./../static/script/config.es6#62)
