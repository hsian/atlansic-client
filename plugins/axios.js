export default ({$axios, redirect, route}) => {
    $axios.onError(res => {
        console.log(res)
        if(res.response && res.response.status == 401){ 
            const {message} = res.response.data;
            alert(message);

            if(route.path.indexOf("/admin/login") == -1){
                redirect("/admin/login")
            }
        }
    })
}