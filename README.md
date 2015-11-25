# LZFile
Images File Upload widget with multiple file selection, drag&amp;drop support, progress bar, validation filter and preview images for zepto, usually used in webapp with ios and android. that only supports standard HTML5.

图片上传组件基于zepto，只支持HTML5， 适用于 IOS 和 android webapp 开发，或是支持html5 的 chrome，safari。支持图片上传预览，以及拖拽，进度条等超轻量级组件


#### First you must include Zepto and LZFile in your code:
#### 需要引用zepto库和LZFile

```html
<script src="./js/zepto.js"></script>
<script src="./js/LZFile.js"></script>
```

#### HTML code：

```html
<div class="J_upload mod-upload-pic"></div>
```

#### javascript code：
```html
var lzfile = $(".J_upload").LZFile({
        "url":"", // action url
        "onSuccess":function(data){
            //TODO
        }
    });
```

```html
lzfile.upload(); // 上传图片
```


# API:

```
LZFile.fn._defaultOptions = {
    dragDrop: true, // 是否可以拖拽
    url: '', //action url
    onSelected: function(){}, //选择文件后调用
    onDragOver: function(){}, //拖动时调用
    onDragLeave: function(){}, //拖动离开时调用
    onProgress: function(){}, //进度
    onSuccess: function(){}, //成功
    onFailure: function(){}, //失败
    onComplete: function(){}, //完成
    filter:  function(){} // 过滤文件方法
};
```

### 参数

#### dragDrop
是否可以拖拽 手机端web可以关闭

#### url
后台处理接口

#### onSelected
选择文件后调用 参数 files 选择成功的文件列表

#### onDragOver
拖动时调用

#### onDragLeave
拖动离开时调用

#### onProgress
进度 传入参数包含百分比

#### onSuccess
上传服务器成功

#### onFailure
上传服务器失败

#### onComplete
上传服务器完成

#### filter
传入 files 选择的文件， 方法必须返回过滤后的文件列表

###包含的方法
####delFile(index)
index: 删除选择的第几个file

####upload
上传图片到服务器

# License

All code licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
