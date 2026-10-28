import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { NavLink, Outlet } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
const tabs = [
  { path: "", label: "Posts",},
  { path: "reposts", label: "Reposts" },
];

function Profile() {
  const [currentLoggedUser, setCurrentLoggedUser] = useState(null);
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  useEffect(() => {
    let unsubUser = null;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (unsubUser) {
        unsubUser();
        unsubUser = null;
      }

      if (!user) {
        setCurrentLoggedUser(null);
        return;
      }

      const userRef = doc(db, "users", user.uid);
      unsubUser = onSnapshot(
        userRef,
        (snap) => {
          setCurrentLoggedUser(
            snap.exists() ? { id: snap.id, ...snap.data() } : null,
          );
        },
        (err) => toast.error(err),
      );
    });

    return () => {
      unsubAuth();
      if (unsubUser) unsubUser();
    };
  }, []);

  async function handleBio(e) {
    e.preventDefault();

    if (!currentLoggedUser?.id) return;
    if (!bio.trim()) return;

    setLoading(true);
    try {
      const userRef = doc(db, "users", currentLoggedUser.id);
      await updateDoc(userRef, { bio: bio.trim() });
      toast.success("Bio updated");
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div className="userCard">
        <div className="userInfo">
          <div className="tweetAvatar">
            {currentLoggedUser?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="other">
            <h2>
              <strong>{currentLoggedUser?.name}</strong>
            </h2>
            <small> @{currentLoggedUser?.name}</small>
            <p>{currentLoggedUser?.bio}</p>
          </div>
          <div className="followersDiv">
            <div>
              <h2>
                <strong>Followers</strong>
              </h2>
              {currentLoggedUser?.followersCount ?? 0}
            </div>
            <div>
              <h2>
                <strong>Following</strong>
              </h2>
              {currentLoggedUser?.followingCount ?? 0}
            </div>
            <div>
              <Button ref={btnRef} colorScheme="blue" onClick={onOpen}>
                Update your bio
              </Button>

              <Drawer
                isOpen={isOpen}
                placement="right"
                onClose={onClose}
                finalFocusRef={btnRef}
              >
                <DrawerOverlay />
                <DrawerContent as="form" onSubmit={handleBio}>
                  <DrawerCloseButton />
                  <DrawerHeader>Add a bio</DrawerHeader>

                  <DrawerBody>
                    <Input
                      placeholder="Type here..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </DrawerBody>

                  <DrawerFooter>
                    <Button variant="outline" mr={3} onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      colorScheme="blue"
                      type="submit"
                      isLoading={loading}
                    >
                      Save
                    </Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>
        <div className="userActivity">
          <nav className="tabs">
            {tabs.map((t) => (
              <NavLink key={t.label} to={t.path} className="tab" end replace={true}>
                {t.label}
              </NavLink>
            ))}
          </nav>
          <Outlet />
        </div>
      </div>
    </section>
  );
}

export default Profile;
