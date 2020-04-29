<template>
    <div class="container">
		<a-row type="flex">
			<a-col :span="24">
				<a-list itemLayout="vertical" size="large" :pagination="pagination" :dataSource="listData">
					<div slot="footer">
						共 <b>{{total}}</b> 篇文章
					</div>
					<a-list-item slot="renderItem" 
					slot-scope="item, index" 
					key="item.title">
						<template slot="actions" v-for="{ type, text } in actions">
							<span :key="type">
								<a-icon :type="type" style="margin-right: 8px" />
								{{ text }}
							</span>
						</template>
						<a-list-item-meta :description="moment(item.timestamp).fromNow()">
							<nuxt-link class="title"
								:to="`/article?category_id=${item.category.id}&top_category_id=${item.category.top_parent_id}`" 
								slot="title" 
								:href="item.href">
								{{ item.title }}
							</nuxt-link>
						</a-list-item-meta>
						<div class="content">
							{{item.body}}
						</div>
					</a-list-item>
				</a-list>
			</a-col>
		</a-row>
    </div>
</template>

<script>
import moment from "moment";
export default {
	async asyncData(ctx){
		const res = await ctx.$axios({
			url: "/api/posts",
			params: {
				page: 1,
				page_size: 5
			}
		})

		return {
			listData: res.data.posts,
			total: res.data.count
		}
	},
    data() {
        return {
            pagination: {
                onChange: async page => {
					this.pagination.current = page;
					const res = await this.$axios({
						url: "/api/posts/",
						params: {
							page: this.pagination.current,
							pageSize: this.pagination.pageSize
						}
					})
					const {posts} = res.data;   
					this.listData = posts;
                },
				pageSize: 5,
				current: 1,
				total: 0
            },
            actions: [
			],
			moment
        };
	},
	mounted(){
		console.log(this.listData)
		this.pagination.total = this.total;
	}
};
</script>

<style scoped lang="less">
.container{
	margin-left: auto;
    margin-right: auto;
    max-width: 70.25rem;
    padding: 2.625rem 1.3125rem;
}

.title{
	font-size: 1.4427rem;
	color: #007acc;
}

.content{
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2s;
	overflow: hidden;
	font-size: 16px;
}
</style>