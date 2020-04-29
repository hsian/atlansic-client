<template>
    <div>
        <div class="item" v-for="(item, index) in data" :key="index">
            <nuxt-link
                :to="`/article?&category_id=${item.id}&top_category_id=${item.top_parent_id}`"
                :class="{active: $route.query.category_id == item.id}"
            >{{item.name}}</nuxt-link>
            <category-item v-if="item.children" :data="item.children" />
        </div>
    </div>
</template>

<script>
export default {
    name: "category-item",
    props: {
        data: Array
    }
};
</script>

<style scoped lang="less">
.item {
    .item {
        padding-left: 20px;
    }

    a:hover {
        text-decoration: underline;
    }
}

.active{
    color: #3260b1;
    font-weight: bold;
}
</style>