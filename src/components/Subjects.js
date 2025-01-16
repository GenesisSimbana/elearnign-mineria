import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { Box, Typography, List, ListItem, ListItemText, Paper } from "@mui/material";

function Subjects() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      const querySnapshot = await getDocs(collection(db, "subjects"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setSubjects(data);
    };
    fetchSubjects();
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Materias
      </Typography>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <List>
          {subjects.map((subject) => (
            <ListItem key={subject.id} component={Link} to={`/content/${subject.id}`}>
              <ListItemText primary={subject.name} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

export default Subjects;
