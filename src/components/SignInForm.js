import React, { useState } from "react"
import {
  Box,
  Heading,
  Paragraph,
  Button,
  Form,
  FormField,
  TextInput,
} from "grommet"

import { useFirebaseContext, useAuthContext } from "../firebase"
import { SignOutButton } from "./SignOutButton"

export const SignInForm = () => {
  const firebaseApp = useFirebaseContext()
  const { user } = useAuthContext()

  const initialValue = {
    email: "",
    password: "",
  }

  const [state, setState] = React.useState(initialValue)
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")

  const onFormSubmit = ({ value }) => {
    const isInvalid = value.email === "" || value.password === ""
    if (!isInvalid) {
      firebaseApp
        .doSignInWithEmailAndPassword(value.email, value.password)
        .then((response) => console.log(response))
        .then(() => setState(initialValue))
        .then(() => setFormSuccess("You have been logged in!"))
        .catch((error) => {
          console.log(error)
          setFormError(error)
        })
    } else {
      setFormError("Please enter your username and password")
    }
  }
  if (user) {
    return (
      <Box>
        <Paragraph>You are currently signed in as {user.username}</Paragraph>
        <SignOutButton />
      </Box>
    )
  }
  return (
    <Box>
      <Form
        value={state}
        onReset={() => setState(initialValue)}
        onSubmit={onFormSubmit}
      >
        <Heading level="1">Sign In</Heading>

        {formError && <Paragraph color="status-error">{formError}</Paragraph>}

        {formSuccess && <Paragraph color="status-ok">{formSuccess}</Paragraph>}

        <FormField
          name="email"
          htmlFor="text-input-sign-in-email"
          label="Email"
        >
          <TextInput
            id="text-input-sign-in-email"
            name="email"
            onChange={(event) => {
              const newValue = event.target.value
              setState((state) => ({
                ...state,
                email: newValue,
              }))
            }}
          />
        </FormField>

        <FormField
          name="password"
          htmlFor="text-input-sign-in-password"
          label="Password"
        >
          <TextInput
            id="text-input-sign-in-password"
            name="password"
            onChange={(event) => {
              const newValue = event.target.value
              setState((state) => ({
                ...state,
                password: newValue,
              }))
            }}
          />
        </FormField>
        <Box direction="row" margin={{ top: "large" }}>
          <Button type="submit" primary label="Sign In" margin="small" />
          <Button type="reset" label="Reset" margin="small" />
        </Box>
      </Form>
    </Box>
  )
}
