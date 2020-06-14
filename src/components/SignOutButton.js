import React from "react"
import { Button } from "grommet"
import { useFirebaseContext } from "../firebase"

export const SignOutButton = () => {
  const firebaseApp = useFirebaseContext()
  const onSignOutButtonClick = () => firebaseApp.doSignOut()
  return <Button onClick={onSignOutButtonClick} label="Sign Out"></Button>
}
