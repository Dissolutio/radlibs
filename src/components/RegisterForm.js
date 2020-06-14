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

export const RegisterForm = () => {
  const firebaseApp = useFirebaseContext()
  const { user } = useAuthContext()
  const initialValue = {
    username: "",
    email: "",
    password: "",
    passwordVerify: "",
  }
  const [state, setState] = React.useState(initialValue)
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")

  const onFormSubmit = ({ value }) => {
    const isInvalid =
      value.email === "" ||
      value.username === "" ||
      value.password === "" ||
      value.password !== state.passwordVerify
    if (!isInvalid) {
      firebaseApp
        .doCreateNewUser(value.email, value.username, value.password)
        .then((response) => console.log(response))
        .then(() => setState(initialValue))
        .then(() => setFormSuccess("Your account has been created"))
        .catch((error) => setFormError(error))
    } else {
      setFormError(
        "You must enter a username, valid email address, and your passwords must match"
      )
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
        <Heading level="1">Sign Up</Heading>

        {formError && <Paragraph color="status-error">{formError}</Paragraph>}

        {formSuccess && <Paragraph color="status-ok">{formSuccess}</Paragraph>}

        <FormField
          name="username"
          htmlFor="text-input-register-username"
          label="Username"
        >
          <TextInput
            id="text-input-register-username"
            name="username"
            onChange={(event) => {
              const newValue = event.target.value
              setState((state) => ({
                ...state,
                username: newValue,
              }))
            }}
          />
        </FormField>

        <FormField
          name="email"
          htmlFor="text-input-register-email"
          label="Email"
        >
          <TextInput
            id="text-input-register-email"
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
          htmlFor="text-input-register-password"
          label="Password"
        >
          <TextInput
            id="text-input-register-password"
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

        <FormField
          name="password-verify"
          htmlFor="text-input-register-password-verify"
          label="Confirm Password"
        >
          <TextInput
            id="text-input-register-password-verify"
            name="password-verify"
            onChange={(event) => {
              const newValue = event.target.value
              setState((state) => ({
                ...state,
                passwordVerify: newValue,
              }))
            }}
          />
        </FormField>

        <Button type="submit" primary label="Sign Up!" />
      </Form>
    </Box>
  )
}
