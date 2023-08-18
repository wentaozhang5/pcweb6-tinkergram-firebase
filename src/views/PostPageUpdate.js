import React, { useEffect, useState } from "react";
import { Button, Container, Form,Image, Nav, Navbar } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db,storage } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { getDownloadURL,ref,uploadBytes } from "firebase/storage";
import { deleteObject } from "firebase/storage";

export default function PostPageUpdate() {
  const params = useParams();
  const id = params.id;
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [imageName,setImageName] = useState("");
  const [previewImage,setPreviewImage] =useState("https://zca.sg/img/2");
  const [user,loading] = useAuthState(auth);
  const navigate = useNavigate();

  async function updatePost() {

   
    if(image)
    {
       // Create a reference point to the file to be deleted
      const deleteRef = ref(storage, `images/${imageName}`);
    // Delete the file
      deleteObject(deleteRef).then(() => {
      console.log(" File deleted successfully!");
      }).catch((error) => {
      console.error(error.message);
      });
   }
    const imageReference = ref (storage,`images/${image.name}`);
    const response = await uploadBytes(imageReference,image);
    const imageURL = await getDownloadURL(response.ref);
    await updateDoc(doc(db,"posts",id),{ caption,image:imageURL,imageName:image.name });
    navigate("/");
  }

  async function getPost(id) {
    const postDoc = await getDoc(doc(db,"posts",id));
    const postInfo = postDoc.data();
    console.log(postInfo);
    setCaption(postInfo.caption);
    //setImage(postInfo.image);
    setPreviewImage(postInfo.image);
    setImageName(postInfo.imageName);
  }


  useEffect(() => {
    if(loading) return;
    if(!user) return navigate("/login");
    getPost(id);
  }, [id,navigate,user,loading]);

  return (
    <div>
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
        <h1 style={{ marginBlock: "1rem" }}>Update Post</h1>
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
                if(e.target.files.length === 0 ) {
                  getPost(id);
                  setImage("");  
                  return;
                }
                const imgFile =  e.target.files[0];
                const previewImage = URL.createObjectURL(imgFile);
                setImage(imgFile);
                setPreviewImage(previewImage);
              } }
            />
          </Form.Group>
          <Button variant="primary" onClick={(e) => updatePost()}>
            Submit
          </Button>
        </Form>
      </Container>
    </div>
  );
}
