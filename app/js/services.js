
// argoumich.service ('$login', function($location) {
//   this.$fb_login = function() {
//     console.log("Signing in with Facebook");
//     //Use Firebase's SDK to handle the login functionality
//     firebase.auth().signInWithPopup(provider).then(function(result) {
//       // This gives you a Facebook Access Token. You can use it to access the Facebook API.
//       var token = result.credential.accessToken;
//       // The signed-in user info.
//       var user = result.user;

//       var facebook_id = user.providerData[0].uid;
//       var profpic = user.providerData[0].photoURL;

//       //Check to see if the user already has an account; if not, make one.
//       ref.once("value", function(snapshot) {
//         var user_path = "Users/" + facebook_id; //The key for each user is their Facebook ID
//         if(snapshot.child(user_path).exists()) {
//           console.log("User already has account");

//           //Update user's profile picture
//           firebase.database().ref(user_path).update({
//             profpic: profpic
//           });

//           //This snippet of code just ensures that the e-mail in the RealTime database matches the one
//           //in the "Auth" section of Firebase. There may be a possibility that they are not equal when
//           //the user changes the e-mail. This is because the "updateEmail" function that is used will stop working
//           //if the user hasn't logged in recently, so this is just a safety check.
//           var email = snapshot.val()["Users"][facebook_id]["email"];

//           //get the user's friends and store them in the database.
//           //this will be used for the matching algorithm
//           fb_api_url = '/me/friends?access_token=' + token;
//           FB.api(fb_api_url, function(friends) {
//             //Give fbfriends in the database a default value if the friends returned by API is empty
//             var fb_friends = friends;
//             if (!fb_friends.data.length) {
//               fb_friends = '';
//             }
//             firebase.database().ref(user_path).update({
//               fbfriends: fb_friends
//             });
//           });

//           var url_params = $location.search();
//           var hash = url_params['id'];
//           var redirectUrl = "?id=" + hash;
//           console.log(url_params);

//           //if there's a hash, that means the user has come from the confirmation e-mail.
//           if(hash){
//             window.location = "/#/profile" + "?id=" + hash;
//           } else {
//             window.location = "/#/profile";
//           }
//         }
//         else {
//           console.log("First time sign up");
//           var fb_api_url = '/me?fields=first_name,last_name,email&access_token=' + token;
//           //Make a call to Facebook's Graph API to get the user's basic info
//           FB.api(fb_api_url, function(response) {

//             //get the user's friends and store them in the database.
//             //this will be used for the matching algorithm
//             fb_api_url = '/me/friends?access_token=' + token;
//             FB.api(fb_api_url, function(friends) {
//               //Give fbfriends in the database a default value if the friends returned by API is empty
//               var fb_friends = friends;
//               if (!fb_friends.data.length) {
//                 fb_friends = '';
//               }
//               //Add the user to the database
//               firebase.database().ref(user_path).set({
//                 //Force email to be default so they change it. Can find the value of "default_email" in controllers.js
//                 email: default_email,
//                 firebase_id: user.uid,
//                 firstname: response.first_name,
//                 lastname: response.last_name,
//                 location: "TBD",
//                 phonenum: "",
//                 profpic: profpic,
//                 responded: false,
//                 timeslot: "000",
//                 fbfriends: fb_friends
//               });

//               console.log("User email successfully added");
//               //Take the new user to the e-mail page to give them a chance to change e-mails.
//               window.location = "/#/email";

//             });
//           });
//         }
//       });
//      }).catch(function(error) {
//         // Handle Errors here.
//         var errorCode = error.code;
//         var errorMessage = error.message;
//         // The email of the user's account used.
//         var email = error.email;
//         // The firebase.auth.AuthCredential type that was used.
//         var credential = error.credential;
//     });
//   }
// });
