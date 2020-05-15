<template>
    <div>
        <a-form-model :model="form" ref="form" class="form" :rules="rules">
            <a-form-model-item prop="category_id">
                <a-cascader
                    v-model="categories"
                    :options="options"
                    @change="handleCategory"
                    :fieldNames="{label: 'name', value:'id', children: 'children'}"
                    placeholder="选择栏目"
                ></a-cascader>
            </a-form-model-item>

            <a-form-model-item prop="title">
                <a-input placeholder="标题" v-model="form.title" />
            </a-form-model-item>

            <a-form-model-item prop="body">
                <client-only>
                    <mavon-editor style="min-height: 500px" 
                    ref="md" 
                    @imgAdd="handleImageAdded"
                    :toolbars="toolbars" 
                    v-model="form.body"/>                  
                </client-only>
            </a-form-model-item>

            <a-form-model-item>
                <a-switch :defaultChecked="form.enable" @change="handleEnable" /> 关闭
            </a-form-model-item>

            <a-form-model-item>
                <a-button type="primary" @click="handleSubmit">提交</a-button>
            </a-form-model-item>
        </a-form-model>
    </div>
</template>

<script>
export default {
    layout: 'admin',
    data(){
        return {
            toolbars: {
                bold: true, // 粗体
                italic: true, // 斜体
                header: true, // 标题
                underline: true, // 下划线
                strikethrough: true, // 中划线
                mark: true, // 标记
                superscript: true, // 上角标
                subscript: true, // 下角标
                quote: true, // 引用
                ol: true, // 有序列表
                ul: true, // 无序列表
                link: true, // 链接
                imagelink: true, // 图片链接
                code: true, // code
                table: true, // 表格
                fullscreen: true, // 全屏编辑
                readmodel: true, // 沉浸式阅读
                htmlcode: true, // 展示html源码
                help: true, // 帮助
                /* 1.3.5 */
                undo: true, // 上一步
                redo: true, // 下一步
                trash: true, // 清空
                save: true, // 保存（触发events中的save事件）
                /* 1.4.2 */
                navigation: true, // 导航目录
                /* 2.1.8 */
                alignleft: true, // 左对齐
                aligncenter: true, // 居中
                alignright: true, // 右对齐
                /* 2.2.1 */
                subfield: true, // 单双栏模式
                preview: true, // 预览
            },
            form: {
                title: "",
                body: "",
                body_html: "",
                category_id: "",
                enable: ""
            },
            categories: [],
            cacheCategories: [],
            findEnd: false,
            options: [],
            rules: {
                category_id: [{required: true, message: '请选中栏目', trigger: "blur"}],
                title: [{required: true, message: '请输入标题', trigger: "blur"}],
                body: [{required: true, message: '请输入内容', trigger: "blur"}]
            },
            id: ""
        }
    },
    async mounted(){
        try{
            const res = await this.$axios({
                url: "/api/categories/"
            });
            const { categories } = res.data;
            this.options = categories;
        }catch(err){
            console.log(err)
        }
        
        try{
            const {id} = this.$route.query;
            this.id = id;
            const res = await this.$axios({
                url: "/api/post/" + id
            })
            const data = res.data;
            this.form = {
                title: data.title,
                body: data.body,
                category_id: data.category.id,
                enable: data.enable
            }
            this.loop(this.options); 
        }catch(err){
            console.log(err)
        }
    },
    methods: {
        loop(arr){
            arr.forEach(v => {
                if(this.findEnd) {
                    return;
                };
                this.cacheCategories.length = v.level - 1;
                this.cacheCategories.push(v.id);

                if(v.id === this.form.category_id){
                    this.categories = this.cacheCategories;
                    this.findEnd = true;
                    return;
                }
                if(v.children.length){
                    this.loop(v.children);
                }
            })
        },
        handleImageAdded(pos, file){
            const {token} = this.$store.state.user;
            const formData = new FormData();
            formData.append("file", file);

            this.$axios({
                url: "/api/upload/",
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: formData
            }).then(result => {
                let url = this.$axios.defaults.baseURL + result.data.url;
                this.$refs.md.$img2Url(pos, url);
            })
        },
        handleCategory(value){
            this.form.category_id = this.categories[this.categories.length - 1]
        },
        handleEnable(value){
            this.form.enable = value;
        },
        handleSubmit(){
            const {token} = this.$store.state.user;
            this.form.body_html = document.querySelector(".v-show-content").innerHTML;
            this.$refs.form.validate(valid => {
                if(!valid) return;
                this.$axios({
                    url: "/api/edit_post/" + this.id,
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    data: this.form
                }).then(res => {
                    this.$message.success("编辑成功");
                    this.$router.replace("/admin")
                })
            })
        }
    }
};
</script>

<style scoped lang="less">
.form {
    margin:0 auto;

    /deep/ .ant-form-item-control {
        line-height: 1.5;
    }

    /deep/ .ql-toolbar.ql-snow {
        border-color: #d9d9d9;
        border-radius: 6px 6px 0 0;
    }

    /deep/ .ql-container.ql-snow {
        border-color: #d9d9d9;
        border-radius: 0 0 6px 6px;
    }
}

/deep/ .ql-editor {
    min-height: 500px;
}

/deep/ .v-note-wrapper{
    z-index: 999;
}
</style>