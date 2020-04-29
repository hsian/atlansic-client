<template>
    <div class="header">
        <a-row type="flex" align="middle" class="main">
            <!-- <a-col>
                <nuxt-link to="/">
                    <div class="logo">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </nuxt-link>
            </a-col> -->
            <a-col :span="24">
                <a-row type="flex" class="links">
                    <nuxt-link to="/">首页</nuxt-link>
                    <nuxt-link to="/article?name=微前端&category_id=2">微前端</nuxt-link>
                    <nuxt-link to="/article?name=Typescript&category_id=1">Typescript</nuxt-link>
                    <nuxt-link to="/article?name=兴趣爱好&category_id=3">兴趣爱好</nuxt-link>
                </a-row>
            </a-col>
        </a-row>
    </div>
</template>

<script>
export default {
    methods: {
        confirm(){
            
        }
    }
};
</script>

<style scoped lang="less">
.header{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: #3260b1;
    height: 60px;
    z-index: 2;

    .main{
        margin-left: auto;
        margin-right: auto;
        max-width: 70.25rem;
    }
}

@media screen and (max-width: 990px) {
    .header{
        .main{
            position: relative;
            padding:0 20px;
        }

        .logo{
            display: none;
        }

        .links{
            margin-left: 00px;
            a{
                font-size: 14px;
                margin: 0 10px
            }
        }
    }

    
}

.logo{
    position: relative;
    top: 8px;
    transform: scale(0.6);
    height: 60px;
    width: 60px;

    span{
        display: block;
        position: absolute;
        background: #fff;
        width: 20px;
        height: 20px;
        transform: rotate(45deg);
    }

    span:nth-child(1){
        left: 10px;
    }

    span:nth-child(2){
        top: 16px;
        left: -6px;
    }

    span:nth-child(3){
        left: 26px;
        top: 16px;
    }
}

.links{
    a{
        display: block;
        font-size: 18px;
        margin:0 20px;
        height: 60px;
        box-sizing: border-box;
        line-height: 60px;
        // border-bottom: 2px yellow solid;
        color: #fff;
        // font-weight: bold;
    }

    a:hover{
        border-bottom: 2px yellow solid;
    }

    /deep/ .nuxt-link-exact-active{
        border-bottom: 2px yellow solid;
        font-weight: bold;
    }
}
</style>