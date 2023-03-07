function onLoad(){
    if (getCookieToken() == null) {
        location.href = "login_signup";
    } 
}