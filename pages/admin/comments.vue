<template>
    <div>
        <a-table :columns="columns" 
        :dataSource="data" 
        rowKey="id" 
        childrenColumnName="unset"
        :pagination="pagination">
            <span slot="timestamp" slot-scope="timestamp">
                {{moment(timestamp).format("YYYY-MM-DD")}}
            </span>
            <span slot="user" slot-scope="text, record">
                {{record.temp_name || (record.author && record.author.name)}}
            </span>
            <span slot="action" slot-scope="text, record">
                <a @click="handleEdit(record)">
                    <a-tag :color="record.enable ? 'geekblue' : 'red'">
                        {{record.enable ? '打开' : '关闭'}}
                    </a-tag>
                </a>
            </span>
        </a-table>
    </div>
</template>

<script>
import moment from "moment";
const columns = [
    {
        title: "发布时间",
        dataIndex: "timestamp",
        key: "timestamp",
        width: "15%",
        scopedSlots: { customRender: "timestamp" }
    },
    {
        title: "文章",
        dataIndex: "post_title",
        width: "30%",
        key: "post_title"
    },
    {
        title: "用户",
        dataIndex: "user",
        width: "15%",
        key: "user",
        scopedSlots: { customRender: "user" }
    },
    {
        title: "内容",
        dataIndex: "body",
        width: "30%",
        key: "body"
    },
    {
        title: "操作",
        key: "action",
        scopedSlots: { customRender: "action" }
    }
];

export default {
    layout: 'admin',
    data(){
        return {
            moment,
            data: [],
            columns,
            pagination: {
                onChange: page => {
                    this.pagination.current = page;
                    this.getData();
                },
                onShowSizeChange: (current, size) => {
                    this.pagination.pageSize = size;
                    this.getData();
                },
                total: 0,
                current: 1,
                pageSize: 5,
                showSizeChanger: true,
                pageSizeOptions: ['5', '10', '15', '20']
            },
        }
    },
    mounted(){
        this.getData();
    },
    methods: {
        async getData(){
            const res = await this.$axios({
                url: "/api/all_comments/",
                params: {
                    page: this.pagination.current,
                    pageSize: this.pagination.pageSize
                }
            })
            const {count, comments} = res.data;   
            this.pagination.total = count;
            this.data = comments;
        },
        handleEdit(item){
            this.$confirm({
                title: '提示',
                content: `确定要${!item.enable ? '打开' : '关闭'}评论吗？`,
                okText: "确定",
                cancelText: "取消",
                onOk: async () => {
                    const {token} = this.$store.state.user;
                    const res = await this.$axios({
                        url: "/api/edit_comment/" + item.id,
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        data: {
                            enable: !item.enable
                        }
                    });
                    
                    this.getData();
                    this.$message.success("编辑成功");
                },
                onCancel() {},
            });
        }
    }
};
</script>

<style>
</style>