<template>
    <a-layout id="layout">
        <a-layout-header class="header">
            <a-row type="flex" justify="space-between">
                <div class="logo" />
                <div class="logout" @click="handleLogout">
                    退出登录
                </div>
            </a-row>        
        </a-layout-header>
        <a-layout>
            <a-layout-sider width="200" style="background: #fff">
                <a-menu
                    mode="inline"
                    :defaultSelectedKeys="keys"
                    :defaultOpenKeys="group"
                    :style="{ height: '100%', borderRight: 0 }"
                >
                    <a-sub-menu key="sub1">
                        <span slot="title">
                            <a-icon type="unordered-list" />文章管理
                        </span>
                        <a-menu-item key="1">
                            <nuxt-link to="/admin">文章列表</nuxt-link>
                        </a-menu-item>
                        <a-menu-item key="2">
                            <nuxt-link to="/admin/new-post?group=sub1&key=2">发布文章</nuxt-link>
                        </a-menu-item>
                    </a-sub-menu>
                    <a-menu-item key="3">
                        <nuxt-link to="/admin/comments?group=&key=3">
                            <a-icon type="message" />评论列表
                        </nuxt-link>
                    </a-menu-item>
                    <a-menu-item key="4">
                        <nuxt-link to="/admin/users?group=&key=4">
                            <a-icon type="user" />用户列表
                        </nuxt-link>
                    </a-menu-item>
                    <a-sub-menu key="sub2">
                        <span slot="title">
                            <a-icon type="align-left" />栏目管理
                        </span>
                        <a-menu-item key="5">
                            <nuxt-link to="/admin/category?group=sub2&key=5">栏目列表</nuxt-link>
                        </a-menu-item>
                        <a-menu-item key="6">
                            <nuxt-link to="/admin/new-category?group=sub2&key=6">新增栏目</nuxt-link>
                        </a-menu-item>
                    </a-sub-menu>
                </a-menu>
            </a-layout-sider>
            <a-layout style="padding: 24px">
                <a-layout-content
                    :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
                >
                    <nuxt />
                </a-layout-content>
            </a-layout>
        </a-layout>
    </a-layout>
</template>
<script>
export default {
    data() {
        return {
            group: ["sub1"],
            keys: ["1"]
        };
    },
    created() {
        const { group, key } = this.$route.query;
        if (group || key) {
            this.group = [group];
            this.keys = [key];
        }

        setTimeout(() => {
            if(this.$store.state.user.token == ""){
                this.$router.replace("/admin/login");
            }
        }, 0)
        
    },
    methods: {
        handleLogout(){
            this.$confirm({
                title: '确认',
                content: '确定要退出吗？',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    this.$store.commit("user/setToken", "");
                    this.$router.replace("/admin/login");
                }
            })
        }
    }
};
</script>
<style scoped lang="less">
#layout {
    min-height: 100vh;
    .logo {
        width: 120px;
        height: 31px;
        background: rgba(255, 255, 255, 0.2);
        margin: 16px 28px 16px 0;
    }

    .logout{
        color: #999;
        cursor: pointer;

        &:hover{
            color: #ccc;
        }
    }
}
</style>
