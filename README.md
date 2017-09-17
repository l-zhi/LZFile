# LZFile
Images File Upload widget with multiple file selection, drag&amp;drop support, progress bar, exif, validation filter and preview images for zepto, usually used in webapp with ios and android. that only supports standard HTML5.

图片上传组件基于zepto，通过exif-js获取图片描述信息，只支持HTML5， 适用于 IOS 和 android webapp 开发，或是支持html5 的 chrome，safari。支持图片上传预览，以及拖拽，进度条等超轻量级组件


First you must include Zepto and LZFile in your code:
```html
<script src="dist/js/zepto.js"></script>
<script src="dist/js/lzfile.zepto.min.js"></script>
```

HTML code：
```html
<div class="J_upload mod-upload-pic"></div>
```

javascript code：
```html
var lzfile = $(".J_upload").LZFile({
        "url":"", // action url
        "onSuccess":function(data){
            //TODO
        }
    });
```

```html
lzfile.upload(); // 上传图片方法
```

#### Example
[LZFile Demo](http://l-zhi.com/demo/github/LZFile/index.html).

## API:

options
```
LZFile.fn._defaultOptions = {
    dragDrop: true,
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

### settings

#### dragDrop 
boolean
Whether to close drag event or open it

#### url
action url 

#### onSelected
Fires while files is selected

#### onDragOver
Fires while a file drag over the dom

#### onDragLeave
Fires while a file drag leave the dom

#### onProgress
Fires while a file is being uploaded. Use this event to update the current file upload progress

#### onSuccess
Fires when a file is successfully uploaded

#### onFailure
Fires when a file is failure uploaded

#### onComplete
Fires when all files are uploaded or no files uploaded

#### filter
filter files and required return files

###function
####delFile(index)
index: the index of the file in array

####upload
Uploader instance sending the event

####currentFiles
Current Files

## License

All code licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
