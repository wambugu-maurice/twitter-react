import { getAuth, signOut } from "firebase/auth";
import toast from "react-hot-toast";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";


function LogoutModal() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const navigate = useNavigate()

    const auth = getAuth();
    async function handleLogout() {
        try {
            await signOut(auth)
            navigate("login")
            toast.success("Loggout successfull")
              
        } catch (error) {
            toast.error("Failed to logout",error)
        }
        
    }
  return (
    <div>
        <Button onClick={onOpen} bg={"blue.500"} color={"white"} width={"150px"} marginTop={"20px"}>Logout</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Logout</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Are you sure you want to logout</p>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button bg={"red.500"} color={"white"} onClick={handleLogout}>Yes</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </div>
  )
}

export default LogoutModal