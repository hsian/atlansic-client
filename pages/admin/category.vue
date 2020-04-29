<template>
    <div>
        <a-table :columns="columns" :dataSource="data" rowKey="id" :pagination="false">
            <span slot="enable" slot-scope="enable">
                <a-tag :color="enable ? 'geekblue' : 'red'">{{enable ? '打开' : '关闭'}}</a-tag>
            </span>
            <span slot="action" slot-scope="text, record">
                <a @click="handleEdit(record)">编辑</a>
                <a-divider type="vertical" />
                <a-dropdown :trigger="['click']">
                    <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                        更多
                        <a-icon type="down" />
                    </a>
                    <a-menu slot="overlay">
                        <a-menu-item key="0" @click.native="handleNewCategory(record)">添加子菜单</a-menu-item>
                    </a-menu>
                </a-dropdown>
            </span>
        </a-table>

        <a-modal
            title="Title"
            :visible="visible"
            @ok="handleOk"
            :confirmLoading="confirmLoading"
            @cancel="handleCancel"
            okText="确定"
            cancelText=取消
        >
            <a-form-model 
            ref="form"
            :model="form" 
            :rules="rules"
            :label-col="{ span: 3 }" 
            :wrapper-col="{ span: 20 }">
                <a-form-model-item label="名称" prop="name">
                    <a-input v-model="form.name" />
                </a-form-model-item>
                <a-form-model-item label="描述">
                    <a-textarea v-model="form.summary" :row="3"/>
                </a-form-model-item>
                <a-form-model-item label="状态" v-if="actionType === `edit`">
                    <a-switch :defaultChecked="form.enable" @change="handleEnableChange" />
                </a-form-model-item>
            </a-form-model>   
        </a-modal>
    </div>
</template>

<script>
const columns = [
    {
        title: "名称",
        dataIndex: "name",
        key: "name",
        width: "30%"
    },
    {
        title: "ID",
        dataIndex: "id",
        width: "15%",
        key: "id"
    },
    {
        title: "状态",
        dataIndex: "enable",
        width: "15%",
        key: "enable",
        scopedSlots: { customRender: "enable" }
    },
    {
        title: "操作",
        key: "action",
        scopedSlots: { customRender: "action" }
    }
];

export default {
    layout: "admin",
    data() {
        return {
            data: [],
            columns,
            visible: false,
            confirmLoading: false,
            actionType: "",
            form: {
                id: "",
                name: "",
                summary: "",
                enable: "",
                parent_id: ""
            },
            rules: {
                name: [
                    {required: true, message: '名称不能为空', trigger: 'blur'}
                ]
            }
        };
    },
    async mounted() {
        this.getCategories();
    },
    methods: {
        async getCategories(){
            const res = await this.$axios({
                url: "/api/categories/"
            });
            const { categories } = res.data;

            this.data = categories;
        },
        
        async handleEditSubmit() {
            this.dialogFormVisible = false;
        },
        handleEdit(item) {
            this.actionType = "edit";
            this.visible = true;
            const {id, name, summary, enable} = item;
            this.form = {
                id, name, summary, enable
            };
        },
        handleNewCategory(item){
            this.actionType = "new";
            this.visible = true;
            const {id} = item;
            this.form.parent_id = id;
        },
        handleOk(e) {
            this.confirmLoading = true;
            const {token} = this.$store.state.user;

            this.$refs.form.validate(async valid => {
                if(!valid) return;

                if(this.actionType === "edit"){
                    const {id, parent_id, ...props} = this.form;
                    const res = await this.$axios({
                        url: `/api/edit_category/${id}`,
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        data: props
                    })
                }
                if(this.actionType === "new"){
                    const {id, enable, ...props} = this.form;
                    const res = await this.$axios({
                        url: `/api/new_category/`,
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        data: props
                    })
                }

                this.$message.success('提交成功');
                this.initForm();
                this.getCategories();
                this.visible = false;
                this.confirmLoading = false;
            })
        },
        handleCancel(e) {
            this.initForm();
            this.visible = false;
        },
        initForm(){
            this.form = {
                id: "",
                name: "",
                summary: "",
                enable: "",
                parent_id: ""
            };
        },
        handleEnableChange(value) {
            this.form.enable = value;
        }
    }
};
</script>

<style>
</style>