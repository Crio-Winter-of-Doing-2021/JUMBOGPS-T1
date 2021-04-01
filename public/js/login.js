const heading = document.querySelector('#heading')
const signIn = document.querySelector('#signIn')
const register = document.querySelector('#register')
const toggler = document.querySelector('#toggler')
const emailError = document.querySelector('#emailError')
const passwordError = document.querySelector('#passwordError')
const loginError = document.querySelector('#loginError')
const registerError = document.querySelector('#registerError')

const clearErrors = () => {
    emailError.textContent = ''
    passwordError.textContent = ''
    loginError.textContent = ''
    registerError.textContent = ''
}

const validateEmail = (email) => {

    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
        return true
    }

    if(!email || email.length === 0){
        emailError.textContent = 'Email can not be empty'
    }else{
        emailError.textContent = 'Invalid Email'
    }
    
    
    return false

}

const validatePassword = (password) => {

    if(!password){
        passwordError.textContent = 'Password can not be empty'
        return false;
    }

    if(password.length<5){

        if(register.style.display === 'block'){
            // set error only while registering
            passwordError.textContent = 'Password should atleast be 5 characters'
        }

        return false

    }

    return true

}

const setUpLogInForm = () => {

    document.querySelector('#email').value = ''
    document.querySelector('#password').value = ''
    clearErrors()

    toggler.textContent = 'Sign Up?'
    heading.textContent = 'Login'
    register.style.display = 'none'
    signIn.style.display = 'block'

}

const setUpRegisterForm = () => {

    document.querySelector('#email').value = ''
    document.querySelector('#password').value = ''
    clearErrors()

    toggler.textContent = 'Login?'
    heading.textContent = 'Register'
    signIn.style.display = 'none'
    register.style.display = 'block'

}

const toggleForm = () => {

    if(register.style.display === 'none'){
        setUpRegisterForm()
    }else{
        setUpLogInForm()
    }

}

signIn.addEventListener('click', async (e) => {

    e.preventDefault()

    signIn.disabled = true

    clearErrors()

    const email = document.querySelector('#email').value.trim()
    const password = document.querySelector('#password').value

    if(validateEmail(email) && validatePassword(password)){
        // call the log in api
        let response = await fetch(`users/login`,{
             method: 'POST',
             credentials: 'include',
             headers: {
                 'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, password})
            })

        if(response.status === 400){

            let error = await response.json()

            
            loginError.textContent = error.message
            

            signIn.disabled = false
            return
    }

    response = await response.json()

    window.localStorage.removeItem('jumboGPSemail')
    window.localStorage.setItem('jumboGPSemail', response.user.email)

    window.location.replace('/')

}


    signIn.disabled = false
})

register.addEventListener('click', async (e) => {

    e.preventDefault()
    register.disabled = true

    clearErrors()

    const email = document.querySelector('#email').value.trim()
    const password = document.querySelector('#password').value

    if(validateEmail(email) && validatePassword(password)){
        // call the signup api
        
        let response = await fetch(`users/signup`,{
             method: 'POST',
             credentials: 'include',
             headers: {
                 'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, password})
            })

        if(response.status === 400){

            let error = await response.json()

            if(error.code === 11000){
                registerError.textContent = 'Given Email already exists'
            }

            register.disabled = false
            return
        }

        response = await response.json()

        window.localStorage.removeItem('jumboGPSemail')
        window.localStorage.setItem('jumboGPSemail', response.user.email)

        window.location.replace('/')

    }

    register.disabled = false

})