import React, { useContext } from "react"

const FirebaseContext = React.createContext({})

const useFirebaseContext = () => {
  const firebaseApp = useContext(FirebaseContext)
  return firebaseApp
}

export { FirebaseContext, useFirebaseContext }
