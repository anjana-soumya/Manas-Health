function logout() {
  fetch('/logout', {
    method:'GET',
    headers:{
      'Content-Type': 'application/json',
    },
  })
  .then(response=>{
    if(response.ok){
    window.location.replace('/loginPage');
    }else{
     alert("Response is not ok");
    }
  })
  .catch(error=>{
    alert("Error logging out. Please try again.");
    console.log(error);
  })
}