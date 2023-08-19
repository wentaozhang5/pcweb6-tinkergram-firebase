import "./PostPageDetails.css";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Image, Nav, Navbar, Row } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDoc, deleteDoc, doc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { db, auth, storage } from "../firebase";
import { signOut } from "firebase/auth";
import { ref, deleteObject } from "firebase/storage";






export default function PostPageDetails() {

  const [likeCount, setLikeCount] = useState(50);
  const [dislikeCount, setDislikeCount] = useState(25);

  const [activeBtn, setActiveBtn] = useState("none");





  const [user, loading] = useAuthState(auth);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");
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
    await deleteDoc(doc(db, "posts", id));
    navigate("/");
  }

  async function getPost(id) {
    const postDoc = await getDoc(doc(db, "posts", id));
    const postInfo = postDoc.data();
    console.log(postInfo);
    setCaption(postInfo.caption);
    setImage(postInfo.image);
    setImageName(postInfo.imageName);
  }

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    getPost(id);
  }, [id, navigate, user, loading]);


  const handleLikeClick = () => {
    if (activeBtn === "none") {
      setLikeCount(likeCount + 1);
      setActiveBtn("like");
      return;
    }

    if (activeBtn === 'like') {
      setLikeCount(likeCount - 1);
      setActiveBtn("none");
      return;
    }

    if (activeBtn === "dislike") {
      setLikeCount(likeCount + 1);
      setDislikeCount(dislikeCount - 1);
      setActiveBtn("like");
    }
  };

  const handleDisikeClick = () => {
    if (activeBtn === "none") {
      setDislikeCount(dislikeCount + 1);
      setActiveBtn("dislike");
      return;
    }

    if (activeBtn === 'dislike') {
      setDislikeCount(dislikeCount - 1);
      setActiveBtn("none");
      return;
    }

    if (activeBtn === "like") {
      setDislikeCount(dislikeCount + 1);
      setLikeCount(likeCount - 1);
      setActiveBtn("dislike");
    }
  };



  return (
    <>
      <Navbar variant="light" bg="light">
        <Container>
          <Navbar.Brand href="/">Tinkergram</Navbar.Brand>
          <Nav>
            <Nav.Link href="/add">New Post</Nav.Link>
            <Nav.Link onClick={(e) => signOut(auth)}>🚪</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <Row style={{ marginTop: "2rem" }}>
          <Col md="6">
            <Image src={image} style={{ width: "100%", borderStyle:"solid" }} />
            <div className="container" id="myButtonArea">
              <div className="btn-container">
                <button id="like"
                  className={`btn ${activeBtn === 'like' ? 'like-active' : ''}`}
                  onClick={handleLikeClick}
                >
                  <span className="material-symbols-outlined">thumb_up</span>
                  Like {likeCount}
                </button>

                <button id="dislike"
                  className={`btn ${activeBtn === 'dislike' ? 'dislike-active' : ''}`}
                  onClick={handleDisikeClick}
                >
                  <span className="material-symbols-outlined">thumb_down</span>
                  Dislike {dislikeCount}
                </button>
              </div>
            </div>
          </Col>
          <Col>
            <Card bg="warning">
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
