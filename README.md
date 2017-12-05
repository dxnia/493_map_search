#Argo
Argo is an application which allows users to provide their availability & get matched (based on time and location alone) with other users for a blind "friend-date" at a local coffee shop.

###Tech notes:
**To run locally**, use the command
`firebase serve`
This will allow you to go to [localhost:5000](https://localhost:5000) and run locally

**To deploy**, use the command
`firebase deploy`
This will make the website live, **SO BE CAREFUL**.

**To run the serverside js** (scheduling, sending emails, etc) do
```
cd srv
node .
```
This runs `index.js`, which contains our serverside functions. For now it uses the [argo-dev](https://argo-dev.firebaseio.com/) firebase. 


####Follow us on:
[Facebook](https://www.facebook.com/argo.umich?fref=ts)

[Instagram](https://www.instagram.com/argofrienddate/)

[Devpost](http://devpost.com/software/argo-owz5s3)



