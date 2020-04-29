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
                    <editor
                        class="editor"
                        :editorToolbar="customToolbar"
                        useCustomImageHandler
                        @image-added="handleImageAdded"
                        v-model="form.body"
                    />
                </client-only>
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
            customToolbar: [
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                ['blockquote', 'code-block'],
                ['image', 'video'],
                [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                [{ 'direction': 'rtl' }],                         // text direction
            ],
            form: {
                title: "",
                body: "",
                category_id: ""
            },
            categories: [],
            options: [],
            rules: {
                category_id: [{required: true, message: '请选中栏目', trigger: "blur"}],
                title: [{required: true, message: '请输入标题', trigger: "blur"}],
                body: [{required: true, message: '请输入内容', trigger: "blur"}]
            }
        }
    },
    async mounted(){
        const res = await this.$axios({
            url: "/api/categories/"
        });
        const { categories } = res.data;
        this.options = categories;
    },
    methods: {
        handleImageAdded(file, Editor, cursorLocation, resetUploader){
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
                Editor.insertEmbed(cursorLocation, "image", url);
                resetUploader();
            })
        },
        handleCategory(value){
            this.form.category_id = this.categories[this.categories.length - 1]
        },
        handleSubmit(){
            const {token} = this.$store.state.user;
            this.$refs.form.validate(valid => {
                if(!valid) return;
                
                this.$axios({
                    url: "/api/new_post/",
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    data: this.form
                }).then(res => {
                    this.$message.success("发布成功");
                    this.$router.replace("/admin")
                })
            })
        }
    }
};
</script>

<style scoped lang="less">
.form {
    max-width: 950px;
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
</style>