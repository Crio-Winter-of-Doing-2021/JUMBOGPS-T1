async function logout(){

    try{

        let response = await fetch('/users/logout', {method:'post'})

        if(response.status >=200 && response.status <= 299){
            window.location.replace('/login')
        }

    }catch (e){
        console.log(e)
    }

}