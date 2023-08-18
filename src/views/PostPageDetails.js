import React, { useEffect, useState } from "react";
import { Card, Col, Container, Image, Nav, Navbar, Row } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDoc,deleteDoc,doc } from "firebase/firestore";
import { useNavigate,useParams } from "react-router-dom";
import { db,auth,storage } from "../firebase";
import { signOut } from "firebase/auth";
import {  ref, deleteObject } from "firebase/storage";






export default function PostPageDetails() {
  const [user,loading] = useAuthState(auth);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [imageName,setImageName] = useState("");
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();

  async function deletePost(id) {

    // Create a reference point to the file to be deleted
  const deleteRef = ref(storage, `images/${imageName}`);

// Delete the file
  deleteObject(deleteRef).then(() => {
  console.log(" File deleted successfully!");
  }).catch((error) => {
  console.error(error.message);
  });
    await deleteDoc(doc(db,"posts",id));
    navigate("/");
  }

  async function getPost(id) {
    const postDoc = await getDoc(doc(db,"posts",id));
    const postInfo = postDoc.data();
    console.log(postInfo);
    setCaption(postInfo.caption);
    setImage(postInfo.image);
    setImageName(postInfo.imageName);
  }

  useEffect(() => {
    if(loading) return;
    if(!user) return navigate("/login");
    getPost(id);
  }, [id,navigate,user,loading]);

  return (
    <>
      <Navbar variant="light" bg="light">
        <Container>
          <Navbar.Brand href="/">Tinkergram</Navbar.Brand>
          <Nav>
            <Nav.Link href="/add">New Post</Nav.Link>
            <Nav.Link onClick={ (e) => signOut(auth) }>🚪</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <Row style={{ marginTop: "2rem" }}>
          <Col md="6">
            <Image src={image} style={{ width: "100%" }} />
          </Col>
          <Col>
            <Card>
              <Card.Body>
                <Card.Text>{caption}</Card.Text>
                <Card.Link href={`/update/${id}`}>Edit</Card.Link>
                <Card.Link
                  onClick={() => deletePost(id)}
                  style={{ cursor: "pointer" }}
                >
                  Delete
                </Card.Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
