import React, { useState } from "react"
import {
  Box,
  Heading,
  Form,
  FormField,
  TextInput,
  Paragraph,
  Button,
  Select,
} from "grommet"
import { format } from "date-fns"
import { data } from "../data"
import { useFirebaseContext } from "../firebase"

export const PostForm = () => {
  const firebaseApp = useFirebaseContext()
  const initialValue = { name: "", subject: "", verb: "", object: "" }
  const [state, setState] = useState(initialValue)
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")

  const saveNewPost = ({ value }) => {
    const isInvalid =
      value.subject === "" ||
      value.verb === "" ||
      value.object === "" ||
      value.name === ""
    if (!isInvalid) {
      const createdAt = new Date().toString()
      const newPost = {
        name: value.name,
        subject: value.subject,
        verb: value.verb,
        object: value.object,
        createdAt,
      }
      return firebaseApp
        .dbSaveUserPost(newPost)
        .then((response) => console.log(response))
        .then(() => setState(initialValue))
        .then(() =>
          setFormSuccess("Your post has been submitted for admin approval")
        )
        .catch((error) => setFormError(error))
    } else {
      setFormError("Please fill out the whole form.")
    }
  }

  return (
    <Box align="center" justify="center" fill="horizontal">
      <Form
        value={state}
        onReset={() => setState(initialValue)}
        // onSubmit={(value) => {
        //   console.log(`PostForm -> value`, value.value)
        // }}
        onSubmit={saveNewPost}
      >
        <Heading level="1">Create a Post</Heading>
        {formError && <Paragraph color="status-error">{formError}</Paragraph>}
        {formSuccess && <Paragraph color="status-ok">{formSuccess}</Paragraph>}

        <Box margin="medium">
          <FormField name="name" htmlFor="text-input-post-name" label="Name">
            <TextInput
              id="text-input-post-name"
              name="name"
              onChange={(event) => {
                const newValue = event.target.value
                setState((state) => ({
                  ...state,
                  name: newValue,
                }))
              }}
            />
          </FormField>
        </Box>
        <Box direction="row" gap="medium" fill="horizontal">
          <Select
            options={[...data.subject1, ...data.subject2]}
            value={state.subject}
            onChange={({ option }) =>
              setState((state) => ({ ...state, subject: option }))
            }
          />
          <Select
            // options={[...data.verb1, ...data.verb2]}
            options={[...data.verb]}
            value={state.verb}
            onChange={({ option }) =>
              setState((state) => ({ ...state, verb: option }))
            }
          />
          <Select
            options={[...data.object]}
            value={state.object}
            onChange={({ option }) =>
              setState((state) => ({ ...state, object: option }))
            }
          />
        </Box>
        <Box direction="row" gap="medium" margin="medium">
          <Button type="submit" primary label="Submit" />
          <Button type="reset" label="Reset" />
        </Box>
      </Form>
    </Box>
  )
}
