# DataJsonFormat

-   ## **_斜粗体不可省略_**
-   ## **_没有冒号是匿名 object_**

---

-   ROOT
    -   mapOrigin: 地图初始状态 `{`
        -   mapStyle: `url` (amap://styles/c9713c71e62e9da6e941d73fc568b766) 主题 url
        -   center: `number[2]` (121.459898, 31.308498) 中心经纬度
        -   resizeEnable: `boolean` (true)
        -   rotateEnable: `boolean` (true)
        -   zoomEnable: `boolean` (true)
        -   doubleClickZoom: `boolean` (false)
        -   expandZoomRange: `boolean` (false)
        -   showIndoorMap: `boolean` (false)
        -   zooms: `number[2]` (5, 17)缩放范围
        -   zoom: `number` (16)初始缩放级数
        -   pitch: `number` (60)视角仰角
        -   maxPitch: `number` (180)最大仰角
        -   rotation: `number` (100)视角旋转（顺时针）
    -   `}`
    -   camera: `[`
        -   相机动画关键帧 `{`
            -   aim: `number[2]` (121.459898, 31.308498) 相机目标经纬度
            -   pitch: `number` (60) 仰角
            -   rotate: `number` (100) 顺时针转角
            -   zoom: `number` (16) 缩放
            -   wait: `number` (0) 动画等待时间（毫秒）
            -   **_duration_**: `number` (0) 动画持续时间（毫秒）
        -   `},` ...
    -   `]`
    -   objData: 实体配置数组 `[`
        -   实体数据 dot `{`
            -   **_type_**: `type` (dot) ="dot" 圆点类型
            -   **_height_**: `number` (10) 圆点高度
            -   **_radius_**: `number` (50) 原点半径
            -   **_color|colorFun_**: `number[4]|function(x,y,z)=>number[4]` () RGBA|传入点位置，传出颜色的函数
            -   **_position_**: `number[2]` (121.459898, 31.308498) 位置经纬度
            -   scaleAnime: 缩放动画序列 `{`
                -   start : `number[3]` (1,1,1) 初始值
                -   array : 关键帧序列 `[`
                    -   关键帧 `{`
                        -   **_target_**: `number[3]` (1,1,1) xyz 动画目标
                        -   wait: `number` (0) 等待时间按
                        -   duration: `number` (0) 持续时间
                        -   loop: `boolean` (false) 循环开关
                        -   easing: `easing` (linear) 运动曲线,详见[easing functions](https://github.com/juliangarnier/anime/#easing-functions)
                        -   direction: `direction` (normal) 播放方向 'normal', 'reverse', 'alternate'
                    -   `}`
                -   `]`
            -   `}`
            -   rotateAnime: 旋转动画序列 `{`
                -   start : `number[3]` (0,0,0) 初始值
                -   array : 关键帧序列 `[`
                    -   关键帧 `{`
                        -   **_target_**: `number[3]` (0,0,0) xyz 动画目标
                        -   wait: `number` (0) 等待时间按
                        -   duration: `number` (0) 持续时间
                        -   loop: `boolean` (false) 循环开关
                        -   easing: `easing` (linear) 运动曲线,详见[easing functions](https://github.com/juliangarnier/anime/#easing-functions)
                        -   direction: `direction` (normal) 播放方向 'normal', 'reverse', 'alternate'
                    -   `}`
                -   `]`
            -   `}`
            -   posAnime: 位置动画序列 `{`
                -   start : `number[3]` (0,0,0) 初始值
                -   array : 关键帧序列 `[`
                    -   关键帧 `{`
                        -   **_target_**: `number[3]` xyz 动画目标
                        -   wait: `number` (0) 等待时间按
                        -   duration: `number` (0) 持续时间
                        -   loop: `boolean` (false) 循环开关
                        -   easing: `easing` (linear) 运动曲线,详见[easing functions](https://github.com/juliangarnier/anime/#easing-functions)
                        -   direction: `direction` (normal) 播放方向 'normal', 'reverse', 'alternate'
                    -   `}`
                -   `]`
            -   `}`
        -   `},`
        -   实体数据 prism `{`
            -   **_type_**: `type` ="prism" 棱柱类型
            -   **_segment_**: `number` 棱柱边数
            -   **_name_**: `string` 棱柱名字，显示在顶部
            -   **_color|colorFun_**: `number[4]|function(x,y,z)=>number[4]` () RGBA|传入点位置，传出颜色的函数
            -   **_position_**: `number[2]` (121.459898, 31.308498) 位置经纬度
            -   scaleAnime: 缩放动画序列 `{`
                -   start : `number[3]` (1,1,1) 初始值
                -   array : 关键帧序列 `[`
                    -   关键帧 `{`
                        -   **_target_**: `number[3]` (1,1,1) xyz 动画目标
                        -   wait: `number` (0) 等待时间按
                        -   duration: `number` (0) 持续时间
                        -   loop: `boolean` (false) 循环开关
                        -   easing: `easing` (linear) 运动曲线,详见[easing functions](https://github.com/juliangarnier/anime/#easing-functions)
                        -   direction: `direction` (normal) 播放方向 'normal', 'reverse', 'alternate'
                    -   `}`
                -   `]`
            -   `}`
            -   rotateAnime: 旋转动画序列 `{`
                -   start : `number[3]` (0,0,0) 初始值
                -   array : 关键帧序列 `[`
                    -   关键帧 `{`
                        -   **_target_**: `number[3]` (0,0,0) xyz 动画目标
                        -   wait: `number` (0) 等待时间按
                        -   duration: `number` (0) 持续时间
                        -   loop: `boolean` (false) 循环开关
                        -   easing: `easing` (linear) 运动曲线,详见[easing functions](https://github.com/juliangarnier/anime/#easing-functions)
                        -   direction: `direction` (normal) 播放方向 'normal', 'reverse', 'alternate'
                    -   `}`
                -   `]`
            -   `}`
            -   posAnime: 位置动画序列 `{`
                -   start : `number[3]` (0,0,0) 初始值
                -   array : 关键帧序列 `[`
                    -   关键帧 `{`
                        -   **_target_**: `number[3]` (0,0,0) xyz 动画目标
                        -   wait: `number` (0) 等待时间按
                        -   duration: `number` (0) 持续时间
                        -   loop: `boolean` (false) 循环开关
                        -   easing: `easing` (linear) 运动曲线,详见[easing functions](https://github.com/juliangarnier/anime/#easing-functions)
                        -   direction: `direction` (normal) 播放方向 'normal', 'reverse', 'alternate'
                    -   `}`
                -   `]`
            -   `}`
        -   `},`
        -   实体数据 border `{`
            -   **_type_** :`type` (border) ="border" 闭合线框
            -   **_points_** : `number[*][2]` 线框节点序列（顺时针）
            -   **_height_** : `number` (50) 线框高度
            -   **_width_** : `number` (50) 线框宽度
            -   **_color_** : `number[4]` (1,1,1,0.8) 线框颜色
        -   `},`
        -   实体数据 panel `{`
            -   **_type_** : `type` (panel) ="panel" 四边形
            -   **_points_** : `number[4][2]` 四角位置
            -   **_height_** : `number` (50) 四边形高度
            -   **_color_** : `number[4]` (1,1,1,0.8) 颜色
        -   `},` ...
    -   `]`