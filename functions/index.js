const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const firestore=admin.firestore();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});




class User{
	constructor(uid,name,email){
    this.uid=uid;
    this.name=name;
    this.email=email;
    }

    fromMap(map) {
        return new User(
            map['uid']??"",
            map['displayName']??"",
            map['email']??"",
        );
      }

    toMap(){
        return{
            "uid":this.uid,
            "name":this.name,
            "email":this.email,
            "role":"user",
        }
    }
}
exports.testApi = functions.https.onRequest(async(request,response)=>{
    try {
        switch (request.method) {
            case 'GET':
                var stuff = [];
                var snapshot=await firestore.collection("collection").get();
                console.log(snapshot.docs.length);
                // var child=new User('Swayam')
                // console.log(child.name)
                snapshot.docs.forEach(doc=>{
                    console.log(doc.data())
                    stuff=stuff.concat(new User().fromMap(doc.data()))
                }
                )
                response.send(stuff);
                break;
            case 'POST':
                const body= request.body;
                console.log(body['name'])
                response.send(body.logger)
                break;
            case 'DELETE':
                response.send('Hey this is DELETE');
                break;
            default:
                response.send('Hey this is DEFAULT');
                break;
        }
    } catch (error) {
        console.log(error)
        response.status(400).send('ERROR HOGAYA');          
    }
})

exports.userAdded= functions.auth.user().onCreate(async user=>{
    console.log('Adding user');
    var newUser=new User().fromMap(user);
    await firestore.collection('user').doc(newUser.uid).set(newUser.toMap());
    return Promise.resolve();
});

exports.userDeleted= functions.auth.user().onDelete(async user=>{
    console.log('Deleting user');
    var deletedUser=new User().fromMap(user);
    console.log(deletedUser.uid);
    console.log(deletedUser.email);
    await firestore.collection('user').doc(deletedUser.uid).delete();
    return Promise.resolve()
});

// exports.docsAdded= functions.firestore.document('test/{documentId}').onCreate((snapshot,context)=>{

// });