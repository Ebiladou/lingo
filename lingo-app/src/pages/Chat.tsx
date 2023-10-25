import {
  Avatar,
  Center,
  HStack,
  Heading,
  Button,
  Box,
  Flex,
  Input,
  Grid,
  GridItem,
  Text
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import socket from "../socket";

interface Users {
  username: string;
  userID: string;
}

interface Message {
  content: string;
  userID: string;
}

function Chat() {
  const [users, setUsers] = useState<Users[]>([]);

  useEffect(() => {
    socket.on("users", (users_from) => {
      console.log(users_from);
      setUsers(users_from);
    });

    socket.on("user connected", (user_in) => {
      setUsers([...users, user_in]);
    });

    return () => {
      socket.off("users");
      socket.off("user connected");
    };
  }, [users]);

  //details
  const { userID } = useParams();

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    socket.on("private message", ({ content, from }) => {
      setMessages([...messages, { content, userID: from }]);
    });
  });

  function sendMessage(content: string) {
    socket.emit("private message", {
      content,
      to: userID,
    });
    setMessages([...messages, { content, userID: socket.id }]);
    setText("");
  }

  return (
    <>
    <Box h={"100vh"} bg={"black.400"}>
    <Grid templateColumns={"25% 75%"} bg={"green.500"}>
    <GridItem bg={"teal.800"}>
      <Center>
        <Heading color="green.400">List of chats</Heading>
      </Center>
      {users.map(({ username }, index) => (
        <HStack
          boxShadow="base"
          borderColor="green.200"
          borderRadius={4}
          cursor="pointer"
          p={2}
          mx={2}
          my={2}
          key={index}
        >
          <Avatar
            name={username}
            src="https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg"
          />
          <Text color={"yellow.500"}>{username}</Text>
        </HStack>
      ))}
      </GridItem>

      <GridItem bg={"teal.600"}>
      <Flex direction="column" h="100vh" padding={4} position={"relative"}>
        <Box mb={10} flex={1} overflow="auto">
          {messages.map((message, index) => (
            <Box key={index} border={"1px"} borderRadius={"2xl"} marginBottom={"1.5"} maxWidth={"280px"} wordBreak={"break-word"} padding={"3"} color={"whiteAlpha.800"} borderColor={"black"}>
              <strong>{message.userID} </strong>
              {message.content}
            </Box>
          ))}
        </Box>
        <Box pos="absolute" left={0} bottom={1} right={0}>
          <HStack paddingX={10}>
            <Input
              value={text}
              placeholder="Enter message"
              style={{ backgroundColor: "white" }}
              onChange={(event) => setText(event.target.value)}
            />
            <Button
              onClick={() => sendMessage(text)}
              isDisabled={text === ""}
              colorScheme="green"
            >
              Send
            </Button>
          </HStack>
        </Box>
      </Flex>
      </GridItem>
      </Grid>
      </Box>
    </>
  );
}

export default Chat;
