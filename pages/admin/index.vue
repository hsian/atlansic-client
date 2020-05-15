<template>
    <div>
        <a-list itemLayout="vertical" size="large" :pagination="pagination" :dataSource="listData">
            <div slot="footer">
                共有 <b>{{pagination.total}}</b> 篇文章
            </div>
            <a-list-item slot="renderItem" slot-scope="item, index" key="item.title">
                <template slot="actions" v-for="{ type, text, action } in actions">
                    <span :key="type" @click="action(item)">
                        <a-icon :type="type" style="margin-right: 8px" />
                        {{ text }}
                    </span>
                </template>
                <a-list-item-meta :description="item.category.name">
                    <a slot="title" :href="item.href">{{ item.title }}</a>
                </a-list-item-meta>
                <div class="content">
                    {{item.body_html | matchTag}}
                </div>
            </a-list-item>
        </a-list>
    </div>
</template>

<script>
export default {
    layout: "admin",
    data() {
        return {
            listData: [],
            pagination: {
                onChange: page => {
                    this.pagination.current = page;
                    this.getData();
                },
                total: 0,
                current: 1,
                pageSize: 3
            },
            actions: [
                { 
                    type: "edit-o", 
                    text: "编辑", 
                    action: (item) => {
                        this.$router.push({
                            path: "/admin/edit-post",
                            query: {
                                id: item.id
                            }
                        })
                    } 
                }
            ]
        };
    },
    mounted(){
        this.getData();
    },
    methods: {
        async getData(){
            const res = await this.$axios({
                url: "/api/posts/",
                params: {
                    page: this.pagination.current,
                    pageSize: this.pagination.pageSize
                }
            })
            const {count, posts} = res.data;   
            this.pagination.total = count;
            this.listData = posts;
        }
    },
    filters: {
		matchTag(value){
			if(!value) return ``;
			return value.replace(/<\/?.+?\/?>/g,'')
		}
	}
};
</script>

<style scoped lang="less">
.content{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
</style>