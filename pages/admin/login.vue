<template>
    <div class="container">
        <a-form-model
            ref="ruleForm"
            :model="form"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
        >
            <a-form-model-item label="账号: " prop="username">
                <a-input v-model="form.username" />
            </a-form-model-item>
            <a-form-model-item label="密码: " prop="password">
                <a-input v-model="form.password" type="password" />
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button type="primary" @click="onSubmit">登录</a-button>
            </a-form-model-item>
        </a-form-model>
    </div>
</template>
<script>
export default {
    data() {
        return {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            other: "",
            form: {
                username: "",
                password: ""
            },
            rules: {
                username: [
                    {
                        required: true,
                        message: "请输入账号",
                        trigger: "blur"
                    }
                ],
                password: [
                    {
                        required: true,
                        message: "请输入密码",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    methods: {
        onSubmit() {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    this.$axios({
                        url: "/api/login/",
                        method: "POST",
                        data: this.form
                    }).then(res => {
                        const {token, message} = res.data;
                        this.$message.success(message);
                        this.$store.commit("user/setToken", token);
                        this.$router.replace("/admin")
                    })
                }
            });
        }
    }
};
</script>
<style lang="less" scoped>
.container{
    width: 500px;
    margin: 200px auto;
}
</style>