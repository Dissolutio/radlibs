import React, { useContext, useState, useEffect } from "react"

const AuthContext = React.createContext({
  initializing: true,
  user: null,
})
const useAuthContext = () => {
  const authState = useContext(AuthContext)
  return authState
}
const useAuthListener = (firebaseApp) => {
  const [authState, setAuthState] = useState(() => {
    const user = firebaseApp.auth.currentUser
    return { initializing: !user, user }
  })
  async function onChange(user) {
    console.log("AUTH STATE CHANGED")
    if (user) {
      const dbUser = await firebaseApp
        .dbUserById(user.uid)
        .once("value")
        .then((snapshot) => snapshot.val())
      const mergedUser = {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        providerData: user.providerData,
        username: dbUser.username,
      }
      setAuthState({ initializing: false, user: mergedUser })
      return
    } else {
      setAuthState({ initializing: false, user: null })
    }
  }
  useEffect(() => {
    const unsubscribe = firebaseApp.auth.onAuthStateChanged(onChange)
    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return authState
}
export { AuthContext, useAuthContext, useAuthListener }
