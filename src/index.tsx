import React, { ReactNode } from "react"
import ReactDOM from "react-dom"
import {
  Firebase,
  FirebaseContext,
  useFirebaseContext,
  AuthContext,
  useAuthListener,
} from "./firebase"
import { App } from "./App"
import * as serviceWorker from "./serviceWorker"

const firebaseApp = new Firebase()

const FirebaseWrapper: React.SFC = ({ children }) => {
  return (
    <FirebaseContext.Provider value={firebaseApp}>
      {children}
    </FirebaseContext.Provider>
  )
}
const AuthWrapper: React.SFC = ({ children }) => {
  const firebaseApp = useFirebaseContext()
  const authState = useAuthListener(firebaseApp)
  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <FirebaseWrapper>
      <AuthWrapper>
        <App />
      </AuthWrapper>
    </FirebaseWrapper>
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
