function deconnect(event){
  event.preventDefault();
  deleteCookie(getCookieToken());
  console.log("On se déconnecte.");
  location.replace('/');
}