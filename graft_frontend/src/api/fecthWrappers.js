const fetchWithAuth = async (endpoint, options={}) => {
    const apiBase = process.env.REACT_APP_API_BASE;
    const url = `${apiBase}/${endpoint}`
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')

    options.headers = {
        'Content-Type': 'application/json',
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`
    };

    var response = await fetch(url, options)

    console.log(options)

    //access token has expired
    if(response.status === 401){
        const refreshUrl = `${apiBase}/auth/token/refresh/`
        const refreshResponse =  await fetch(refreshUrl, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({refresh: refreshToken}) 
        })

        if(refreshResponse.ok){
            const { access } = await refreshResponse.json()
            localStorage.setItem('accessToken', access)

            //retry original request
            options.headers.Authorization = `Bearer ${access}`
            response = await fetch(url, options)
        }else{
            //refresh expired or invalid
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            if(window.location.pathname !== '/login'){
                window.location.href = './login'
            }
        }
    }

    return response
}

const fetchWithLogin = async(username, password) => {
    console.log({username, password})
    const apiBase = process.env.REACT_APP_API_BASE;
    const url = `${apiBase}/auth/login/`
    const response = await fetch(url,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify({username, password})
      })
    
    return response
}

export {fetchWithAuth, fetchWithLogin};