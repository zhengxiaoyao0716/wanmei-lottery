# lottery
## 射雕英雄传手游庆功宴抽奖

***
## 配置
### 参考 `配置` 目录下， [射雕英雄传的配置](./配置/射雕英雄传庆功宴.js)

***
## 需求
### 抽取人数少但名称较长
由于宽度超过而纵向排列，会出现滚动条，应该去掉

### 抽取人数过多时
这个滚动条可以设置成自动滚屏吗
人工去下拉有点low


### 特殊抽奖回合
@陈正 我们在对需求的时候发现一个问题，原定五等奖是抽奖箱抽，现在池总来发这个阳光普照奖，这个奖是人均一份，按照现在的抽奖逻辑抽取之后的就不会在下个阶段的奖项里面出现了，但是后面的非阳光普照奖还是需要他们可以继续参与，有没有办法来平衡这种现象
> 我整理一下啊，第一段是说，需求某个特定的回合，其中抽奖来源名单为全体而不是去掉幸运儿后的。并且抽奖结果也不作为幸运儿从名单中去除，也就是以后还参与其它轮抽奖，对吗？

阳光普照奖是京东卡，面值也不一样 50元的100张  100元50张  200元10张 500元10张 200元是20张

> ok，那么最后整理一下，新需求是：
打包两套抽奖系统，一个是 `庆功宴抽奖`，176人，一个是 `阳光普照` ，176-20人，
阳光普照共4轮，分别是 50元 100人， 100元 50 人， 200 元 20人 500 元 10人
这样？

> 奖品=人数=156   50元100张 100元 30张  200元 20张  500元6张


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
