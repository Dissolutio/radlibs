import React from "react"
import { Grommet, grommet, Box, Heading, Tab, Tabs } from "grommet"

import { RegisterForm } from "./components/RegisterForm"
import { useAuthContext, useFirebaseContext } from "./firebase"
import { SignInForm } from "./components/SignInForm"
import { PostForm } from "./components/PostForm"
import { PostList } from "./components/PostList"
import { AdminPostList } from "./components/AdminPostList"
import { SignOutButton } from "./components/SignOutButton"

export const App = () => {
  const firebaseApp = useFirebaseContext()
  const { user } = useAuthContext()

  const [state, setState] = React.useState({
    approvedPosts: [],
    unapprovedPosts: [],
    deletedPosts: [],
  })

  // ATTACH POST LISTENERS
  React.useEffect(() => {
    const approvedPosts = firebaseApp.dbPostsApproved()
    const unapprovedPosts = firebaseApp.dbPostsUnapproved()
    const deletedPosts = firebaseApp.dbPostsDeleted()
    async function attachFirebaseRDSListeners() {
      approvedPosts.on("value", (snapshot) => {
        const approvedPosts = Object.values(snapshot.val() || {})
        setState((state) => ({ ...state, approvedPosts }))
      })
      unapprovedPosts.on("value", (snapshot) => {
        const unapprovedPosts = Object.values(snapshot.val() || {})
        setState((state) => ({ ...state, unapprovedPosts }))
      })
      deletedPosts.on("value", (snapshot) => {
        const deletedPosts = Object.values(snapshot.val() || {})
        setState((state) => ({ ...state, deletedPosts }))
      })
    }
    attachFirebaseRDSListeners()
    return () => {
      approvedPosts.off()
      unapprovedPosts.off()
      deletedPosts.off()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Grommet theme={grommet} full>
      <Box pad="medium">
        <Tabs>
          <Tab title="Posts">
            <Box fill="horizontal">
              <PostList
                unapprovedPosts={state.unapprovedPosts}
                approvedPosts={state.approvedPosts}
                deletedPosts={state.deletedPosts}
              />
            </Box>
          </Tab>
          <Tab title="New Post">
            <Box fill="horizontal">
              <PostForm />
            </Box>
          </Tab>
          <Tab title={user ? "Sign out" : "Sign in"}>
            <Box
              direction="column"
              justify="start"
              align="center"
              fill="horizontal"
              pad="medium"
              margin={{ top: "medium" }}
            >
              <AuthTabs />
            </Box>
          </Tab>
          {user && (
            <Tab title="Admin">
              <Box fill="horizontal">
                <AdminPostList
                  unapprovedPosts={state.unapprovedPosts}
                  approvedPosts={state.approvedPosts}
                  deletedPosts={state.deletedPosts}
                />
              </Box>
            </Tab>
          )}
        </Tabs>
      </Box>
    </Grommet>
  )
}

const AuthTabs = () => {
  const { user } = useAuthContext()
  return user ? (
    <SignOutButton />
  ) : (
    <Tabs alignControls="start">
      <Tab title="Sign In">
        <Box
          direction="column"
          justify="start"
          align="stretch"
          fill="horizontal"
          pad="medium"
        >
          <SignInForm />
        </Box>
      </Tab>
      <Tab title="Sign Up">
        <Box pad="medium">
          <RegisterForm />
        </Box>
      </Tab>
    </Tabs>
  )
}
