import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Box, Typography, List, ListItem, Button } from "@mui/material";

function Content({ userId }) {
  const { subjectId } = useParams();
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const fetchTopics = async () => {
      const docRef = doc(db, "subjects", subjectId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTopics(docSnap.data().topics || []);
      }
    };
    fetchTopics();
  }, [subjectId]);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Contenido de {subjectId}
      </Typography>
      <List>
        {topics.map((topic, index) => (
          <ListItem key={index}>
            <Typography variant="body1">{topic}</Typography>
            <Button variant="contained" color="primary" sx={{ marginLeft: 2 }}>
              Completar
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default Content;
