import React, { useEffect, useState } from "react";
import { Button, Container, Form,Image, Nav, Navbar } from "react-bootstrap";
import { addDoc,collection } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth,db,storage } from "../firebase";
import { signOut } from "firebase/auth";
import { getDownloadURL, ref,uploadBytes } from "firebase/storage";

export default function PostPageAdd() {
  const [user,loading] = useAuthState(auth);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("https://zca.sg/img/2");
  const navigate = useNavigate();

  async function addPost() {
    // reserve a spot in storage of firebase for some image file, the file name also specified by image.name
    const imageReference = ref (storage,`images/${image.name}`);
    //upload a image which is blob to the reserve spot which represented by imageReference
    const response = await uploadBytes(imageReference,image);
    //get the URL saved in the cloud of firebase, the URL  point to this image file, not the image file folder
    const imageURL = await getDownloadURL(response.ref);

    await addDoc(collection(db,"posts"),{caption,image:imageURL,imageName:image.name});
    navigate("/");
  }

  useEffect(() => {
    if(loading) return;
    if(!user) return navigate("/login");
  }, [navigate,user,loading]);

  return (
    <>
      <Navbar variant="light" bg="light">
        <Container>
          <Navbar.Brand href="/">Tinkergram</Navbar.Brand>
          <Nav>
            <Nav.Link href="/add">New Post</Nav.Link>
            <Nav.Link onClick={ (e)=> {
              signOut(auth);
            }}>🚪</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <h1 style={{ marginBlock: "1rem" }}>Add Post</h1>
        <Form>
          <Form.Group className="mb-3" controlId="caption">
            <Form.Label>Caption</Form.Label>
            <Form.Control
              type="text"
              placeholder="Lovely day"
              value={caption}
              onChange={(text) => setCaption(text.target.value)}
            />
          </Form.Group>
          <Image
            src = {previewImage}
            style ={
              {
                objectFit:"cover",
                width:"10rem",
                height:"10rem",
              }
            }
          />
           <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file" 
              onChange={(e) => {
                if (e.target.files.length === 0) return;
                const imgFile =  e.target.files[0];
                const previewImage = URL.createObjectURL(imgFile);
                setImage(imgFile);
                setPreviewImage(previewImage);
              } }
            />
            <Form.Text className="text-muted">
              Make sure the url has a image type at the end: jpg, jpeg, png.
            </Form.Text>
          </Form.Group>
          <Button variant="primary" onClick={async (e) => addPost()}>
            Submit
          </Button>
        </Form>
      </Container>
    </>
  );
}
