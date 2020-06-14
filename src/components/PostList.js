import React from "react"
import { Box, Heading, List, Text, Paragraph } from "grommet"
import { format } from "date-fns"

export const PostList = ({ approvedPosts, unapprovedPosts, deletedPosts }) => {
  const dataApproved = approvedPosts.map((post) => {
    const { subject, verb, object, createdAt } = post
    const radlib = `${subject} ${verb} ${object}.`
    const postDate = format(new Date(createdAt), "MMM dd")
    return { radlib, postDate, ...post }
  })

  return (
    <Box direction="column" fill="horizontal" alignContent="stretch">
      <Heading level="1" alignSelf="center">
        Radlibs
      </Heading>
      <List
        data={dataApproved}
        children={(item, index) => {
          return <ApprovedListItem item={item} index={index} />
        }}
      />
    </Box>
  )
}

const ApprovedListItem = ({ item, index }) => {
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
    </Box>
  )
}
