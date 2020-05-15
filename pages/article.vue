<template>
    <div class="container">
        <a-row type="flex"> 
            <a-col :lg="18" :md="24" :xs="24" class="main">
                <div class="main-content" v-if="posts.length">
                    <div v-for="(item, index) in posts" :key="index">
                        <h1>{{item.title}}</h1>
                        <p>发表于 {{moment(item.timestamp).fromNow()}}</p>
                        <div v-html="item.body_html"></div>
                        <a-divider style="background: #eee" />
                    </div>
                    <h3><b>留言</b></h3>

                    <CommentItem :comments="comments" @reply="handleReply"/>

                    <a-form-model :model="form" :rules="rules"  ref="form">
                        <a-form-model-item 
                        prop="body" 
                        :extra="helpTips">
                            <a-textarea :rows="4" 
                            v-model="form.body" 
                            :placeholder="placeholder"
                            @blur="handleBodyChange">
                            </a-textarea>
                        </a-form-model-item>
                        <a-form-model-item class="comment-item" prop="temp_name">
                            <a-input v-model="form.temp_name" placeholder="昵称必填">
                                <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
                            </a-input>
                        </a-form-model-item>
                        <a-form-model-item class="comment-item" prop="temp_contact_value">
                            <a-input-group compact>
                                <a-select
                                    :defaultValue="1"
                                    v-model="form.temp_contact_type"
                                    style="width: 20%"
                                >
                                    <a-select-option :value="1">邮箱</a-select-option>
                                    <a-select-option :value="2">微信</a-select-option>
                                    <a-select-option :value="3">QQ</a-select-option>
                                </a-select>
                                <a-input
                                    style="width: 80%"
                                    placeholder="联系方式必填，不公开"
                                    v-model="form.temp_contact_value"
                                />
                            </a-input-group>
                        </a-form-model-item>
                        <a-form-item>
                            <a-button
                                :loading="submitting"
                                @click="handleSubmit"
                                type="primary"
                            >提交评论</a-button>
                        </a-form-item>
                    </a-form-model>
                </div>
                <div class="empty" v-else>
                    <p>{{categories[0] && categories[0].summary }}</p>
                    <p>当前栏目下暂无文章</p>
                </div>
            </a-col>
            <a-col :xs="24" :md="24" :lg="6" class="aside">
                <h4>目录</h4>
                <CategoryItem :data="categories" />
            </a-col>
        </a-row>
    </div>
</template>

<script>
import CategoryItem from "@/components/category-item";
import CommentItem from "@/components/comment-item";
import moment from "moment";
moment.locale('zh-CN');

export default {
    head(){
        return{
            title: (this.$route.query.name || `hsian的个人博客`) + ' - hsian的个人博客 - atlansic.com'
        }
    },
    async asyncData({query, $axios}){
        try{
            const res = await $axios({
                url: "/api/category_posts/" + query.category_id
            });

            return {
                posts: res.data.posts
            }
        }catch(err){
            return {
                posts: []
            }
        }
        
    },
    data() {
        return {
            categories: [],
            form: {
                temp_name: "",
                temp_contact_type: 1,
                temp_contact_value: "",
                body: "",
                post_id: "",
                parent_id: ""
            },
            moment,
            comments: [],
            submitting: false,
            placeholder: "评论输入框支持原生html标签，如换行<br/>、粗体<strong/>",
            helpTips: "",
            rules: {
                temp_name: [
                    {required: true, message: "请填写昵称"}
                ],
                temp_contact_value: [
                    {required: true, message: "请填写联系方式"}
                ],
                body: [
                    {required: true, message: "请填写评论内容"}
                ]
            }
        };
    },
    components: {
        CategoryItem,
        CommentItem
    },
    mounted() {
        this.init();
    },
    beforeRouteUpdate(to, from, next){
        next();
        this.init();
        this.$axios({
            url: "/api/category_posts/" + to.query.category_id
        }).then(res => {
            const {posts} = res.data;
            this.posts = posts;
        });
    },
    methods: {
        init(){
            const {top_category_id, category_id} = this.$route.query;
            this.$axios({
                url: "/api/categories/" + (top_category_id || category_id)
            }).then(res => {
                const { categories } = res.data;
                this.categories = categories;
            });

            this.getComments();
        },
        handleSubmit() {
            this.$refs.form.validate(valid => {        
                if(!valid) return;
                this.submitting = true;
                this.form.post_id = this.posts[0].id;

                this.$axios({
                    url:"/api/new_temp_comment/",
                    method: "POST",
                    data: this.form
                }).then(res => {
                    this.submitting = false;
                    this.form.body = "";
                    this.getComments();
                })
            })  
        },
        getComments(){
            if(this.posts.length === 0) return;

            this.$axios({
                url: "/api/post_comments/" + this.posts[0].id,
                params: {
                    page: 1,
                    page_size: 500
                }
            }).then(res => {
                const {comments, count} = res.data;
                this.comments = comments;
            })
        },
        handleBodyChange(){
            if(!this.form.body.trim()){
                this.placeholder = "评论输入框支持原生html标签，如换行<br/>、粗体<strong/>";
                this.helpTips = "";
                this.form.parent_id = "";
            }
        },
        handleReply(item){
            this.placeholder = "@:" + item.temp_name;
            this.helpTips = "正在回复" + item.temp_name;
            this.form.parent_id = item.id; 
        }
    }
};
</script>

<style scoped lang="less">
.container {
    margin-left: auto;
    margin-right: auto;
    max-width: 70.25rem;
    padding: 2.625rem 1.3125rem;
}

@media screen and (min-width: 991px) {
    .comment-item {
        width: 60%;
    }

    .main{
        padding-right: 30px;
    }

    .aside {
        min-height: 75vh;
        padding: 60px 20px 20px;
        box-sizing: border-box;
        border-left: 1px #eee solid;
    }
}

.main-content {
    font-size: 16px;
    line-height: 1.8;
    color: #333;

    h1 {
        font-size: 22px;
        color: #333;
        font-weight: bold;
    }

    /deep/ blockquote{
        background: #eeee;
        padding: 10px 20px;
        border-left: 2px #333 solid;
    }

    /deep/ h2, /deep/ h3, /deep/ h4{
        font-weight: bold;
        margin-top: 50px;
    }

    /deep/ ul, /deep/ ol{
        padding-left: 20px;
    }

    /deep/ .hljs{
        padding: 20px;
        border-radius: 4px;
    }

    /deep/ .ant-form-explain{
        //text-align: right;
    }
}

.aside {
    padding-top: 60px;
    h4 {
        font-size: 18px;
        font-weight: bold;
    }
}
</style>