import app from "firebase/app"
import "firebase/auth"
import "firebase/database"

const config = {
  apiKey: process.env.REACT_APP_FIRE_APIKEY,
  authDomain: process.env.REACT_APP_FIRE_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_FIRE_DB_URL,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
}
class Firebase {
  constructor() {
    app.initializeApp(config)
    this.auth = app.auth()
    this.db = app.database()
    this.EmailAuthProvider = app.auth.EmailAuthProvider
  }
  doCreateNewUser = (email, username, password) => {
    return this.auth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        console.log("Created User", result)
        return this.dbSaveNewUser({
          uid: result.user.uid,
          email: result.user.email,
          username,
        })
      })
      .catch((error) => error)
  }
  doSignInWithEmailAndPassword = (email, password) => {
    return this.auth.signInWithEmailAndPassword(email, password)
  }
  doPasswordReset = (email) => {
    return this.auth.sendPasswordResetEmail(email)
  }
  doPasswordUpdate = (password) => {
    return this.auth.currentUser.updatePassword(password)
  }
  doSignOut = () => {
    return this.auth.signOut()
  }
  doSendEmailVerification = () => {
    return this.auth.currentUser.sendEmailVerification({
      url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
    })
  }

  // *** Dev API ***
  dbBlowItAllAway = async () => {
    await this.db.ref("/users").remove()
    await this.db.ref("/posts").remove()
    return
  }

  // *** Users API ***
  dbUsers = () => this.db.ref(`/users`)
  dbUserById = (uid) => this.db.ref(`/users/${uid}`)
  dbSaveNewUser = (user) => {
    const { uid } = user
    this.dbUserById(uid).set({
      ...user,
    })
  }
  // *** Posts API ***
  dbPostsApproved = () => this.db.ref("posts/approved")
  dbPostsUnapproved = () => this.db.ref("posts/unapproved")
  dbPostsDeleted = () => this.db.ref("posts/deleted")
  dbSaveUserPost = (post) => {
    return this.dbPostsUnapproved()
      .push()
      .then((ref) => {
        ref.set({
          ...post,
          uid: ref.key,
        })
        return ref.key
      })
  }
  // dbApprovePost = (post) => {
  //   return this.dbPostsUnapproved.push(post)
  // }
}

export { Firebase }
