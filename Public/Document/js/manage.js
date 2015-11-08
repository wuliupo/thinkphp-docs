+function($){

/**
 * 定义内部全局变量
 */
var 

/**
 * 当前窗口 jQuery 对象
 * @type {Object}
 */
$win = $(window),

/**
 * 当前document jQuery 对象
 * @type {Object}
 */
$doc = $(document),

/**
 * 文档中心管理对象
 * 提供一系列文档编辑，提交等方法
 * @type {Object}
 */
Manage = {
    /**
     * 文档对象
     * 当前文档对象
     */
    "doc" : null,

    /**
     * 编辑对象
     * 用于实现编辑的元素
     * 初始化时放入文章元素后面
     */
    "editor" : null,

    /**
     * 初始化编辑功能
     * 当登录用户有编辑权限时调用一次该方法
     * 该方法主要初始化编辑功能
     */
    "init" : function(){
        var self = this;

        /* 初始化相关属性 */
        this.doc    = window.Article;
        this.editor = $("<div/>").attr("id", "editor").addClass("editable");

        /* 添加编辑元素 */
        this.doc.article.before(this.editor);

        /* Editor对象绑定编辑功能 */
        this.editor.click(function(){
            var id;

            //已经进入编辑状态
            if(self.editor.hasClass("editor")) return;

            /* 获取编辑内容并创建编辑器 */
            id = self.doc.menu.data("ThinkTree").item(".active").data("id");
            $.get(
                self.doc.article.data("info"),
                {"id" : id},
                function(data){
                    if(data.content !== undefined){
                        //创建编辑器
                        self.create(id, data.content);
                    } else {
                        //TODO: 获取数据错误
                    }
                },
                "json"
            );
        });

        /* 绑定快捷键 */
        $doc.thinkkeyboard({
            //编辑当前页面
            "ctrl+e" : function(){
                self.editor.click();
                return false;   
            },

            //取消编辑
            "esc" : function(){
                self.remove();
                return false;
            }
        });
    },

    /**
     * 创建编辑器
     * @param  {Integer} id     被编辑文档ID
     * @param  {String}  content 被编辑的内容
     * @return {Object}  当前文档对象
     */
    "create" : function(id, content){
        var self      = this, 
            options   = {
                "onSave"   : _save, 
                "uploader" : this.doc.article.data("upload")
            }, 
            $textarea = $("<textarea/>").val(content);

        /* 创建编辑器 */
        this.editor.removeClass("editable").addClass("editor");
        $textarea.appendTo(this.editor).thinkeditor(options).focus();
        return this;

        /* 保存编辑器数据 */
        function _save(){
            self.save(id, $textarea.val());
        }
    },

    /**
     * 保存编辑内容
     * @param  {Integer} id     被编辑文档ID
     * @param  {String}  content 被编辑的内容
     * @return {Object}  当前文档对象
     */
    "save" : function(id, content){
        var self = this;

        /* 保存编辑内容并卸载编辑器 */
        $.post(
            self.doc.article.data("save"),
            {"id" : id, "content" : content},
            function(data){
                var article;
                if(data.content){
                    //更新编辑后的内容
                    self.doc.content.html(data.content);
                    //卸载编辑器
                    self.remove();
                    //代码高亮
                    self.doc.prettify();
                    //更改缓存数据
                    article = self.doc.menu.data("ThinkTree").item(".active").data("article");
                    article && (article.content = data.content);
                } else {
                    //TODO: 保存数据错误
                }
            },
            "json"
        );
        return this;
    },

    /**
     * 卸载编辑器
     * @return {Object} 当前文档对象
     */
    "remove" : function(){
        this.editor.empty().removeClass("editor").addClass("editable");
        return this;
    }
};

//注册全局变量
window.DocManage = Manage;

}(jQuery);