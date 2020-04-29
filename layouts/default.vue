<template>
    <div class="page-container">
        <Header/>
        <nuxt />
        <Footer/>
    </div>
</template>
<script>
import Header from "@/components/header"
import Footer from "@/components/footer"
export default {
    components: {
        Header,
        Footer    
    }
}
</script>
<style>
.page-container{
    padding-top: 60px;
}
</style>
