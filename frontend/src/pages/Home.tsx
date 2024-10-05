import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

// @ts-ignore
import { db, auth } from "../server/firebase";

// Import Firebase auth types
import { User } from "firebase/auth"; 
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, DocumentData } from "firebase/firestore";



function Home() {

    const [loggedInUser, setLoggedInUser] = useState<DocumentData | undefined>(undefined);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in
                console.log(user);

                setIsAuthenticated(true);

                const uid = user.uid;

                const docRef = doc(db, "users", uid);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                  console.log("Document data:", docSnap.data());
                  setLoggedInUser(docSnap.data());
                } else {
                  // docSnap.data() will be undefined in this case
                  console.log("No such document!");
                }
            } else {
                // User is signed out
                // ...
                console.log("no user signed in")
            }
        });
    }, [])


    return (
        <>
            <Navbar user={loggedInUser} isAuth={isAuthenticated}/>
            <h1>Home</h1>
            {loggedInUser !== undefined ? (

                <>
                    <p>Welcome, {loggedInUser?.username}</p>   


                </>
            ) : null}
        </>
    )
}

export default Home;
