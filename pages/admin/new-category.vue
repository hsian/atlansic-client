<template>
    <div>
        <a-form-model 
        ref="form"
        :model="form" 
        :rules="rules"
        :label-col="labelCol" 
        :wrapper-col="wrapperCol"
        style="max-width: 750px; margin: 0 auto;">
            <a-form-model-item label="名称" prop="name">
                <a-input v-model="form.name" />
            </a-form-model-item>
            <a-form-model-item label="描述">
                <a-textarea v-model="form.summary" :row="3"/>
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button type="primary" @click="onSubmit">
                    提交
                </a-button>
            </a-form-model-item>
        </a-form-model>   
    </div>
</template>

<script>
export default {
    layout: "admin",
    data(){
        return {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            form: {
                name: "",
                summary: "",
            },
            rules: {
                name: [
                    {required: true, message: '名称不能为空', trigger: 'blur'}
                ]
            }
        }
    },
    methods: {
        onSubmit(){
             this.$refs.form.validate(async valid => {
                 const {token} = this.$store.state.user;
                 const res = await this.$axios({
                    url: `/api/new_category/`,
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    data: this.form
                });
                this.$message.success('提交成功');
                this.$router.push("/admin/category");
             })
            
        }
    }
};
</script>

<style>
</style>