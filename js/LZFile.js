/*
 * LZFile - jQuery / Zepto plugin
 *
 * author - 荔枝
 *
 * Version: 0.2.0
 *
 */
;
(function($, window, document, undefined) {
	/**
	 * [LZFile 初始化方法]
	 * @param {[$(#xxx)]} el     [容器]
	 * @param {[object]} options 初始化参数
	 */
	var LZFile = function(el, options) {
		this.el = el;
		this._init(options);
		return this;
	};

	var noop = function() {};

	LZFile.fn = LZFile.prototype;

	LZFile.fn._defaultOptions = {
		dragDrop: true, // 是否可以拖拽
		url: '', //action url
		onSelected: noop, //选择文件后调用
		onDeleted: noop, //删除时调用
		onDragOver: noop, //拖动时调用
		onDragLeave: noop, //拖动离开时调用
		onProgress: noop, //进度
		onSuccess: noop, //成功
		onFailure: noop, //失败
		onComplete: noop, //完成
		filter: noop // 过滤文件方法
	};
	/**
	 * [_initUi 初始化UI]
	 */
	LZFile.fn._initUi = function() {
		this.fileInput = $('<div class="item item-add"><input class="uploadFile" type="file" name="file" multiple="" accept="image/*"></div>');
		this.el.append(this.fileInput);
	}

	LZFile.fn._init = function(options) {
		var opts = $.extend(this._defaultOptions, options || {});
		this._initUi();
		this.opts = opts;
		this._initevent();
	};
	/**
	 * 初始化事件
	 */
	LZFile.fn._initevent = function() {
		this.el.on("change", ".uploadFile", this.getFile.bind(this));
		this.el.on("click", ".close", function(e) {
			var $t = $(e.target),
				$item = '',
				index = '';
			if ($t) {
				$item = $t.closest(".item");
				index = $item.attr('data-index');
				this.delFile(index);
				$item.remove()
			}
		}.bind(this));
		if (this.opts.dragDrop) {
			this.el.on('dragover', function(e) {
				this.dragHover(e);
			}.bind(this));
			this.el.on('dragleave', function(e) {
				this.dragHover(e);
			}.bind(this));
			this.el.on('drop', function(e) {
				this.opts.onDragLeave(e)
				this.getFile(e);
				e.stopPropagation();
				e.preventDefault();
			}.bind(this));
		}
	};
	/**
	 * 拖文件到目标dom
	 * @param  {[event]} e 
	 * @return this
	 */
	LZFile.fn.dragHover = function(e) {
		console.info(e.type);
		e.stopPropagation();
		e.preventDefault();
		this.opts[e.type === "dragover" ? "onDragOver" : "onDragLeave"].call(e.target);
		return this;
	};
	/**
	 * 过滤文件，只允许图片
	 * @param  {[Array]} files 
	 */
	LZFile.fn._filter = function(files) {
		if (!this._files)
			this._files = [];
		for (var i = 0; i < files.length; i++) {
			if (files[i].type.indexOf("image") > -1) {
				files[i].index = i;
				this._files.push(files[i]);
			}
		}
	};
	/**
	 * 获取文件
	 * @param  {event} e 
	 * @return {this}
	 */
	LZFile.fn.getFile = function(e) {
		var files = e.target.files || e.dataTransfer.files;
		if (this.opts.filter != noop) {
			this._files = this.opts.filter(files);
		} else {
			this._filter(files);
		}
		this.level = 0;
		this.html = '';
		this._refreshDom(this._files);
		this.html = '';
		return this;
	};
	/**
	 * 更新dom
	 * @param  {array} files 根据现有文件更新dom
	 */
	LZFile.fn._refreshDom = function(files) {
		if (this._files.length == this.level) {
			this.el.html(this.html);
			this.el.append(this.fileInput);
			if (this.opts.onSelected != noop) {
				this.opts.onSelected(files);
			}
		} else {
			if (files[this.level]) {
				var reader = new FileReader();
				reader.onloadend = function() {
					this.html += '<div class="item" data-index="' + this.level + '"><img src="' + reader.result + '" /><em class="close"></em></div>'
					this.level++;
					this._refreshDom(files);
				}.bind(this);

				reader.readAsDataURL(files[this.level]);
			}

		}
	}

	/**
	 * 数据上删除文件
	 * @param  {number} index 删除文件index
	 * @return {this}
	 */
	LZFile.fn.delFile = function(index) {
		this._files.splice(+index, 1);
		return this;
	};
	/**
	 * 清空文件
	 * @return {this}
	 */
	LZFile.fn.emptyFile = function() {
		this._files = [];
		return this;
	};

	/**
	 * 上传文件
	 */
	LZFile.fn.upload = function() {
		if (!this._files || !this._files.length)
			return
		var self = this;
		var optionXhr;
		//if (this.opts.onProgress != noop && typeof this.opts.onProgress == 'function') {
		// fix the progress target file
		var files = this._files;
		optionXhr = function() {
			var xhr = $.ajaxSettings.xhr();
			if (xhr.upload) {
				xhr.upload.addEventListener('progress', function(e) {
					var percent = 0;
					var position = e.loaded || e.position; /*e.position is deprecated*/
					var total = e.total;
					if (e.lengthComputable) {
						percent = Math.ceil(position / total * 100);
					}
					self.opts.onProgress(e, position, total, percent, files);
				}, false);
			}
			return xhr;
		};
		//}
		var formData = new FormData();
		for (var i = 0; i < this._files.length; i++) {
			formData.append('file', this._files[i]);
		}
		$.ajax({
			url: self.opts.url,
			type: 'post',
			processData: false,
			contentType: false,
			data: formData,
			xhr: optionXhr,
			context: this,
			success: this.opts.onSuccess,
			error: this.opts.onFailure,
			complete: this.opts.onComplete
		});
		return this;
	};

	$.fn.LZFile = function(option) {
		return new LZFile($(this), option);
	};
	$.fn.LZFile.version = '0.2.0';

})(window.jQuery || window.Zepto, window, document);