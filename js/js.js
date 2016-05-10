$(function () {
    $("#register_logout").click(function(){
    var ref = new Firebase("https://torrid-fire-4098.firebaseio.com");

    ref.unauth();
    
    ref.onAuth(function(authData) {
    if (authData) {
    console.log("Logged in");
    } else {
    console.log("Logged out");
    window.location.href="index.html";
    }
    });
    

    });


    $( "#login_button" ).click(function() {

    var loginEmail = $("#login_email").val();
    var loginPassword = $("#login_password").val();

    console.log(loginPassword);
    var ref = new Firebase("https://torrid-fire-4098.firebaseio.com");

    ref.authWithPassword({
    email    : loginEmail,
    password : loginPassword
      }, function (error, authData) {
    if (error) {
    console.log("Login Failed!", error);
  } else {
    console.log("Authenticated successfully with payload:", authData);
    localStorage.setItem("Greeting", loginEmail);
    window.location.href="index2.html";
  }

  });
  });





  $( "#register_button" ).click(function() {

  alert( " Successful, You can log in now! " );
    var ref = new Firebase("https://torrid-fire-4098.firebaseio.com");
 

  var email = $("#register_email").val();
  var password = $("#register_password").val();

  console.log(email);
  console.log(password);

  ref.createUser({
    email    : email,
    password : password
    }, function(error, userData) {
        if (error) {
                console.log("Error creating user:", error);
        } else {
                 console.log("Successfully created user account with uid:", userData.uid);
        }
    });
                 
});

  $("button").click(function(){
        $("img").toggle();
    });

});
