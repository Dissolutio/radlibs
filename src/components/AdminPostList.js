import React from "react"
import { Box, Heading, List, Text, Paragraph, Button } from "grommet"
import { Validate, Trash, Close } from "grommet-icons"
import { format } from "date-fns"
import { useFirebaseContext, useAuthContext } from "../firebase"

export const AdminPostList = ({
  approvedPosts,
  unapprovedPosts,
  deletedPosts,
}) => {
  const firebaseApp = useFirebaseContext()
  const { user } = useAuthContext()
  if (!user) {
    return null
  }
  const dataApproved = approvedPosts.map((post) => {
    const { subject, verb, object, createdAt } = post
    const radlib = `${subject} ${verb} ${object}.`
    const postDate = format(new Date(createdAt), "MMM dd")
    return { radlib, postDate, ...post }
  })

  const dataUnapproved = unapprovedPosts.map((post) => {
    const { subject, verb, object, createdAt } = post
    const radlib = `${subject} ${verb} ${object}.`
    const postDate = format(new Date(createdAt), "MMM dd")
    return { radlib, postDate, ...post }
  })
  const dataDeleted = deletedPosts.map((post) => {
    const { subject, verb, object, createdAt } = post
    const radlib = `${subject} ${verb} ${object}.`
    const postDate = format(new Date(createdAt), "MMM dd")
    return { radlib, postDate, ...post }
  })

  const approvePost = (item) => {
    let updates = {}
    updates["/posts/approved/" + item.uid] = item
    updates["/posts/unapproved/" + item.uid] = null
    return firebaseApp.db.ref().update(updates)
  }
  const unapprovePost = (item) => {
    let updates = {}
    updates["/posts/unapproved/" + item.uid] = item
    updates["/posts/approved/" + item.uid] = null
    return firebaseApp.db.ref().update(updates)
  }
  const deletePost = (item) => {
    let updates = {}
    updates["/posts/deleted/" + item.uid] = item
    updates["/posts/unapproved/" + item.uid] = null
    return firebaseApp.db.ref().update(updates)
  }
  const fullyDeletePost = (item) => {
    let updates = {}
    updates["/posts/deleted/" + item.uid] = null
    return firebaseApp.db.ref().update(updates)
  }
  return (
    <Box fill="horizontal">
      <Heading level="2">Approved Posts</Heading>
      <List
        data={dataApproved}
        children={(item, index) => {
          return (
            <ApprovedListItem
              item={item}
              index={index}
              unapprovePost={unapprovePost}
            />
          )
        }}
      />
      <Heading level="2">Unapproved Posts</Heading>
      <List
        data={dataUnapproved}
        children={(item, index) => {
          return (
            <UnapprovedListItem
              item={item}
              index={index}
              approvePost={approvePost}
              deletePost={deletePost}
            />
          )
        }}
      />
      <Heading level="2">Deleted Posts</Heading>
      <List
        data={dataDeleted}
        children={(item, index) => {
          return (
            <DeletedListItem
              item={item}
              index={index}
              fullyDeletePost={fullyDeletePost}
            />
          )
        }}
      />
    </Box>
  )
}

const ApprovedListItem = ({ item, index, unapprovePost }) => {
  return (
    <Box direction="column" align="center">
      <Box>
        <Paragraph color="brand" size="large">
          {item.radlib}
        </Paragraph>
      </Box>
      <Box direction="row" justify="center" align="center">
        <Text weight="bold" size="">
          -{item.name}
        </Text>
        <Text color="dark-4" size="small" margin={{ left: "small" }}>
          {item.postDate}
        </Text>
      </Box>
      <Box
        direction="row"
        fill="horizontal"
        justify="end"
        align="center"
        margin={{ vertical: "small" }}
      >
        <Button
          icon={<Close color="status-error" size="medium" />}
          onClick={() => unapprovePost(item)}
        />
      </Box>
    </Box>
  )
}

const UnapprovedListItem = ({ item, index, approvePost, deletePost }) => {
  return (
    <Box direction="column" align="center">
      <Box>
        <Paragraph color="brand" size="large">
          {item.radlib}
        </Paragraph>
      </Box>
      <Box direction="row" justify="center" align="center">
        <Text weight="bold" size="">
          -{item.name}
        </Text>
        <Text color="dark-4" size="small" margin={{ left: "small" }}>
          {item.postDate}
        </Text>
      </Box>
      <Box
        direction="row"
        fill="horizontal"
        justify="between"
        align="center"
        margin={{ vertical: "small" }}
      >
        <Button
          icon={<Validate color="status-ok" size="medium" />}
          onClick={() => approvePost(item)}
        />
        <Button
          icon={<Trash color="status-error" size="medium" />}
          onClick={() => deletePost(item)}
        />
      </Box>
    </Box>
  )
}
const DeletedListItem = ({ item, index, fullyDeletePost }) => {
  return (
    <Box direction="column" align="center">
      <Box>
        <Paragraph color="brand" size="large">
          {item.radlib}
        </Paragraph>
      </Box>
      <Box direction="row" justify="center" align="center">
        <Text weight="bold" size="">
          -{item.name}
        </Text>
        <Text color="dark-4" size="small" margin={{ left: "small" }}>
          {item.postDate}
        </Text>
      </Box>
      <Box
        direction="row"
        fill="horizontal"
        justify="end"
        align="center"
        margin={{ vertical: "small" }}
      >
        <Button
          icon={<Trash color="status-error" size="medium" />}
          onClick={() => fullyDeletePost(item)}
        />
      </Box>
    </Box>
  )
}
