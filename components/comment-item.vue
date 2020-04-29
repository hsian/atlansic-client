<template>
<div>
    <a-comment v-for="(item, index) in comments"
    :key="item.id" 
    :author="item.temp_name">
        <span slot="actions">
            <a @click="handleReply(item)">回复</a>
        </span>
        <p slot="content">{{ item.body }}</p>
        <a-tooltip slot="datetime">
            <span>{{ moment(item.timestamp).fromNow() }}</span>
        </a-tooltip>
        

        <comment-item :comments="item.children" @reply="handleReply"/>
    </a-comment>
</div>
</template>

<script>
import moment from "moment";
export default {
    name: "comment-item",
    data(){
        return {
            moment,
            actions: ["回复"]
        }
    },
    props: {
        comments: Array
    },
    methods: {
        handleReply(item){
            console.log(item)
            this.$emit("reply", item)
        }
    }
}
</script>

<style>
.main-content > div >.ant-comment{
    border: 1px #eee solid;
    margin-bottom: 20px;
    background: #f6f6f6;
}

.main-content  .ant-comment-inner{
    padding-bottom: 0;
}
</style>